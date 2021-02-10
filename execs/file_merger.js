const FileMerger = require("../directorizer/FileMerger")
const fileMergerCommander = require("../cli_args/cli_file_merger")

fileMergerCommander.parse(process.argv)
// console.log("Options: \n", fileMergerCommander.opts())

const fm = new FileMerger(fileMergerCommander.opts().inputPath)
fm.setSubdirectories()
fm.searchForFiles(fileMergerCommander.opts().inputFormat)
fm.mergeAndWrite(fileMergerCommander.opts().outputFormat)
