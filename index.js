const fs = require('fs');
const yamlOperations = require('./YamlOperations');
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
  case "export":
    exportTsv();
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
  const errorsFile = "errors.json"
  if (!sourceFile) {
    console.log("Source file must be specified")
    return;
  }

  if (!root) {
    console.log("Root key must be specified")
    return;
  }

  const yaml = yamlOperations.tsvToYaml(yamlOperations.readFileLines(sourceFile), root);
  if(yaml.errors.length > 0) {
    fs.writeFileSync("errors.json", JSON.stringify(yaml.errors));
    console.log(`${yaml.errors.length} errors written to ${errorsFile}`)
  }
  else {
    console.log("SUCCESS");
  }

  fs.writeFileSync(destFile, yaml.yaml);
  console.log(`Output written to ${destFile}`)
}

function exportTsv() {
  const sourceFile = argv.s ?? argv.source;
  const destFile = argv.d ?? argv.destination ?? "translations.tsv";
  const foreignLanguage = argv.l ?? argv.foreignLanguage ?? "";
  const root = argv.r ?? argv.root ?? "en";

  if (!sourceFile) {
    console.log("Source file must be specified")
    return;
  }

  if (!fs.existsSync(sourceFile)) {
    console.log("Cannot find source file: " + sourceFile);
    return;
  }

  const tsv = yamlOperations.yamlToTsv(fs.readFileSync(sourceFile, 'utf8'), root, foreignLanguage);

  fs.writeFileSync(destFile, tsv);
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
    const newYaml = yamlOperations.addOrReplaceKeys(fs.readFileSync(sourceFile, 'utf8'), yamlOperations.readMissingKeys(missingKeysFile));

    fs.writeFile(destFile, newYaml, () => { console.log(`Output written to ${destFile}`) });

  } catch (e) {
    console.log(e);
  }
}
