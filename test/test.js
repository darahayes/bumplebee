/* global it, describe */

var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn
var assert = require('assert')
var tmp = require('tmp')

var bumplebee = path.resolve(__dirname, '../index.js')

// Load in the fixture files
var packageFile = require(path.resolve(__dirname, 'fixtures/package.json'))
var shrinkwrapFile = require(path.resolve(__dirname, 'fixtures/npm-shrinkwrap.json'))
var sonarFile = fs.readFileSync(path.resolve(__dirname, 'fixtures/sonar-project.properties'), 'utf8')

describe('Testing Major, Minor and Patch Bumps', function () {
  it('it should do a patch version bump by default', function (done) {
    var newVersion = '1.0.1'
    var testDir = tmp.dirSync({template: '/tmp/tmp-XXXXXX'}).name

    console.log(testDir)

    var {packageFile, shrinkwrapFile, sonarFile} = getFiles(testDir)
    writeFiles([packageFile, shrinkwrapFile, sonarFile])

    var child = spawn('node', [bumplebee], {cwd: testDir})
    child.on('close', function (code) {
      assert.equal(code, 0)
      assert.equal(require(packageFile.path).version, newVersion)
      assert.equal(require(shrinkwrapFile.path).version, newVersion)
      assert.ok(fs.readFileSync(sonarFile.path, 'utf8').includes(`sonar.projectVersion=${newVersion}`))
      done()
    })
  })

  it('it should do patch version bump', function (done) {
    var newVersion = '1.0.1'
    var testDir = tmp.dirSync({template: '/tmp/tmp-XXXXXX'}).name

    var {packageFile, shrinkwrapFile, sonarFile} = getFiles(testDir)
    writeFiles([packageFile, shrinkwrapFile, sonarFile])

    var child = spawn('node', [bumplebee, 'patch'], {cwd: testDir})
    child.on('close', function (code) {
      assert.equal(code, 0)
      assert.equal(require(packageFile.path).version, newVersion)
      assert.equal(require(shrinkwrapFile.path).version, newVersion)
      assert.ok(fs.readFileSync(sonarFile.path, 'utf8').includes(`sonar.projectVersion=${newVersion}`))
      done()
    })
  })

  it('it should do major version bump', function (done) {
    var newVersion = '2.0.0'
    var testDir = tmp.dirSync({template: '/tmp/tmp-XXXXXX'}).name

    var {packageFile, shrinkwrapFile, sonarFile} = getFiles(testDir)
    writeFiles([packageFile, shrinkwrapFile, sonarFile])

    var child = spawn('node', [bumplebee, 'major'], {cwd: testDir})
    child.on('close', function (code) {
      assert.equal(code, 0)
      assert.equal(require(packageFile.path).version, newVersion)
      assert.equal(require(shrinkwrapFile.path).version, newVersion)
      assert.ok(fs.readFileSync(sonarFile.path, 'utf8').includes(`sonar.projectVersion=${newVersion}`))
      done()
    })
  })

  it('it should do minor version bump', function (done) {
    var newVersion = '1.1.0'
    var testDir = tmp.dirSync({template: '/tmp/tmp-XXXXXX'}).name

    var {packageFile, shrinkwrapFile, sonarFile} = getFiles(testDir)
    writeFiles([packageFile, shrinkwrapFile, sonarFile])

    var child = spawn('node', [bumplebee, 'minor'], {cwd: testDir})
    child.on('close', function (code) {
      assert.equal(code, 0)
      assert.equal(require(packageFile.path).version, newVersion)
      assert.equal(require(shrinkwrapFile.path).version, newVersion)
      assert.ok(fs.readFileSync(sonarFile.path, 'utf8').includes(`sonar.projectVersion=${newVersion}`))
      done()
    })
  })

  it('it should work even without a sonar-project.properties file', function (done) {
    var newVersion = '1.0.1'
    var testDir = tmp.dirSync({template: '/tmp/tmp-XXXXXX'}).name

    var {packageFile, shrinkwrapFile} = getFiles(testDir)
    writeFiles([packageFile, shrinkwrapFile])

    var child = spawn('node', [bumplebee], {cwd: testDir})
    child.on('close', function (code) {
      assert.equal(code, 0)
      assert.equal(require(packageFile.path).version, newVersion)
      assert.equal(require(shrinkwrapFile.path).version, newVersion)
      done()
    })
  })

  it('it should work even without a npm-shrinkwrap.json file', function (done) {
    var newVersion = '1.0.1'
    var testDir = tmp.dirSync({template: '/tmp/tmp-XXXXXX'}).name

    var {packageFile, sonarFile} = getFiles(testDir)
    writeFiles([packageFile, sonarFile])

    var child = spawn('node', [bumplebee], {cwd: testDir})
    child.on('close', function (code) {
      assert.equal(code, 0)
      assert.equal(require(packageFile.path).version, newVersion)
      assert.ok(fs.readFileSync(sonarFile.path, 'utf8').includes(`sonar.projectVersion=${newVersion}`))
      done()
    })
  })

  it('it should work even with only a package.json file', function (done) {
    var newVersion = '1.0.1'
    var testDir = tmp.dirSync({template: '/tmp/tmp-XXXXXX'}).name

    var {packageFile} = getFiles(testDir)
    writeFiles([packageFile])

    var child = spawn('node', [bumplebee], {cwd: testDir})
    child.on('close', function (code) {
      assert.equal(code, 0)
      assert.equal(require(packageFile.path).version, newVersion)
      done()
    })
  })
})

function writeFiles (files) {
  files.forEach(function (file) {
    fs.writeFileSync(file.path, file.data, 'utf8')
  })
}

function getFiles (dir) {
  return {
    packageFile: {
      data: JSON.stringify(packageFile, null, 2),
      path: path.resolve(dir, 'package.json')
    },
    shrinkwrapFile: {
      data: JSON.stringify(shrinkwrapFile, null, 2),
      path: path.resolve(dir, 'npm-shrinkwrap.json')
    },
    sonarFile: {
      data: sonarFile,
      path: path.resolve(dir, 'sonar-project.properties')
    }
  }
}
