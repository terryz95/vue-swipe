const ghpages = require('gh-pages')
const colors = require('colors')
const version = require('../package.json').version

ghpages.publish('examples', {message: `[${version}] examples update - ${new Date().toLocaleString("en-US", {hour12: false})}`}, function(err) {
  if (err) {
    console.log(colors.bgRed(err.toString()))
  } else {
    console.log(colors.bgGreen('examples have been updated'))
  }
});