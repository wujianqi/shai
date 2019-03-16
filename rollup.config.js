import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import minify from 'rollup-plugin-minify-es';

const env = process.env.NODE_ENV;
const override = {
  tsconfigOverride: {
    compilerOptions: {
      declaration: false            
    }
  }
};

var config = [
  {
    input: './src/index.ts',
    output: {
      format: 'umd',
      name: 'shai',
      file: 'shai.js'
    },
    plugins: [
      json(),
      typescript({
        useTsconfigDeclarationDir: true
      })
    ]
  },
  {
    input: './src/maker/index.ts',
    output: {
      format: 'umd',
      name: 'Maker',
      file: 'maker.js'
    },
    plugins: [
      json(),
      typescript(override)
    ]
  },
  {
    input: './src/validator/index.ts',
    output: {
      format: 'umd',
      name: 'Validator',
      file: 'validator.js'
    },
    plugins: [
      json(),
      typescript(override)
    ]
  }
];

if (env && env.trim() === 'production') {
  config.forEach( item => {
    item.plugins.push(
      minify()
    )
  })  
}

export default config;
