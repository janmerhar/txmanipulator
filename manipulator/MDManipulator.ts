import * as fs from "fs"
import * as child_process from "child_process"
import csvStringify from "csv-stringify"
import * as path from "path"
import { exit } from "process"

class MDManipulator {
  filePath: any
  fileText: any
  fileName: string
  csvData: any
  tag: any
  runPrograms: number

  constructor(
    filePath: string,
    fileName: string,
    tag: any,
    runPrograms: number = 0,
    fileText: string = ""
  ) {
    this.csvData = []
    this.runPrograms = runPrograms
    // when input text is from LaTeXManipulator class
    if (fileText != "") {
      this.filePath = filePath
      this.fileName = fileName
      this.tag = tag
      this.runPrograms = runPrograms
      this.fileText = fileText
    }
    // when there is no input String for fileText
    else {
      this.filePath = filePath
      this.fileText = fs.readFileSync(filePath, "utf-8")
      this.fileName =
        fileName || path.basename(filePath).replace(path.extname(filePath), "")

      const fileNameSplitted = this.fileName.split("_")
      this.tag =
        tag && tag.length > 0
          ? tag
          : fileNameSplitted.length == 3
          ? `${fileNameSplitted[1]}-${fileNameSplitted[0]}`
          : ""
    }
  }

  replaceMathExpression(isVaried: boolean = true) {
    if (isVaried) {
      // option for inline and multiline math => not obsidian friendly
      this.fileText = this.fileText
        .split(/\\\(\s*/)
        .join("$")
        .split(/\s*\\\)/)
        .join("$")
      this.fileText = this.fileText
        .split(/\\\[\s*/)
        .join("$$")
        .split(/\s*\\\]/)
        .join("$$")
    } else {
      // option for multiline only => obsidian friendly
      this.fileText = this.fileText
        .split(/\\\(\s*/)
        .join("$$")
        .split(/\s*\\\)/)
        .join("$$")
      this.fileText = this.fileText
        .split(/\\\[\s*/)
        .join("$$")
        .split(/\s*\\\]/)
        .join("$$")
    }
  }

  clozeDetection(text: string, counter: number) {
    let clozedText = text.replace(/\{\{(.)*\}\}/g, (a, b) => {
      a = a.replace(/[\{\}]/g, "")
      const output = `{{c${counter}::${a}}}`
      counter += 1
      return output
    })
    return clozedText
  }

  /* 
    IMPROVED VERSION OF fillCsvData
  */
  fillCsvData2() {
    // splitting document into lines
    const lines = this.fileText.split(/\r*\n/g)
    // creating an array of indexes
    const questions = [
      lines[0],
      ...lines.filter((value: string, index: number) => {
        let niz = String(lines[index + 1])
        if (niz.match(/----+/)) {
          return index
        }
      }),
    ]
    // console.log(questions)
    // loopping through every question

    // searching for indexes of questions
    let iQuestions: any[] = []
    questions.forEach((question, index) => {
      iQuestions.push(lines.indexOf(question))
    })
    // console.log(iQuestions.length)
    /*
      GAINING ANSWERS TO ADD TO QUESTION
    */
    iQuestions.forEach((question, index) => {
      // reading current question
      let questionText = questions[question]

      let iStart = iQuestions[index] + 1 + 1
      let iEnd = iQuestions[index + 1] || lines.length
      let questionAnswers = [
        String(lines[question]),
        lines.slice(iStart, iEnd).join("\n").trim(),
        this.tag,
      ]
      // console.log(questionAnswers)
      this.csvData.push(questionAnswers)
    })
  }

  csvWriteToFile(writePath = this.fileName, writeExtension = "csv") {
    csvStringify(
      this.randomizeArray(this.csvData),
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
          if (this.runPrograms == 1) {
            child_process.exec(`anki &`, (err: any) => {})
            child_process.exec(`anki ${writePath + "." + writeExtension}`)
          }
        }
      }
    )
  }
  randomizeArray(inputArray: [any]) {
    let array = [...inputArray]
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }
}

export { MDManipulator }
