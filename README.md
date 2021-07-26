# About The project

This project aims to automate the process of creating Anki cards. To create cards, in batch, you can write a simple LaTeX document which is then transformed into markdown and csv file. The latter is used to be imported into Anki. The former is simplified LaTeX document for reading without compiler LaTeX document.

## File Merger

A simple program that searches for PDF files and merges them into a simgle large PDF document. It uses predefined folder structure to find documents.

## LaTeX Template

Easy to use command line interface for creating a template that is used to batch write Anki cards in LaTeX format. Although not necessary, yet very handy and time saving.

## Regex Manipulator

Command line interface that transforms LaTeX document into markdown and csv files. The goal of this program is making process of creating Anki cards easier and faster by writing Anki card in a simgle file which can be easily modified and searched for changes and automatically calling Anki for import. Windows users require for auto importing set Anki environmental variable.

## Built with

- Node.js
- TypeScript
- commander.js

# Getting started

To get started you need installed Node.js LTS 14.x or later alongsite other tools.

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
npm run compile
```

# Usage

Scripts are located in `execs` folder. You can run them with `node`. Note, you need to compile TypeScript into JavaScript before you can run them.

## File Merger CLI

```
Usage: file_merger [options]

Options:
  -i, --input-path <string>       Directory path that will be analyzed
  -ifr, --input-format <string>   Format of files we search for (default:
                                  "pdf")
  -ofr, --output-format <string>  Format of the merged file (default: "pdf")
  -h, --help                      display help for command
```

## LaTeX Template CLI

```
Usage: latex_template [options]

Options:
  -f, --file-name <strings...>  Name of the LaTeX output file
  -t, --title <string...>       Title given by the user
  -d, date <strings...>         Date given by the user (default: "2021-07-16")
  -a, --author <strings...>     Authors(s) (default: "")
  -p, --packages <strings...>   packages added to \usepackage
  -s, --sections <number>       Number of sections in the document
  -h, --help                    display help for command
```

## Regex Manipulator CLI

```
Usage: regex_manipulator [options]

Options:
  -i, --input <string>           Filename that will be imported
  -tof, --type-of-file <number>  1 => md file, 2 => csv file, 3 => md and csv
                                 file (default: "3")
  -at, --anki-tag <string>       Input tag field value for imported document:
                                 eg. OMA-13
  -f, --file-name <string>       Name of the output file
  -r, --run <number>             1 => runs manipulated data in program,  0 =>
                                 doesn't run (default: "1")
  -h, --help                     display help for command
```
