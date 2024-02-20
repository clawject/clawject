# @clawject/language-service

The Clawject Language Service provides code editors (VSCode, WebStorm, etc.) with a way to get errors
and navigation inside Beans, Contexts, etc.

[Clawject package](https://www.npmjs.com/package/clawject) provide language service,
but it can't be used directly because TypeScript not allows using language services that are not package itself,
so `@clawject/language-service` package have `clawject` as a peer-dependency and re-exporting its language service,
so you shouldn't worry about versions compatibility, `@clawject/language-service` will always have single version.

## Installation

Not that if you're using VSCode - you can install [Clawject VSCode Extension](https://todo.com) instead of this package.

After installation of [clawject](https://www.npmjs.com/package/clawject) you should install this package:

```shell
yarn add -D @clawject/language-service
#or
npm install @clawject/language-service --save-dev
```

Then adding this plugin to your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "plugins": [
      { "name": "@clawject/language-service" }
    ]
  }
}
```

After that - you should restart your IDE (VSCode, WebStorm, etc.),
and you will see errors, warnings, suggestions and hints from clawject.
