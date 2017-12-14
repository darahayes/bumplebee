# Bumplebee

This is a small CLI designed to make it easy to bump versions in `package.json`, `npm-shrinkwrap.json` and `sonar-project.properties`.

## Install

```
npm i -g bumplebee
```

## Usage

```bash
bump <major|minor|patch>
bump # defaults to patch
```

From within your repo simply run the `bump` command.

```
$ bump major
Bumping from version 1.0.5 to version 2.0.5
done: package.json
done: sonar-project.properties
done: npm-shrinkwrap.json
```

```
$ bump minor
Bumping from version 2.0.5 to version 2.1.5
done: package.json
done: sonar-project.properties
done: npm-shrinkwrap.json
```

```
$ bump patch
Bumping from version 2.1.5 to version 2.1.6
done: package.json
done: sonar-project.properties
done: npm-shrinkwrap.json
```

`bump` defaults to `minor` if no argument is passed:

```
$ bump
Bumping from version 2.1.5 to version 2.1.6
done: package.json
done: sonar-project.properties
done: npm-shrinkwrap.json
```

`bump` still works if `npm-shrinkwrap.json` or `sonar-project.properties` are not present

```
$ bump
Bumping from version 2.1.6 to version 2.1.7
done: package.json
skipped: sonar-project.properties
skipped: npm-shrinkwrap.json
```
