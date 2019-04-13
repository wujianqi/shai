const fs = require('fs-extra');

fs.copy('lib/maker/index.d.ts', 'lib/maker.esm.d.ts', err => {
    if (err) return console.error(err)
  
    console.log('maker.esm.d.ts, success!')
})

fs.copy('lib/validator/index.d.ts', 'lib/validator.esm.d.ts', err => {
    if (err) return console.error(err)
  
    console.log('validator.esm.d.ts, success!')
})