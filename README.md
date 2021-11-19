# Add Missing Keys or Replace Existing Keys with null values or import file

## Script setup

```
npm install
```

### Running the script

```
node index.js --action [import, add] --source path/to/source/file --missingKeys path/to/missing_keys [--destination path/to/output/file]
```

`source` = The yaml file with missing keys or keys you want to null out OR The tsv file you want to import

`destination` = The file where the output of the script should be saved (default: `output.yml`)

`missingKeys` = A text file with each key path on a new line OR a JSON file with an array of keypath strings (default: `missing_keys.txt`)

`action` = The action you want to perform. Either import a `tsv` file or add keys to a yaml file

Example `missing_keys.txt` file:

```
en.path.to.key
en.path.to.another.key
```
Example `missing_keys.json` file:

```
[
    "en.path.to.key"
    "en.path.to.another.key"
]
```

