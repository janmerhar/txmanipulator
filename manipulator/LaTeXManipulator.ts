import * as fs from "fs"
import * as child_process from "child_process"
import * as path from "path"

class LaTeXManipulator {
  filePath: any
  fileText: any
  fileName: string
  csvData: any
  tag: any
  runPrograms: number
  fileTitle: string

  constructor(
    filePath: string,
    fileName: string,
    tag: any,
    runPrograms: number = 0
  ) {
    this.filePath = filePath
    this.fileText = fs.readFileSync(filePath, "utf-8")
    this.fileName =
      fileName || path.basename(filePath).replace(path.extname(filePath), "")
    this.csvData = []

    const fileNameSplitted = this.fileName.split("_")
    this.tag =
      tag || fileNameSplitted.length == 3
        ? `${fileNameSplitted[1]}-${fileNameSplitted[0]}`
        : ""
    this.fileTitle = this.fileText
      .match(/\\title\{(.)*\}/gi)[0]
      .replace("\\title{", "")
      .replace("}", "")
      .trim()
    this.runPrograms = runPrograms
  }
  getFileText() {
    return this.fileText
  }
  getFilePath() {
    return this.filePath
  }

  prepareTex() {
    this.fileText = this.fileText.split(/\n{3,}/g).join("\n\n")
    this.fileText = this.fileText.split(/(\r\n){3,}/g).join("\r\n\r\n")
  }

  prepareTag(fileName: string) {
    let words = fileName.split(" ")
    const num = words[words.length - 1]
    words.length -= 1
    words = words.map((word) => word.charAt(0))

    const nameOfSubject = words.join("").toUpperCase()
    return `${nameOfSubject}-${num}`
  }

  // RegEx ukazi
  removeEndlines() {
    // cleaning reamaining endlines
    this.fileText = this.fileText.split(/\s*\\\\\s*\r\n/g).join("\r\n")
    this.fileText = this.fileText.split(/\s*\\\\\s*\n/g).join("\n")
  }

  removeSections() {
    // cleaning extra \n before \section tag
    // this.fileText = this.fileText.split(/\n{3,}\\section/).join(/\n\n\\section/)
    this.fileText = this.fileText.replace(
      /\r*\n+\\section\*\{(.*)\}/g,
      function (a: string, b: string) {
        // checking if the \section*{} is empty
        if (b.match(/\w+/) == null) return ""
        return `\n\n\n${b.trim()}\n--------------------------------`
      }
    )
  }

  removeDoubleEmptyLines() {
    this.fileText = this.fileText.split(/\n{5,}/g).join("")
    this.fileText = this.fileText.split(/(\r\n){5,}/g).join("")
    // odstranim na začetku dokumenta
    this.fileText = this.fileText.replace(/\n+/, "")
  }

  removeTabs() {
    this.fileText = this.fileText.split(/[ ]{4}/g).join("")
  }

  removeLaTeX() {
    // odstranim \documentclass
    this.fileText = this.fileText.split(/\\documentclass\{.*\}/).join("")
    // odstranim title, author, date
    this.fileText = this.fileText
      .split(/\\title\{.*\}/)
      .join("")
      .split(/\\author\{.*\}/)
      .join("")
      .split(/\\date\{.*\}/)
      .join("")
    // odstranim \maketitle
    this.fileText = this.fileText.split(/\\maketitle/).join("")
    // odstranim \begin in \end tage
    this.fileText = this.fileText
      .split(/\\begin\{document\}/)
      .join("")
      .split(/\\end\{document\}/)
      .join("")
    this.fileText = this.fileText.replace("\n", "")
    // odstranim \userpackage
    this.fileText = this.fileText.split(/\\usepackage\{.*\}(\n)*/).join("")
  }

  writeToFile(writePath = this.fileName, writeExtension = "md") {
    fs.writeFileSync(writePath + "." + writeExtension, this.fileText)

    // odprem datoteko s notepad++ ali notepad ali
    if (this.runPrograms == 1) {
      child_process.exec(
        `start notepad++ ${writePath}.${writeExtension} &`,
        (err: any) => {
          if (!err) return
          child_process.exec(
            `start notepad ${writePath}.${writeExtension} &`,
            (err: any) => {
              if (!err) return
              child_process.exec(
                `start kate ${writePath}.${writeExtension} &`,
                (err: any) => {
                  if (!err) return
                  child_process.exec(
                    `start gedit ${writePath}.${writeExtension} &`,
                    (error: any) => {
                      console.log(error)
                    }
                  )
                }
              )
            }
          )
        }
      )
    }
  }
}

export { LaTeXManipulator }
