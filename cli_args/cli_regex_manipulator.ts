import { Command } from "commander"
import { CommandFunctions } from "./cli_class"

const regexManCommander = new Command()

/*
 * REQUIRED OPTIONS
 */
regexManCommander
  .requiredOption("-i, --input <string>", "Filename that will be imported")
  .requiredOption(
    "-tof, --type-of-file <number>",
    "1 => txt file, 2 => csv file, 3 => txt and csv file",
    "3"
  )

/*
 * OPTIONAL OPTIONS
 */
// I may implement optional output path
regexManCommander
  .option(
    "-at, --anki-tag <string>",
    "Input tag field value for imported document: eg. OMA-13"
  )
  .option(
    "-f, --file-name <string>",
    "Name of the output file",
    CommandFunctions.fileWithoutExtension
  )
  .option(
    "-r, --run <number>",
    "1 => runs manipulated data in program,  0 => doesn't run",
    "1"
  )

regexManCommander.parse()
// console.log(regexManCommander.opts())

export { regexManCommander }
