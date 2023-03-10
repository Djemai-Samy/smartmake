# smartmake

smartmake is a command line tool that helps you create and manage your projects. It has two main functionalities:

## smartmake create

`smartmake create` is a command line tool that helps to quickly create and set up new projects with a variety of different apps like express, react, nextjs.

There's a variety of options such as language, use of typescript or javascript, use of package manager, use of docker and so on, by answering multiple questions.

This makes it easy to start working on projects without the need to configure everything from scratch.

### Usage

```bash
  smartmake create <command> [options]
```

#### COMMANDS

- `help`: Print help info
- `express`: Create an ExpressJS project
- `react`: Create a ReactJS project

#### OPTIONS

- `-v, --version`: Print CLI version. Default: false
- `-l, --language`: Choose your language: [fr, en] -> en with --yes
- `-t, --useTypescript`: Use typescript -> default with --yes
- `-j, --useJavascript`: Use javascript
- `--useYarn`: Use Yarn -> default with --yes
- `--useNpm`: Use npm
- `-i, --install`: Install dependencies -> default with --yes
- `--noInstall`: Don't install dependencies
- `-d, --docker`: Use docker for the project -> default with --yes
- `--noDocker`: Don't use docker for the project
- `-y, --yes`: Apply -> --language en --useTypescript --useYarn --install --docker.

### Examples

```bash
  smartmake create
  smartmake create --useTypescript --docker
  smartmake create react --useYarn --install
  smartmake create react express --language fr --useTypescript --useYarn --install --docker
```

## smartmake start

`smartmake start` helps you start, build or deploy these apps.

### Usage

```bash
  smartmake start <command> [options]
```

#### COMMANDS

- `help`: Print help info. Default: false

#### OPTIONS

- `-l, --language`: Choose your language: [fr, en]
- `-y, --yes`: Apply default values.
- `-d, --docker`: Launch apps in docker -> default with --yes
- `--noDocker`: Don't launch apps in docker.
- `--all`: Launch all services.

### Examples

```bash
  smartmake start
  smartmake start --all
  smartmake start -d
```

### Prerequisites

- Node.js

### Thank you for using smartmake !
