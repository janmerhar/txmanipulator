import { Command } from "commander"
import { CommandFunctions } from "./cli_class"

const manipulatorManCommander = new Command()

/*
 * REQUIRED OPTIONS
 */
manipulatorManCommander
  .requiredOption("-i, --input <string>", "Name of file that will be imported")
  .requiredOption(
    "-tof, --type-of-file <number>",
    "1 => MD file, 2 => CSV file, 3 => MD and CSV file",
    "3"
  )

/*
 * OPTIONAL OPTIONS
 */
// I may implement optional output path
manipulatorManCommander
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
    "1 => runs manipulated data in program,  0 => doesn't run anything",
    "1"
  )

manipulatorManCommander.parse()

export { manipulatorManCommander }
