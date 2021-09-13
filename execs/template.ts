import { LaTeXTemplate } from "../template/LaTeXTemplate"
import { templateCommander } from "../cli_args/cli_template"

const templateOpts = templateCommander.opts()
const latex = new LaTeXTemplate(templateOpts.fileName)

latex
  .setPackages(templateOpts.packages)
  .setTitleData(templateOpts.author, templateOpts.date, templateOpts.title)
  .setBeginDocument()
  .setSections(templateOpts.sections)
  .writeToFile()
  .openCreatedDocument()
