import { Command } from "commander"
import { CommandFunctions } from "./cli_class"

const fileMergerCommander = new Command()

/*
 * REQUIRED OPTIONS
 */

// i may add support for other types than PDF
fileMergerCommander
  .requiredOption(
    "-i, --input-path <string>",
    "Directory path that will be analyzed"
  )
  .requiredOption(
    "-ifr, --input-format <string>",
    "Format of files we search for",
    CommandFunctions.lowerCase,
    "pdf"
  )
  .requiredOption(
    "-ofr, --output-format <string>",
    "Format of the merged file",
    CommandFunctions.lowerCase,
    "pdf"
  )

fileMergerCommander.parse(process.argv)
// console.log("Options: \n", fileMergerCommander.opts())

export { fileMergerCommander }
