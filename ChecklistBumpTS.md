# Checklist to bump the TS version

- Update `packages/core/contants.ts#TS_VERSION_RANGE` to the new version range
- Update `packages/core/package.json#peerDependencies.typescript` to the new version range
- Add a supported version of `@ts-morph/bootstrap` in `packages/core/package.json`
- Update `packages/di/src/unplugin/core/createTSMorphProject.ts` to import createProject from the new version of `@ts-morph/bootstrap`
- Update versions matrix in `.github/workflows/build-and-test.yml`
- Update docs
