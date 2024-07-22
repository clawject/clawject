# @clawject/language-service

The Clawject Language Service provides code editors (VSCode, WebStorm, etc.) with a way to get errors
and navigation inside Beans, Contexts, etc.

[Clawject package](https://www.npmjs.com/package/@clawject/di) provide language service,
but it can't be used directly because TypeScript not allows using language services that are not package itself,
so `@clawject/language-service` package have `@clawject/di` as a dependency and re-exporting its language service.

You can read more about language service in the [documentation](https://clawject.com/docs/language-service)
