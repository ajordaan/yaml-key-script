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
  case "null":
    getKeysWithNullValue();
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

  if (!fs.existsSync(sourceFile)) {
    console.log("Cannot find source file: " + sourceFile);
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

function getKeysWithNullValue() {
  try {
    const sourceFile = argv.s ?? argv.source;
    const referenceFile = argv.ref ?? argv.reference;
    const destFile = argv.d ?? argv.destination ?? "null_keys.tsv";
    const sourceRoot = argv.sr ?? argv.sourceRoot;
    const referenceRoot = argv.rr ?? argv.referenceRoot;

    if (!sourceFile) {
      console.log("Source file must be specified")
      return;
    }
    if (!fs.existsSync(sourceFile)) {
      console.log("Cannot find source file: " + sourceFile);
      return;
    }
    if (!referenceFile) {
      console.log("Reference File must be specified")
      return;
    }
    if (!fs.existsSync(referenceFile)) {
      console.log("Cannot find Reference File: " + sourceFile);
      return;
    }
    if (!sourceRoot) {
      console.log("Source Root key must be specified")
      return;
    }
    if (!referenceRoot) {
      console.log("Reference Root key must be specified")
      return;
    }

    const nullKeys = yamlOperations.getKeysWithNullValue(fs.readFileSync(sourceFile), sourceRoot);
    const output = yamlOperations.nullKeysToTsv(nullKeys,fs.readFileSync(referenceFile), referenceRoot)
    fs.writeFileSync(destFile, output);

  } catch (error) {
    console.log(error)
  }
}