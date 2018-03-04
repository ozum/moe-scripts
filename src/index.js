#!/usr/bin/env node
let shouldThrow
try {
  shouldThrow =
    require(`${process.cwd()}/package.json`).name === 'moe-scripts' &&
    Number(process.version.slice(1).split('.')[0]) < 8
} catch (error) {
  // ignore
}

if (shouldThrow) {
  throw new Error(
    'You must use Node version 8 or greater to run the scripts within moe-scripts ' +
      'because we dogfood the untranspiled version of the scripts.',
  )
}

require('./run-script')

// TODO: Remove dist from .gitattributes, del src/jsdoc2md/ts-copy.json npm install symbolic linkleri almıyor mu?