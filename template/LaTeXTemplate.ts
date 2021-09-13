import * as child_process from "child_process"
import * as fs from "fs"
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
  setPackages(packages: string[] = []): LaTeXTemplate {
    this.fileText +=
      "\\usepackage{amsfonts, amsmath, amssymb}\n\\usepackage{xparse}\n"
    packages = packages.map((aPackage: string) => {
      return `\\usepackage{${aPackage}}\n`
    })
    this.fileText += packages.join("") + `\n`

    return this
  }

  setTitleData(author: string, date: string, title: string): LaTeXTemplate {
    this.fileText += `\\author{ ${author} }\n`
    this.fileText += `\\date{ ${date} }\n`
    this.fileText += `\\title{ ${title} }\n`

    return this
  }

  setBeginDocument(): LaTeXTemplate {
    this.fileText += `\n\\begin{document}\n`
    this.fileText += `\\maketitle\n`

    return this
  }

  setSections(number: number = 30): LaTeXTemplate {
    this.fileText += `    \\section*{  }\n\n`.repeat(number)

    return this
  }

  setEndDocument(): LaTeXTemplate {
    this.fileText += `\\end{document}`

    return this
  }

  writeToFile(writePath: string = this.fileName): LaTeXTemplate {
    this.setEndDocument()

    fs.writeFileSync(writePath + "." + "tex", this.fileText)

    return this
  }
  // dokončaj, da se bo odprla mapa, kjer bo shranjen LaTeX dokument
  // zaenkrat deluje samo odpiranje v urejevalniku
  // in še to samo kreirani dokument, želim pa ciljno mapo, da bom lažje začel urejati dokumente
  openCreatedDocument(program = "code"): LaTeXTemplate {
    child_process.exec(
      `${program} ${path.dirname(path.join(process.cwd(), this.fileName))}`,
      (err: any) => {
        if (err) console.log("Failed opening document!")
        child_process.exec(
          `${program} ${path.join(
            path.dirname(path.join(process.cwd(), this.fileName)),
            this.fileName + "." + "tex"
          )}`,
          (err: any) => {
            if (err) console.log("Failed opening document!")
          }
        )
      }
    )
    return this
  }
}

export { LaTeXTemplate }
