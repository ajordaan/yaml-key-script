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

    console.log(res);
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

    console.log(res);
    expect(res).toBe(output);


});

test('Add a new nested key to existing key', () => {
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

    console.log(res);
    expect(res).toBe(output);


});