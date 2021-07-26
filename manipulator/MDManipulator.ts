import * as fs from "fs"
import * as child_process from "child_process"
import csvStringify from "csv-stringify"
import * as path from "path"

class MDManipulator {
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

  replaceMathExpression(text: string, isVaried: boolean) {
    let fileText = (" " + text).slice(1)
    if (isVaried) {
      // option for inline and multiline math => not obsidian friendly
      fileText = fileText
        .split(/\\\(\s*/)
        .join("$ ")
        .split(/\s*\\\)/)
        .join(" $")
      fileText = fileText
        .split(/\\\[\s*/)
        .join("$$ ")
        .split(/\s*\\\]/)
        .join(" $$")
    } else {
      // option for multiline only => obsidian friendly
      fileText = fileText
        .split(/\\\(\s*/)
        .join("$$ ")
        .split(/\s*\\\)/)
        .join(" $$")
      fileText = fileText
        .split(/\\\[\s*/)
        .join("$$ ")
        .split(/\s*\\\]/)
        .join(" $$")
    }

    return fileText
  }

  // funkcija, v katero bom zaenkrat zakakiral vse dodane funkcionalnosti
  // dokler ne bom naredil drugega ločenega razreda za md datoteke
  prepareMd(text: string) {
    // adding master # for title that is extracted from -t flag
    let fileText = `# ${this.fileTitle}\n${text}`

    // fixing math expressions
    // not needed for now
    // fileText = this.replaceMathExpression(fileText, true)

    return fileText
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
      console.log(questionAnswers)
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
