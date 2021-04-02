import { LaTeXTemplate } from "../template/LaTeXTemplate"
import { templateCommander } from "../cli_args/cli_latex_template"

const latex = new LaTeXTemplate(templateCommander.opts().fileName)

latex.setPackages(templateCommander.opts().packages)
latex.setTitleData(
  templateCommander.opts().author,
  templateCommander.opts().date,
  templateCommander.opts().title
)
latex.setBeginDocument()
latex.setSections(templateCommander.opts().sections)
latex.writeToFile()
latex.openCreatedDocument()
