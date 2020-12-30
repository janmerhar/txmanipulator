const fs = require("fs")
const child_process = require("child_process")
const cliArgs = process.argv.slice(2)

class Regex_manipulator {
  constructor(filePath, fileName) {
    this.filePath = filePath
    this.fileText = fs.readFileSync(filePath, "utf-8")
    this.fileName = fileName || filePath.match(/(.+?)(\.[^.]*$|$)/)[1]
  }
  getFileText() {
    return this.fileText
  }
  getFilePath() {
    return this.filePath
  }

  // RegEx ukazi
  removeEndlines() {
    this.fileText = this.fileText.split(/\\\\\r\n/g).join("\r\n")
    this.fileText = this.fileText.split(/\\\\\n/g).join("\n")
  }

  removeSections() {
    this.fileText = this.fileText.replace(
      /\\section\*\{(.*)\}/g,
      function (a, b) {
        return `\n\n${b.trim()}\n--------------------------------`
      }
    )
  }

  removeDoubleEmptyLines() {
    this.fileText = this.fileText.split(/\n{4,}/g).join("")
    this.fileText = this.fileText.split(/(\r\n){4,}/g).join("")
    // odstranim na začetku dokumenta
    this.fileText = this.fileText.replace("\n\n\n", "")
  }

  removeTabs() {
    this.fileText = this.fileText.split(/[ ]{4,}/g).join("")
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
      .split(/\\begin\{.*\}/)
      .join("")
      .split(/\\end\{.*\}/)
      .join("")
    this.fileText = this.fileText.replace("\n", "")
    // odstranim \userpackage
    this.fileText = this.fileText.split(/\\usepackage\{.*\}(\n)*/).join("")
  }

  writeToFile(writePath = this.fileName, writeExtension = "txt") {
    fs.writeFileSync(writePath + "." + writeExtension, this.fileText)
    console.log("Written to: " + writePath + "." + writeExtension)

    // odprem datoteko s notepad++ ali notepad ali
    child_process.exec(`notepad++ ${writePath}.${writeExtension}`, (err) => {
      if (!err) return
      child_process.exec(`notepad ${writePath}.${writeExtension}`, (err) => {
        if (!err) return
        child_process.exec(`kate ${writePath}.${writeExtension}`, (err) => {
          if (!err) return
          child_process.exec(
            `gedit ${writePath}.${writeExtension}`,
            (error) => {
              console.log(error)
            }
          )
        })
      })
    })
  }
}

const regex = new Regex_manipulator(cliArgs[0])
regex.removeEndlines()
regex.removeTabs()
regex.removeSections()
regex.removeLaTeX()
regex.removeDoubleEmptyLines()

regex.writeToFile()
// mogoče odprem anki, ko zgeneriram dokument ???
