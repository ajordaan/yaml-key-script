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

  //  console.log("Leaf Key: " + childKey);
}

function readMissingKeys(filename = "missing_keys.txt") {
  return fs.readFileSync(filename).toString().split("\n");
}

exports.addOrReplaceKeys = addOrReplaceKeys;
exports.readMissingKeys = readMissingKeys;