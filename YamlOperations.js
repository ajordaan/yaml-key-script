const yaml = require('js-yaml');
const fs = require('fs');
/**
 * 
 * @param {Object} source An object representing a Yaml document
 * @param {Array<string>} missingKeys An array with the missing key path
 * @returns An object with the missing keys added to it
 */
function addOrReplaceKeys(source, missingKeys) {
  const doc = yaml.load(source);

  for (const key of missingKeys) {
    addKey(doc, key)
  }

  return yaml.dump(doc, { forceQuotes: true, quotingType: '"' })
}

function tsvToYaml(source, root) {
  const lines = source;
  const doc = {};
  doc[root] = {};

  for (const line of lines) {
    const columns = line.split("\t");

    const key = columns[0];
    const english = columns[1];
    const foreign = columns[2];

    if (key.includes("[")) {
      const arrayKey = key.split("[")[0];
      // Need to remove carriage returns (\r) from strings, not sure why they are there, could be a google docs export thing?
      addKey(doc[root], arrayKey, foreign.replace("\r", ""), true);
    }
    else {
      addKey(doc[root], key, foreign.replace("\r", ""));
    }
  }

  return yaml.dump(doc, { forceQuotes: true, quotingType: '"' })
}

function yamlToTsv(source, root, foreignLanguage) {
  const doc = yaml.load(source);

  const flatObject = flattenObject(doc[root]);

  let tsv = `Key\tEnglish\t${foreignLanguage}\n`;

  for (const key in flatObject) {
    tsv += `${key}\t${flatObject[key]}\t\n`
  }

  return tsv;
}

function flattenObject(ob) {
  const toReturn = {};

  for (const i in ob) {
    let isArray = false;
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) == 'object' && ob[i] !== null) {
      isArray = Array.isArray(ob[i]);
      var flatObject = flattenObject(ob[i]);

      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        isArray ? toReturn[`${i}[${x}]`] = flatObject[x] : toReturn[`${i}.${x}`] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

function addKey(doc, pathStr, keyValue = null, isArrayKey = false) {
  let obj = doc;
  let childKey = null;
  let parentObj = null;
  let keyPath = pathStr.split('.');
  let parentKeys = keyPath.length;
  for (let i = 0; i < parentKeys; i++) {

    parentObj = obj
    if (!obj[keyPath[i]]) {
      isArrayKey ? obj[keyPath[i]] = [] : obj[keyPath[i]] = {};
    }
    obj = obj[keyPath[i]];

    childKey = keyPath[i];
  }
  isArrayKey ? parentObj[childKey].push(keyValue) : parentObj[childKey] = keyValue;

}

function readFileLines(filename) {
  if (filename.split(".").pop() == "json") {
    const file = fs.readFileSync(filename, 'utf8');
    return JSON.parse(file);
  }
  else
    return fs.readFileSync(filename, 'utf8').toString().split("\n");
}

function readMissingKeys(filename = "missing_keys.txt") {
  return readFileLines(filename);
}

exports.addOrReplaceKeys = addOrReplaceKeys;
exports.readMissingKeys = readMissingKeys;
exports.tsvToYaml = tsvToYaml;
exports.readFileLines = readFileLines;
exports.yamlToTsv = yamlToTsv;