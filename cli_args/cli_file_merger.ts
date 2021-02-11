const { Command } = require("commander")
const { CommandFunctions } = require("./cli_class")

const fileMergerCommander = new Command()

/*
 * REQUIRED OPTIONS
 */

// i may add support for other types than PDF
fileMergerCommander
  .requiredOption(
    "-ip, --input-path <string>",
    "directory path that will be analyzed"
  )
  .requiredOption(
    "-ifr, --input-format <string>",
    "format of files we search for",
    CommandFunctions.lowerCase,
    "pdf"
  )
  .requiredOption(
    "-ofr, --output-format <string>",
    "format of the merged file",
    CommandFunctions.lowerCase,
    "pdf"
  )

fileMergerCommander.parse(process.argv)
// console.log("Options: \n", fileMergerCommander.opts())

export { fileMergerCommander }
