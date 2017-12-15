var fs = require('fs')
var chalk = require('chalk')
var sonarVersionRegex = /sonar\.projectVersion=(.+)/

exports.writePackage = function (packagePath, versionInfo) {
  var packageJson = require(packagePath)
  packageJson.version = versionInfo.new
  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8')
  console.log(chalk.green('done: package.json'))
}

exports.writeSonar = function (sonarPath, versionInfo) {
  if (!fs.existsSync(sonarPath)) {
    console.log(chalk.yellow('skipped: sonar-project.properties'))
    return
  }
  var sonarFile = fs.readFileSync(sonarPath, 'utf8')

  var match = sonarFile.match(sonarVersionRegex)

  if (!match) {
    console.error(chalk.red('sonar-project.properties file doesn\'t have a version number. Fix this and run again.'))
    process.exit(1)
  }

  var oldSonarVersionString = match[0]
  var newSonarVersionString = `sonar.projectVersion=${versionInfo.new}`
  fs.writeFileSync(sonarPath, sonarFile.replace(oldSonarVersionString, newSonarVersionString), 'utf8')
  console.log(chalk.green('done: sonar-project.properties'))
}

exports.writeShrinkwrap = function (shrinkwrapPath, versionInfo) {
  if (!fs.existsSync(shrinkwrapPath)) {
    console.log(chalk.yellow('skipped: npm-shrinkwrap.json'))
    return
  }
  var shrinkwrap = require(shrinkwrapPath)
  shrinkwrap.version = versionInfo.new
  fs.writeFileSync(shrinkwrapPath, JSON.stringify(shrinkwrap, null, 2) + '\n', 'utf8')
  console.log(chalk.green('done: npm-shrinkwrap.json'))
}
