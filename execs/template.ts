import { LaTeXTemplate } from "../template/LaTeXTemplate"
import { templateCommander } from "../cli_args/cli_template"

const templateOpts = templateCommander.opts()
const latex = new LaTeXTemplate(templateOpts.fileName)

latex.setPackages(templateOpts.packages)
latex.setTitleData(templateOpts.author, templateOpts.date, templateOpts.title)
latex.setBeginDocument()
latex.setSections(templateOpts.sections)
latex.writeToFile()
latex.openCreatedDocument()
