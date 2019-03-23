import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import { terser } from "rollup-plugin-terser";

const env = process.env.NODE_ENV;
let commonPlugins = [
  resolve({
    module: true,
    main: true
  }),
  commonjs(),
  json(),
  typescript()
];

if (env && env.trim() === 'production') {
  commonPlugins.push(terser());
}

var config = [
  {
    input: './src/index.ts',
    output: {
      format: 'umd',
      name: 'shai',
      file: 'lib/shai.js'
    },
    plugins: commonPlugins
  },
  {
    input: './src/maker/index.ts',
    output: {
      format: 'umd',
      name: 'Maker',
      file: 'lib/maker.js'
    },
    plugins: commonPlugins
  },
  {
    input: './src/validator/index.ts',
    output: {
      format: 'umd',
      name: 'Validator',
      file: 'lib/validator.js'
    },
    plugins: commonPlugins
  }
];

export default config;
