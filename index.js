const fs = require('fs');
const yamlKeyAdder = require('./YamlKeyAdder');
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
  const newYaml = yamlKeyAdder.addOrReplaceKeys(fs.readFileSync(sourceFile, 'utf8'), yamlKeyAdder.readMissingKeys(missingKeysFile));

  fs.writeFile(destFile, newYaml, () => { console.log(`Output written to ${destFile}`) });

} catch (e) {
  console.log(e);
}

