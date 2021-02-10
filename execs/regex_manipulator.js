const RegexManipulator = require("../manipulator/RegexManipulator")
const regexManCommander = require("../cli_args/cli_regex_manipulator")

console.log(regexManCommander.opts())

const regex = new RegexManipulator(
  regexManCommander.opts().input,
  undefined,
  regexManCommander.opts().ankiTag
)

regex.removeEndlines()
regex.removeTabs()
regex.removeSections()
regex.removeLaTeX()
regex.removeDoubleEmptyLines()

const typeOfFile = regexManCommander.opts().typeOfFile
if (typeOfFile == 1 || typeOfFile == 3) {
  regex.writeToFile()
}

if (typeOfFile == 2 || typeOfFile == 3) {
  regex.fillCsvData()
  regex.csvWriteToFile()
}
