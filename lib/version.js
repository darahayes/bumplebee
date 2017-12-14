var chalk = require('chalk')
var versionRegex = /^(\d+\.)?(\d+\.)?(\*|\d+)$/

module.exports = function getNewVersion (current, updateType) {
  // returns an array like [ '2.3.0', '2.', '3.', '0']
  var match = current.match(versionRegex)

  if (!match || match.length !== 4) {
    console.error(chalk.red('Version number', current, 'is not valid. It should be in the form x.y.z'))
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

  var newVersion = [versionHash.major, versionHash.minor, versionHash.patch].join('.')

  return {old: current, new: newVersion}
}
