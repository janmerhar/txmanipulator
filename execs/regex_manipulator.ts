import { RegexManipulator } from "../manipulator/RegexManipulator"
import { regexManCommander } from "../cli_args/cli_regex_manipulator"

const rm = new RegexManipulator(
  regexManCommander.opts().input,
  regexManCommander.opts().fileName,
  regexManCommander.opts().ankiTag
)

rm.removeEndlines()
rm.removeTabs()
rm.removeSections()
rm.removeLaTeX()
rm.removeDoubleEmptyLines()

const typeOfFile = regexManCommander.opts().typeOfFile
if (typeOfFile == 1 || typeOfFile == 3) {
  rm.writeToFile()
}

if (typeOfFile == 2 || typeOfFile == 3) {
  rm.fillCsvData()
  rm.csvWriteToFile()
}
