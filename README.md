# Add Missing Keys or Replace Existing Keys with null values

## Script setup

```
npm install
```

### Running the script

```
node index.js --source path/to/source/file --missingKeys path/to/missing_keys [--destination path/to/output/file]
```

`source` = The yaml file with missing keys or keys you want to null out

`destination` = The file where the output of the script should be saved (default: `output.yml`)

`missingKeys` = A text file with each key path on a new line. (default: `missing_keys.txt`)

Example `missing_keys` file:

```
en.path.to.key
en.path.to.another.key
```


