const fs = require("fs")
const child_process = require("child_process")
const csvStringify = require("csv-stringify")
const { resourceUsage } = require("process")
const cliArgs = process.argv.slice(2)

/*
  dodaj še polje za tag v array za csv
  dodaj še zaznavo imena za tage: spremeni tudi CLI vnose
 */

class Regex_manipulator {
  constructor(filePath, fileName) {
    this.filePath = filePath
    this.fileText = fs.readFileSync(filePath, "utf-8")
    this.fileName = fileName || filePath.match(/(.+?)(\.[^.]*$|$)/)[1]
    this.csvData = []
    this.tag = this.fileText
      .match(/\\title\{(.)*\}/gi)[0]
      .replace("\\title{", "")
      .replace("}", "")
      .trim()
      .match(/(\w)+\w+/gi)
      .map((val) => {
        if (!isNaN(val)) {
          return `-${val}`
        } else {
          return val.charAt(0).toUpperCase()
        }
      })
      .join("")
  }
  getFileText() {
    return this.fileText
  }
  getFilePath() {
    return this.filePath
  }

  // RegEx ukazi
  removeEndlines() {
    // ko se zaključi vrstica takoj po znaku \\
    this.fileText = this.fileText.split(/\\\\\r\n/g).join("\r\n")
    this.fileText = this.fileText.split(/\\\\\n/g).join("\n")
    // ko je še kakšen whitespace preostal
    this.fileText = this.fileText.split(/\s*\\\\\s*\r\n/g).join("\r\n")
    this.fileText = this.fileText.split(/\s*\\\\\s*\n/g).join("\n")
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
    this.fileText = this.fileText.split(/\n{5,}/g).join("")
    this.fileText = this.fileText.split(/(\r\n){5,}/g).join("")
    // odstranim na začetku dokumenta
    this.fileText = this.fileText.replace(/\n+/, "")
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
    child_process.exec(
      `start notepad++ ${writePath}.${writeExtension}`,
      (err) => {
        if (!err) return
        child_process.exec(
          `start notepad ${writePath}.${writeExtension}`,
          (err) => {
            if (!err) return
            child_process.exec(
              `start kate ${writePath}.${writeExtension}`,
              (err) => {
                if (!err) return
                child_process.exec(
                  `start gedit ${writePath}.${writeExtension}`,
                  (error) => {
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

  /*
   * Del namenjen za
   * CSV kalkulacije
   */
  fillCsvData() {
    // splitting document into lines
    const lines = this.fileText.split(/\r*\n/g)
    // creating an array of indexes
    const questions = lines.filter((value, index) => {
      let niz = String(lines[index + 1])
      if (niz.match(/----+/)) {
        return index
      }
    })

    // loopping through every question
    for (let i = 0; i < questions.length; i++) {
      let iQuestion = lines.indexOf(questions[i])
      let iNextQuestion =
        i + 1 < questions.length
          ? lines.indexOf(questions[i + 1])
          : lines.length - 1

      let questionAnswers = [String(lines[iQuestion]), "", this.tag]
      for (
        let j = iQuestion + 1 + 1;
        j < iNextQuestion && String(lines[j]).length != 0;
        j++
      ) {
        questionAnswers[1] += String(lines[j])
          .trim()
          .concat(
            j + 1 < iNextQuestion && String(lines[j + 1]).length != 0
              ? "\n"
              : ""
          )
      }
      this.csvData.push(questionAnswers)
    }
  }
  csvWriteToFile(writePath = this.fileName, writeExtension = "csv") {
    csvStringify(
      this.csvData,
      {
        header: false,
        delimiter: ";",
      },
      (err, csvToWrite) => {
        if (err) {
          throw err
        } else {
          fs.writeFileSync(writePath + "." + writeExtension, csvToWrite)
        }
      }
    )
  }
}

const regex = new Regex_manipulator(cliArgs[0])
regex.removeEndlines()
regex.removeTabs()
regex.removeSections()
regex.removeLaTeX()
regex.removeDoubleEmptyLines()

// regex.writeToFile()
// mogoče odprem anki, ko zgeneriram dokument ???
regex.fillCsvData()
regex.csvWriteToFile()
console.log(regex.tag)
