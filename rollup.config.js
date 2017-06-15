import fs from 'fs';

import babel from 'rollup-plugin-babel';
// import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
// import memory from 'rollup-plugin-memory';

const DEV = process.env.NODE_ENV === 'development';

let format = process.env.FORMAT || 'cjs';
let pkg = JSON.parse(fs.readFileSync('./package.json'));
let external = format === 'iife' ? [] : Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}));
let dest = pkg.main;

switch (format) {
  case 'es':
    dest = pkg.module;
    break;

  case 'iife':
    dest = pkg.browser;
    break;

  case 'cjs':
    dest = pkg.main;
    break;

  default:
    break;
}

export default {
  entry: 'src/nextframe.js',
  sourceMap: true,
  dest,
  format,
  external,
  moduleName: pkg.amdName,
  useStrict: false,
  exports: format === 'es' ? null : 'named',
  plugins: [
    // format==='umd' && memory({
    //   path: 'src/device.js',
    //   contents: "export { default } from './device';"
    // }),

    resolve({
      jsnext: false, // Default: false
      main: true, // Default: true
      browser: false, // Default: false
      preferBuiltins: false,
      // browser: true
      // skip: format === 'iife' ? null : external
    }),

    babel({
      exclude: 'node_modules/**',
    }),
    // eslint({
    //   include: [
    //     'src/**',
    //   ]
    // }),
    commonjs({
      include: ['node_modules/**', 'src/**/*.js']
    }),

    // replace({
    //   exclude: 'node_modules/**',
    //   ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    // }),
    ((format === 'iife' && !DEV) && uglify()),
  ].filter(Boolean)
};
