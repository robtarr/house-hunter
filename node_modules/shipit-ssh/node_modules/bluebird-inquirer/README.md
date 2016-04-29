# bluebird-inquirer

> A tiny [bluebird](https://www.npmjs.org/package/bluebird) wrapper for 
> [inquirer](https://www.npmjs.org/package/inquirer)

### Installation

```
npm install bluebird-inquirer
```

### Usage

```coffeescript
inquirer = require 'bluebird-inquirer'
inquirer
  .prompt questions
  .then (answers) ->
    console.log answers
```

See the [inquirer documentation](https://www.npmjs.org/package/inquirer#readme) 
for examples of how to use `inquirer.prompt`.