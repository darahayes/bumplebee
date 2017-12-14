#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var argv = require('minimist')(process.argv.slice(2))

var options = ['minor', 'major', 'patch']

if (argv.h || argv.help || (argv._[0] && !options.includes(argv._[0]))) {
  help()
  process.exit(1)
}

var getNewVersion = require('./lib/version')
var writer = require('./lib/writer')

var packagePath = path.resolve(process.cwd(), 'package.json')
var sonarPath = path.resolve(process.cwd(), 'sonar-project.properties')
var shrinkwrapPath = path.resolve(process.cwd(), 'npm-shrinkwrap.json')

var packageJson

if (!fs.existsSync(packagePath)) {
  console.error(chalk.red(`No package.json file found in' ${process.cwd()} is this a JavaScript repo?`))
  process.exit(1)
}

packageJson = require(packagePath)

if (!packageJson.version) {
  console.error(chalk.red('package.json has no version field'))
}

var versionInfo = getNewVersion(packageJson.version, argv._[0])

console.log(`Bumping from version ${versionInfo.old} to version ${versionInfo.new}`)

writer.writePackage(packagePath, versionInfo)
writer.writeSonar(sonarPath, versionInfo)
writer.writeShrinkwrap(shrinkwrapPath, versionInfo)

function help () {
  console.log('usage:\n  - bump <major|minor|patch>\n  - bump (defaults to patch)')
}
