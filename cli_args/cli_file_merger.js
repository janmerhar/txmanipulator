const { Command } = require("commander")
const CommandFunctions = require("./cli_class")

const fileMergerCommander = new Command()

/*
 * REQUIRED OPTIONS
 */

// i may add support for other types than PDF
fileMergerCommander
  .requiredOption(
    "-i, --input <string>",
    "directory path that will be analyzed"
  )
  .requiredOption(
    "-fr, --format <string>",
    "format of files we search for",
    "pdf",
    CommandFunctions.lowerCase
  )

module.exports = {
  fileMergerCommander,
}
