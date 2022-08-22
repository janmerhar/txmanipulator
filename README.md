# About The project

This project aims to automate the process of creating Anki cards. To create cards, in batch, you can write a simple LaTeX document which is then transformed into markdown and csv file. The latter is used to be imported into Anki. The former is simplified LaTeX document for reading without compiler LaTeX document.

Command line interface that transforms LaTeX document into markdown and csv files or simply markdown to csv. The goal of this program is making process of creating Anki cards easier and faster by writing Anki card in a single file which can be easily modified and searched for changes and automatically calling Anki for import. Windows users require for auto importing set Anki environmental variable.

## Built with

- Node.js
- TypeScript
- commander.js

# Getting started

To get started you need installed Node.js LTS 14.x or later alongside other tools.

## Prerequisites

- Node.js LTS 14.x or later
- TypeScript

## Installation

1. Install Node.js
2. Clone the repo

```bash
git clone https://github.com/janmerhar/LaTeX_manipulator
```

3. Install NPM packages

```bash
npm install
```

4. Install TypeScript

```bash
npm install typescript -g
```

5. Run TypeScript compiler

```bash
npm run build
```

# Usage

Script is located in `bin` folder. You can run it with `node`. Note, you need to compile TypeScript into JavaScript before you can run them.

## Manipulator CLI

```
Usage: manipulator [options]

Options:
  -i, --input <string>           Name of file that will be imported
  -tof, --type-of-file <number>  1 => MD file, 2 => CSV file, 3 => MD and CSV
                                 file (default: "3")
  -at, --anki-tag <string>       Input tag field value for imported document:
                                 eg. OMA-13
  -f, --file-name <string>       Name of the output file
  -r, --run <number>             1 => runs manipulated data in program,  0 =>
                                 doesn't run anything (default: "1")
  -h, --help                     display help for command
```
