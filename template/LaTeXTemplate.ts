import * as child_process from "child_process"
import * as fs from "fs"
import * as path from "path"

class LaTeXTemplate {
  fileName: string
  fileText: string

  constructor(fileName: string) {
    this.fileName = fileName[0]
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

    // NOTE: Returning this for chaining
    return this
  }

  setTitleData(author: string, date: string, title: string): LaTeXTemplate {
    this.fileText += `\\author{ ${author} }\n`
    this.fileText += `\\date{ ${date} }\n`
    this.fileText += `\\title{ ${title} }\n`

    // NOTE: Returning this for chaining
    return this
  }

  setBeginDocument(): LaTeXTemplate {
    this.fileText += `\n\\begin{document}\n`
    this.fileText += `\\maketitle\n`

    // NOTE: Returning this for chaining
    return this
  }

  setSections(number: number = 30): LaTeXTemplate {
    this.fileText += `    \\section*{  }\n\n`.repeat(number)

    // NOTE: Returning this for chaining
    return this
  }

  setEndDocument(): LaTeXTemplate {
    this.fileText += `\\end{document}`

    // NOTE: Returning this for chaining
    return this
  }

  writeToFile(): LaTeXTemplate {
    this.setEndDocument()
    const outputFileName =
      path.extname(this.fileName).length === 0
        ? this.fileName + ".tex"
        : this.fileName
    const outputFile = path.join(process.cwd(), outputFileName)
    const outputDir = process.cwd()

    fs.writeFileSync(outputFileName, this.fileText)

    // NOTE: Returning this for chaining
    return this
  }

  openCreatedDocument(program = "code"): LaTeXTemplate {
    const outputFileName =
      path.extname(this.fileName).length === 0
        ? this.fileName + ".tex"
        : this.fileName
    const outputFile = path.join(process.cwd(), outputFileName)
    const outputDir = process.cwd()

    child_process.exec(`${program} ${outputDir} &`, (err: any) => {
      if (err) console.log("Failed opening document!")

      child_process.exec(`${program} ${outputFile}`, (err: any) => {
        if (err) console.log("Failed opening document!")
      })
    })
    // NOTE: Returning this for chaining
    return this
  }
}

export { LaTeXTemplate }
