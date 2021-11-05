const yaml = require('js-yaml');
const fs = require('fs');

var argv = require('minimist')(process.argv.slice(2));

try {
  const sourceFile = argv.s ?? argv.source;
  const destFile = argv.d ?? argv.destination ?? "output.yml";
  const missingKeysFile = argv.m ?? argv.missingKeys ?? "missing_keys.txt"

  if (!fs.existsSync(missingKeysFile)) {
    console.log("Cannot find missing key file: " + missingKeysFile);
    return;
  }

  if (!sourceFile) {
    console.log("Source file must be specified")
    return;
  }

  if (!fs.existsSync(sourceFile)) {
    console.log("Cannot find source file: " + sourceFile);
    return;
  }

  AddOrReplaceKeys(sourceFile, destFile, missingKeysFile);

} catch (e) {
  console.log(e);
}

function AddOrReplaceKeys(sourceFile, destFile, missingKeysFile = "missing_keys.txt") {
  const doc = yaml.load(fs.readFileSync(sourceFile, 'utf8'));
  const missingKeys = readMissingKeys(missingKeysFile);

  for (const key of missingKeys) {
    addMissingKey(doc, key)
  }

  fs.writeFile(destFile, yaml.dump(doc, { forceQuotes: true, quotingType: '"' }), () => { console.log("done") });
}

function addMissingKey(doc, pathStr) {
  let obj = doc;
  let childKey = null;
  let parentObj = null;
  let keyPath = pathStr.split('.');
  let parentKeys = keyPath.length;
  for (let i = 0; i < parentKeys; i++) {

    parentObj = obj
    if (!obj[keyPath[i]]) {
      obj[keyPath[i]] = {};
    }
    obj = obj[keyPath[i]];

    childKey = keyPath[i];
  }
  parentObj[childKey] = null;

  console.log("Leaf Key: " + childKey);
}

function readMissingKeys(filename = "missing_keys.txt") {
  return fs.readFileSync(filename).toString().split("\n");
}