import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    './src/index', 
    './src/access', 
    './src/mock', 
    './src/region', 
    './src/random'
  ],
  rollup: {
    //emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      target: 'ES6',
      minify: true
    }
  }
})