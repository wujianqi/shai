import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

const env = process.env.NODE_ENV;
let commonPlugins = [
  resolve(),
  commonjs(),
  typescript()
];

if (env && env.trim() === 'production') {
  commonPlugins.push(terser());
}

var config = [
  {
    input: './src/shai.ts',
    output: [{
      format: 'es',
      name: 'Shai',
      file: 'es/shai.js'
    },{
      format: 'umd',
      name: 'Shai',
      file: 'lib/shai.js'
    }],
    plugins: commonPlugins
  },{
    input: './src/mock.ts',
    output: [{
      format: 'es',
      name: 'mock',
      file: 'es/mock.js'
    },{
      format: 'umd',
      name: 'mock',
      file: 'lib/mock.js'
    }],
    plugins: commonPlugins
  },{
    input: './src/region.ts',
    output: [{
      format: 'es',
      name: 'Region',
      file: 'es/region.js'
    },{
      format: 'umd',
      name: 'Region',
      file: 'lib/region.js'
    }],
    plugins: commonPlugins
  }
];

export default config;
