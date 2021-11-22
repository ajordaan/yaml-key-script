const fs = require('fs');
const yamlKeyAdder = require('./YamlKeyAdder');
var argv = require('minimist')(process.argv.slice(2));

const action = argv.a ?? argv.action;

if (!action) {
  console.log("Please specify an action");
  return;
}

switch (action) {
  case "import":
    importYaml();
    break;
  case "add":
  case "addKeys":
    addMissingKeys();
    break;

  default: console.log("Invalid action")
}

function importYaml() {
  const sourceFile = argv.s ?? argv.source;
  const destFile = argv.d ?? argv.destination ?? "output.yml";
  const root = argv.r ?? argv.root;

  if (!sourceFile) {
    console.log("Source file must be specified")
    return;
  }

  if (!root) {
    console.log("Root key must be specified")
    return;
  }

  const yaml = yamlKeyAdder.tsvToYaml(yamlKeyAdder.readFileLines(sourceFile), root);

  fs.writeFile(destFile, yaml, () => { console.log(`Output written to ${destFile}`) });
}

function addMissingKeys() {
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
    const newYaml = yamlKeyAdder.addOrReplaceKeys(fs.readFileSync(sourceFile, 'utf8'), yamlKeyAdder.readMissingKeys(missingKeysFile));

    fs.writeFile(destFile, newYaml, () => { console.log(`Output written to ${destFile}`) });

  } catch (e) {
    console.log(e);
  }
}
