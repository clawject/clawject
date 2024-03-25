rm -rf dist &&

mkdir -p dist/dist/cjs &&
mkdir -p dist/dist/esm &&

node scripts/prepare_files &&

tsc --p tsconfig.cjs.json &&
tsc --p tsconfig.types.json &&
yarn run rollup -c --bundleConfigAsCjs &&

yarn run api-extractor run --local --verbose -c api-extractor/api-extractor.root.json &&
yarn run api-extractor run --local --verbose -c api-extractor/api-extractor.___internal___.json &&
yarn run api-extractor run --local --verbose -c api-extractor/api-extractor.webpack.json &&
yarn run api-extractor run --local --verbose -c api-extractor/api-extractor.transformer.json &&
yarn run api-extractor run --local --verbose -c api-extractor/api-extractor.transformer-metadata.json &&

rm dist/di.d.ts &&
rm -rf dist/raw-types &&

yarn run copyfiles -u 1 src/**/*.csv dist/dist/cjs &&

cp ../../LICENSE dist/LICENSE &&
cp ../../README.md dist/README.md
