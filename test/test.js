/* global it, describe */

var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn
var assert = require('assert')
var tmp = require('tmp')

var bumplebee = path.resolve(__dirname, '../index.js')

// Load in the fixture files
var fixtures = {
  packageFile: {
    normal: require(path.resolve(__dirname, 'fixtures/package.json')),
    custom: require(path.resolve(__dirname, 'fixtures/package-custom.json'))
  },
  shrinkwrapFile: {
    normal: require(path.resolve(__dirname, 'fixtures/npm-shrinkwrap.json')),
    custom: require(path.resolve(__dirname, 'fixtures/npm-shrinkwrap-custom.json'))
  },
  sonarFile: {
    normal: fs.readFileSync(path.resolve(__dirname, 'fixtures/sonar-project.properties'), 'utf8'),
    custom: fs.readFileSync(path.resolve(__dirname, 'fixtures/sonar-project-custom.properties'), 'utf8')
  }
}

describe('Testing Major, Minor and Patch Bumps', function () {
  it('it should do a patch version bump by default', function (done) {
    var newVersion = '1.0.1'
    var testDir = tmp.dirSync({template: '/tmp/tmp-XXXXXX'}).name

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

  it('it should work with the x.y.z-BUILD-NUMBER syntax', function (done) {
    var newVersion = '1.0.1-BUILD-NUMBER'
    var testDir = tmp.dirSync({template: '/tmp/tmp-XXXXXX'}).name

    var {packageFile, shrinkwrapFile, sonarFile} = getFiles(testDir, 'custom')
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
})

function writeFiles (files) {
  files.forEach(function (file) {
    fs.writeFileSync(file.path, file.data, 'utf8')
  })
}

function getFiles (dir, type) {
  type = type || 'normal'
  return {
    packageFile: {
      data: JSON.stringify(fixtures.packageFile[type], null, 2),
      path: path.resolve(dir, 'package.json')
    },
    shrinkwrapFile: {
      data: JSON.stringify(fixtures.shrinkwrapFile[type], null, 2),
      path: path.resolve(dir, 'npm-shrinkwrap.json')
    },
    sonarFile: {
      data: fixtures.sonarFile[type],
      path: path.resolve(dir, 'sonar-project.properties')
    }
  }
}
