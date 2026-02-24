# Checklist to bump the TS version

- Update `packages/core/contants.ts#TS_VERSION_RANGE` to the new version range
- Update `packages/core/package.json#peerDependencies.typescript` to the new version range
- Update versions matrix in `.github/workflows/build-and-test.yml`
- Update docs
