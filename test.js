const yamlOperations = require("./YamlOperations");
const fs = require('fs');
test('Add a new key to root', () => {
  const yaml = `root:
    key1: null`;

  const missingKeys = ['root.key2']
  const output = `root:
  key1: null
  key2: null
`;

  const res = yamlOperations.addOrReplaceKeys(yaml, missingKeys);
  expect(res).toBe(output);
});

test('Add a new nested key to root', () => {
  const yaml = `root:
        key1: null`;

  const missingKeys = ['root.grandparent.parent.child1', 'root.grandparent.parent.child2']
  const output = `root:
  key1: null
  grandparent:
    parent:
      child1: null
      child2: null
`;

  const res = yamlOperations.addOrReplaceKeys(yaml, missingKeys);
  expect(res).toBe(output);
});

test('Add a new nested key to existing parent', () => {
  const yaml = `root:
        key1:
          key2:
            existing_child: null`;

  const missingKeys = ['root.key1.key2.parent.child1', 'root.key1.key2.parent.child2']
  const output = `root:
  key1:
    key2:
      existing_child: null
      parent:
        child1: null
        child2: null
`;

  const res = yamlOperations.addOrReplaceKeys(yaml, missingKeys);
  expect(res).toBe(output);
});

test('Null out existing key', () => {
  const yaml = `root:
      key1:
        key2:
          existing_child: "I have a value"
`;

  const missingKeys = ['root.key1.key2.existing_child']
  const output = `root:
  key1:
    key2:
      existing_child: null
`;

  const res = yamlOperations.addOrReplaceKeys(yaml, missingKeys);
  expect(res).toBe(output);
});

test('Null out existing parent', () => {
  const yaml = `root:
      key1:
        key2:
          existing_child: "I have a value"
`;

  const missingKeys = ['root.key1']
  const output = `root:
  key1: null
`;

  const res = yamlOperations.addOrReplaceKeys(yaml, missingKeys);
  expect(res).toBe(output);
});

test('Import simple object from tsv', () => {
  const tsv = ["headers", "path.to.key\tenglish value\tforeign value"];

  const res = yamlOperations.tsvToYaml(tsv, "root");

  const yaml = `root:
  path:
    to:
      key: "foreign value"
`;

  expect(res.yaml).toBe(yaml);
});

test('Import arrays and objects from tsv', () => {
  const res = yamlOperations.tsvToYaml(yamlOperations.readFileLines("test/import/arraysAndObjects.tsv"), "root");
  const expected = fs.readFileSync("test/import/arraysAndObjects.yml").toString();

  expect(res.yaml).toBe(expected);
});

test('Export arrays and objects to tsv', () => {
  const res = yamlOperations.yamlToTsv(fs.readFileSync("test/export/arraysAndObjects.yml"), "root", "Foreign Language");
  const expected = fs.readFileSync("test/export/arraysAndObjects.tsv").toString();

  expect(res).toBe(expected);
});

test('Import broken variables from tsv', () => {
  const res = yamlOperations.tsvToYaml(yamlOperations.readFileLines("test/import/variables.tsv"), "root");
  const expected = fs.readFileSync("test/import/variables.yml").toString();

  expect(res.yaml).toBe(expected);

  const errors = [
    {
        "key": "date.formats.days.other",
        "lineNumber": 7
    },
    {
        "key": "ticket_purchase.transfer_fee",
        "lineNumber": 9
    },
    {
        "key": "ticket_purchase.display_entries_errors",
        "lineNumber": 11
    },
    {
        "key": "ticket_purchase.missing_variable",
        "lineNumber": 12
    }
];

  expect(res.errors).toStrictEqual(errors);
});