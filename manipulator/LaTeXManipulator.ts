import * as fs from "fs"
import * as child_process from "child_process"
import * as path from "path"

class LaTeXManipulator {
  filePath: any
  fileText: any
  fileName: string
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
      fileName ?? path.basename(filePath).replace(path.extname(filePath), "")

    this.tag = this.generateTag(tag)

    this.fileTitle = this.fileText
      .match(/\\title\{(.)*\}/gi)[0]
      .replace("\\title{", "")
      .replace("}", "")
      .trim()

    this.runPrograms = runPrograms
  }

  generateTag(tag: string): string {
    const fileNameSplitted = this.fileName.split("_")
    const newTag =
      tag && tag.length > 0
        ? tag
        : fileNameSplitted.length == 3
        ? `${fileNameSplitted[1]}-${fileNameSplitted[0]}`
        : ""

    return newTag
  }

  prepareTex(): LaTeXManipulator {
    this.fileText = this.fileText.split(/\n{3,}/).join("\n\n")
    this.fileText = this.fileText.split(/(\r\n){3,}/).join("\r\n\r\n")

    // NOTE: Returning this for chaining
    return this
  }

  prepareTag(fileName: string): string {
    let words = fileName.split(" ")
    const num = words[words.length - 1]

    words.length -= 1
    words = words.map((word) => word.charAt(0))

    const nameOfSubject = words.join("").toUpperCase()
    return `${nameOfSubject}-${num}`
  }

  // RegEx ukazi
  removeEndlines(): LaTeXManipulator {
    // cleaning reamaining endlines
    this.fileText = this.fileText.split(/\s*\\\\\s*\r\n/).join("\n")
    this.fileText = this.fileText.split(/\s*\\\\\s*\n/).join("\n")

    // NOTE: Returning this for chaining
    return this
  }

  removeSections(): LaTeXManipulator {
    // cleaning extra \n before \section tag
    this.fileText = this.fileText.replace(
      /\r*\n+\\section\*\{(.*)\}/g,
      function (a: string, b: string) {
        // checking if the \section*{} is empty
        if (b.match(/\w+/) == null) return ""
        return `\n\n\n${b.trim()}\n--------------------------------`
      }
    )

    // NOTE: Returning this for chaining
    return this
  }

  removeDoubleEmptyLines(): LaTeXManipulator {
    this.fileText = this.fileText.split(/\n{5,}/).join("")
    this.fileText = this.fileText.split(/(\r\n){5,}/).join("")
    // odstranim na začetku dokumenta
    this.fileText = this.fileText.trim()

    // NOTE: Returning this for chaining
    return this
  }

  removeTabs(): LaTeXManipulator {
    this.fileText = this.fileText.split(/[ ]{4}/).join("")

    // NOTE: Returning this for chaining
    return this
  }

  removeLaTeX(): LaTeXManipulator {
    // odstranim \documentclass
    this.fileText = this.fileText.split(/\\documentclass\{.*\}/).join("")

    // odstranim title, author, date
    this.fileText = this.fileText.split(/\\title\{.*\}/).join("")
    this.fileText = this.fileText.split(/\\author\{.*\}/).join("")
    this.fileText = this.fileText.split(/\\date\{.*\}/).join("")

    // odstranim \maketitle
    this.fileText = this.fileText.split(/\\maketitle/).join("")

    // odstranim \begin in \end tage
    this.fileText = this.fileText
      .split(/\\begin\{document\}/)
      .join("")
      .split(/\\end\{document\}/)
      .join("")
    this.fileText = this.fileText.trim()

    // odstranim \userpackage
    this.fileText = this.fileText.split(/\\usepackage\{.*\}(\n)*/).join("")

    // NOTE: Returning this for chaining
    return this
  }

  prepareMd(): LaTeXManipulator {
    // adding master # for title that is extracted from -t flag
    this.fileText = `# ${this.fileTitle}\n\n${this.fileText}`

    // fixing math expressions
    // not needed for now
    // fileText = this.replaceMathExpression(fileText, true)

    // NOTE: Returning this for chaining
    return this
  }

  removeLaTeXComments(): LaTeXManipulator {
    this.fileText = this.fileText
      .split(/(\r*\n)*\s*%.*\r*\n/)
      .join(" ")
      .trim()

    // NOTE: Returning this for chaining
    return this
  }

  writeToFile(
    writePath: string = this.fileName,
    writeExtension: string = "md"
  ): LaTeXManipulator {
    let writtenFile = "LOG_" + writePath + "." + writeExtension
    fs.writeFileSync(writtenFile, this.fileText)

    // odprem datoteko s notepad++ ali notepad ali
    if (this.runPrograms == 1) {
      child_process.exec(`start notepad++ ${writtenFile} &`, (err: any) => {
        if (!err) return
        child_process.exec(`start notepad ${writtenFile} &`, (err: any) => {
          if (!err) return
          child_process.exec(`start kate ${writtenFile} &`, (err: any) => {
            if (!err) return
            child_process.exec(`start gedit ${writtenFile} &`, (error: any) => {
              console.log(error)
            })
          })
        })
      })
    }
    // NOTE: Returning this for chaining
    return this
  }
}

export { LaTeXManipulator }
