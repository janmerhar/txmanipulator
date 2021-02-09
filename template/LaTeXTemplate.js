const child_process = require("child_process")
const fs = require("fs")
const { templateCommander } = require("../cli_args/cli_latex_template")

class LaTeXTemplate {
  constructor(fileName) {
    this.fileName = fileName
    this.fileText = "\\documentclass{article}\n"
  }

  // adding elements to latex document
  // packages array of package names
  setPackages(packages = []) {
    this.fileText += "\\usepackage{amsfonts}\n"
    packages = packages
      .map((aPackage) => {
        return `\\usepackage{${aPackage}}\n`
      })
      .join("")
    this.fileText += packages + `\n`
  }

  setTitleData(author, date, title) {
    this.fileText += `\\author{ ${author} }\n`
    this.fileText += `\\date{ ${date} }\n`
    this.fileText += `\\title{ ${title} }\n`
  }

  setBeginDocument() {
    this.fileText += `\n\\begin{document}\n`
    this.fileText += `\\maketitle\n`
  }

  setSections(number = 20) {
    this.fileText += `    \\section*{  }\n\n`.repeat(number)
  }

  setEndDocument() {
    this.fileText += `\\end{document}`
  }

  writeToFile(writePath = this.fileName) {
    latex.setEndDocument()

    fs.writeFileSync(writePath + "." + "tex", this.fileText)
  }
  // dokončaj, da se bo odprla mapa, kjer bo shranjen LaTeX dokument
  // zaenkrat deluje samo odpiranje v urejevalniku
  // in še to samo kreirani dokument, želim pa ciljno mapo, da bom lažje začel urejati dokumente
  openCretedDocument(program = "code") {
    child_process.exec(`${program} ${this.fileName}.tex`, (err) => {
      if (err) console.log("Failed opening document!")
    })
  }
}

let latex = new LaTeXTemplate(templateCommander.fileName)
// ugotovi, kaj se zgodi ko so undefined
latex.setPackages(templateCommander.packages)
latex.setTitleData(
  templateCommander.author,
  templateCommander.date,
  templateCommander.title
)
latex.setBeginDocument()
latex.setSections(templateCommander.sections)
latex.writeToFile()
latex.openCretedDocument()
