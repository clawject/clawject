# clawject-language-service-plugin

This is a typescript language service plugin that improves
the development experience for projects
that are using [clawject](https://www.npmjs.com/package/clawject) showing errors,
warnings, suggestions and hints right in your editor (VSCode, WebStorm, etc.)

## Installation
First of all - you should have installed [clawject](https://www.npmjs.com/package/clawject),
a version of clawject doesn't matter because this package is just re-export **language service plugin** from clawject,
it's needed because language service plugins can't be used with **nested paths**.

After installation of [clawject](https://www.npmjs.com/package/clawject) you should install this package:

```shell
yarn add -D clawject-language-service-plugin
#or
npm install clawject-language-service-plugin --save-dev
```

Then adding this plugin to your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "plugins": [
      { "name": "clawject-language-service-plugin" }
    ]
  }
}
```

After that - you should restart your IDE (VSCode, WebStorm, etc.),
and you will see errors, warnings, suggestions and hints from clawject.
