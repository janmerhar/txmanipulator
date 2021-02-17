import * as child_process from "child_process"
import * as fs from "fs"
import { templateCommander } from "../cli_args/cli_latex_template"
import * as path from "path"

class LaTeXTemplate {
  fileName: string
  fileText: string

  constructor(fileName: string) {
    this.fileName = fileName
    this.fileText = "\\documentclass{article}\n"
  }

  // adding elements to latex document
  // packages array of package names
  setPackages(packages: Array<string> = []) {
    this.fileText += "\\usepackage{amsfonts}\n\\usepackage{amsmath, xparse}\n"
    packages = packages.map((aPackage: string) => {
      return `\\usepackage{${aPackage}}\n`
    })
    this.fileText += packages.join("") + `\n`
  }

  setTitleData(author: string, date: string, title: string) {
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
    this.setEndDocument()

    fs.writeFileSync(writePath + "." + "tex", this.fileText)
  }
  // dokončaj, da se bo odprla mapa, kjer bo shranjen LaTeX dokument
  // zaenkrat deluje samo odpiranje v urejevalniku
  // in še to samo kreirani dokument, želim pa ciljno mapo, da bom lažje začel urejati dokumente
  openCretedDocument(program = "code") {
    child_process.exec(
      `${program} ${path.dirname(path.join(process.cwd(), this.fileName))}`,
      (err: any) => {
        if (err) console.log("Failed opening document!")
      }
    )
  }
}

// const latex = new LaTeXTemplate(templateCommander.opts().fileName)

// latex.setPackages(templateCommander.opts().packages)
// latex.setTitleData(
//   templateCommander.opts().author,
//   templateCommander.opts().date,
//   templateCommander.opts().title
// )
// latex.setBeginDocument()
// latex.setSections(templateCommander.opts().sections)
// latex.writeToFile()
// latex.openCretedDocument()

export { LaTeXTemplate }
