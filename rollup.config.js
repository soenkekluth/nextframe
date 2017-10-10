// import fs from 'fs';
import babel from 'rollup-plugin-babel';
// import buble from 'rollup-plugin-buble';
// import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
// import uglify from 'rollup-plugin-uglify';
// import memory from 'rollup-plugin-memory';
const env = process.env.NODE_ENV;
// const DEV = env === 'development';


const now = new Date();
const pkg = require('./package');

const external = Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {})).concat(['lodash/throttle']);


export default {
  input: './src/index.js',
  sourcemap: true,
  strict: false,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: false,
      preferBuiltins: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),

    babel({
      exclude: 'node_modules/**',
    }),
    // buble(),
    commonjs(),


  ],
  name: pkg.name,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
      external,
    },
    {
      file: pkg.browser,
      format: 'umd',
    },
  ],
  banner: `/*!
  * ${pkg.name} v${pkg.version}
  * ${pkg.homepage}
  *
  * Copyright (c) 2017-${now.getFullYear()} ${pkg.author}
  * Released under the ${pkg.license} license
  *
  * Date: ${now.toISOString()}
  */
 `,
};

// eslint({
//   include: [
//     'src/**',
//   ]
// }),
// format==='umd' && memory({
//   path: 'src/index.js',
//   contents: "export { default } from './device';"
// }),
// babel({
//   exclude: '**/node_modules/**'
// }),
