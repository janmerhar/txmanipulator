const { Command } = require("commander")
const CommandFunctions = require("./cli_class")

const regexManCommander = new Command()

/*
 * REQUIRED OPTIONS
 */
regexManCommander
  .requiredOption("-i, --input <string>", "filename that will be imported")
  .requiredOption(
    "-tof, --type-of-file <number>",
    "1 => txt file, 2 => csv file, 3 => txt and csv file",
    3
  )

/*
 * OPTIONAL OPTIONS
 */
// I may implement optional output path
regexManCommander.option(
  "-at, --anki-tag <string>",
  "input tag field value for imported document: OMA-13"
)

// regexManCommander.parse()
// console.log(regexManCommander.opts())

module.exports = {
  regexManCommander,
}
