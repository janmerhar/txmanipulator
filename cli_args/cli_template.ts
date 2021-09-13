import { Command } from "commander"
import { CommandFunctions } from "./CommandFunctions"
import dateFormat from "dateformat"

// commander za create_latex_template.js
const templateCommander = new Command()

CommandFunctions.filenameOffDirStructure()
// required options
templateCommander.requiredOption(
  "-t, --title <string...>",
  "Title given by the user",
  CommandFunctions.joinThings
)

// optional options
// add --anki-tag -atag for custom tags that are not derived from \title
templateCommander
  .option(
    "-f, --file-name <string...>",
    "Name of the LaTeX output file",
    CommandFunctions.filenameOffDirStructure()
  )
  .option(
    "-d, date <strings...>",
    "Date given by the user",
    CommandFunctions.joinThings,
    dateFormat(new Date(), "yyyy-mm-dd")
  )
  .option(
    "-a, --author <strings...>",
    "Author(s)",
    CommandFunctions.joinThings,
    ""
  )
  .option("-p, --packages <strings...>", "packages added to \\usepackage")
  .option(
    "-s, --sections <number>",
    "Number of sections in the document",
    CommandFunctions.myParseInt
  )

templateCommander.parse(process.argv)
// console.log("Options: \n", templateCommander.opts())

export { templateCommander }
