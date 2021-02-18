import * as fs from "fs"
import * as child_process from "child_process"
import csvStringify from "csv-stringify"
import * as path from "path"
/*
  dodaj še polje za tag v array za csv
  dodaj še zaznavo imena za tage: spremeni tudi CLI vnose
 */

class RegexManipulator {
  filePath: any
  fileText: any
  fileName: string
  csvData: any
  tag: any

  constructor(filePath: string, fileName: string, tag: any) {
    this.filePath = filePath
    this.fileText = fs.readFileSync(filePath, "utf-8")
    this.fileName =
      fileName || path.basename(filePath).replace(path.extname(filePath), "")
    this.csvData = []
    // extracting tag from \title field if tag variable is not pased as an argument
    this.tag =
      tag ||
      this.fileText
        .match(/\\title\{(.)*\}/gi)[0]
        .replace("\\title{", "")
        .replace("}", "")
        .trim()
        .match(/(\w)+\w+/gi)
        .map((val: any) => {
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
    // ko je še kakšen whitespace preostal
    this.fileText = this.fileText.split(/\s*\\\\\s*\r\n/g).join("\r\n")
    this.fileText = this.fileText.split(/\s*\\\\\s*\n/g).join("\n")
  }

  removeSections() {
    this.fileText = this.fileText.replace(
      /\\section\*\{(.*)\}/g,
      function (a: string, b: string) {
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
      .split(/\\begin\{document\}/)
      .join("")
      .split(/\\end\{document\}/)
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
      (err: any) => {
        if (!err) return
        child_process.exec(
          `start notepad ${writePath}.${writeExtension}`,
          (err: any) => {
            if (!err) return
            child_process.exec(
              `start kate ${writePath}.${writeExtension}`,
              (err: any) => {
                if (!err) return
                child_process.exec(
                  `start gedit ${writePath}.${writeExtension}`,
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

  /*
   * Del namenjen za
   * CSV kalkulacije
   */
  fillCsvData() {
    // splitting document into lines
    const lines = this.fileText.split(/\r*\n/g)
    // creating an array of indexes
    const questions = lines.filter((value: string, index: number) => {
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
      (err: any, csvToWrite: any) => {
        if (err) {
          throw err
        } else {
          fs.writeFileSync(writePath + "." + writeExtension, csvToWrite)
          // opening Anki desktop application with a prompt for inporting current CSV file
          // Anki should be running before we can pass CLI parameter for import
          child_process.exec(`anki`, (err: any) => {})
          child_process.exec(`anki ${writePath + "." + writeExtension}`)
        }
      }
    )
  }
}

// const regex = new RegexManipulator(cliArgs[0], undefined, undefined)
// regex.removeEndlines()
// regex.removeTabs()
// regex.removeSections()
// regex.removeLaTeX()
// regex.removeDoubleEmptyLines()
// regex.writeToFile()

// regex.fillCsvData()
// regex.csvWriteToFile()
export { RegexManipulator }
