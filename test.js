const yamlOperations = require("./YamlOperations");

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
const tsv = ["path.to.key\tenglish value\tforeign value"];

const res = yamlOperations.tsvToYaml(tsv,"root");

const yaml = `root:
  path:
    to:
      key: "foreign value"
`;

expect(res).toBe(yaml);
});

test('Import simple object from tsv', () => {
  const tsv = ["path.to.key[0]\tenglish value\tforeign value 1", "path.to.key[1]\tenglish value\tforeign value 2", "path.to.key[2]\tenglish value\tforeign value 3"];
  
  const res = yamlOperations.tsvToYaml(tsv,"root");
  
  const yaml = `root:
    path:
      to:
        key:
          - foreign value 1
          - foreign value 2
          - foreign value 3
  `;
  
  expect(res).toBe(yaml);
  });