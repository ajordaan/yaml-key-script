const yamlKeyAdder = require("./YamlKeyAdder");

test('Add a new key to root', () => {
  const yaml = `root:
    key1: null`;

  const missingKeys = ['root.key2']
  const output = `root:
  key1: null
  key2: null
`;

  const res = yamlKeyAdder.addOrReplaceKeys(yaml, missingKeys);
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

  const res = yamlKeyAdder.addOrReplaceKeys(yaml, missingKeys);
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

  const res = yamlKeyAdder.addOrReplaceKeys(yaml, missingKeys);
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

  const res = yamlKeyAdder.addOrReplaceKeys(yaml, missingKeys);
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

  const res = yamlKeyAdder.addOrReplaceKeys(yaml, missingKeys);
  expect(res).toBe(output);
});