const ghpages = require('gh-pages')
const version = require('../package.json').version

ghpages.publish('examples', {message: `[${version}] examples update`}, function(err) {
  if (err) {
    console.log(colors.bgRed(err.toString()))
  } else {
    console.log(colors.bgGreen('examples have been updated'))
  }
});