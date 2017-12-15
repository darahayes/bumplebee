var chalk = require('chalk')
var versionRegex = /^(\d+\.)(\d+\.)(\*|\d+)(-BUILD-NUMBER)?$/

module.exports = function getNewVersion (current, updateType) {
  // returns an array like [ '2.3.0', '2.', '3.', '0']
  var match = current.match(versionRegex)

  if (!match) {
    console.error(chalk.red('Version number', current, 'is not valid. It should be in the form x.y.z or x.y.z-BUILD-NUMBER'))
    process.exit(1)
  }

  var versionHash = {
    major: match[1].charAt(0),
    minor: match[2].charAt(0),
    patch: match[3]
  }

  if (!versionHash[updateType]) {
    updateType = 'patch'
  }

  versionHash[updateType] = Number(versionHash[updateType]) + 1

  var newVersion = `${versionHash.major}.${versionHash.minor}.${versionHash.patch}${match[4] ? match[4] : ''}`

  return {old: current, new: newVersion}
}
