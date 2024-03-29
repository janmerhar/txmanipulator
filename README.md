# About The project

This project aims to automate the process of creating Anki cards. To create cards, in batch, you can write a simple LaTeX or Markdown document which is then transformed into markdown and csv file. The latter is used to be imported into Anki. The former is simplified LaTeX document for reading without compiled LaTeX document. You can easily create a LaTeX document using [txtemplate](https://github.com/janmerhar/txtemplate).

Command line interface transforms LaTeX document into markdown and csv files or simply markdown to csv. The goal of this program is making process of creating Anki cards easier and faster by writing Anki card in a single file which can be easily modified and searched for changes and automatically calling Anki for import. Windows users need to set Anki environmental variable for auto importing.

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
git clone https://github.com/janmerhar/txmanipulator
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

Script is located in `bin` folder. You can run it with `ts-node`. Note, if you want to run JavaScript script, you fill find compiled executable in `dist/bin` folder.

## Manipulator CLI

To use CLI you need to install package from NPM using `npm install txmanipulator -g`. Afterwards you can run the CLI using `manipulator` command.

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

## Usage example

![Usage example](documentation/txmanipulator_cli_example.gif?raw=true "Usage example")

## MDManipulator example

```typescript
import { MDManipulator } from "txmanipulator"

const md = new MDManipulator(
  "name_of_input_file.md",
  "name_of_output_file.csv",
  "name_of_anki_tag",
  "run_option: int"
)

md
  // Detecting and encapsulating images in <img> tags
  .imageDetection()
  // Detecting blocks of code and translating them into HTML
  .codeDetection()
  // Creating basic data for writing to csv file
  .fillCsvData2()
  // Customization for specific type of anki cards' titles
  .CSVstyleAllTitles()
  // Cosmetic improvement for every title of anki cards
  .titleAnswerReplaceSpecial()
  // Translating \n line breaks to HTML tag <br>
  .CSVLineBreaksToHTML()

// Finally writing computed anki cards to .csv file
md.csvWriteToFile()
```

## LaTeXManipulator example

```typescript
import { LaTeXManipulator } from "txmanipulator"

const tex = new LaTeXManipulator(
  "name_of_input_file.md",
  "name_of_output_file.csv",
  "name_of_anki_tag",
  "run_option: int"
)

tex
  // Remove \n end lines
  .removeEndlines()
  // Remove \t tabs
  .removeTabs()
  // Remove \section LaTeX tags
  .removeSections()
  // Remove remaining LaTeX tags
  .removeLaTeX()
  // Remove double \n\n end lines
  .removeDoubleEmptyLines()
  // Remove LaTeX commented lines that start with %
  .removeLaTeXComments()

// Finally writing computed Markdown file to .md file
tex.writeToFile()
```

## Contributing

To contribute to this project follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add some changes'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a pull request
