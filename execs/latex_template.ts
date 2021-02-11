const { LaTeXTemplate } = require("../template/LaTeXTemplate")
const { templateCommander } = require("../cli_args/cli_latex_template")

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
latex.openCretedDocument()
