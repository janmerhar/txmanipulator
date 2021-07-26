import * as fs from "fs"
import * as child_process from "child_process"
import csvStringify from "csv-stringify"
import * as path from "path"

class RegexManipulator {
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

  // dodaj funkcionalnost, da vse math expressione spremmeni v $$ $$ saj le te podpira obsidian
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

  writeToFile(writePath = this.fileName, writeExtension = "md") {
    fs.writeFileSync(
      writePath + "." + writeExtension,
      this.prepareMd(this.fileText)
    )

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

  /*
   * Del namenjen za
   * CSV kalkulacije
   */

  clozeDetection(text: string, counter: number) {
    let clozedText = text.replace(/\{\{(.)*\}\}/g, (a, b) => {
      a = a.replace(/[\{\}]/g, "")
      const output = `{{c${counter}::${a}}}`
      counter += 1
      return output
    })
    return clozedText
  }

  fillCsvData() {
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
      // console.log(this.clozeDetection(questionAnswers[1], 1))

      // not usefull for now
      // questionAnswers[1] = this.clozeDetection(questionAnswers[1], 1)
      this.csvData.push(questionAnswers)
    }
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

      // iščem konec odgovora
      // pri tem moram paziti na zadnji odgovor

      // ni zadnji index
      let iStart = iQuestions[index] + 1 + 1
      let iEnd = iQuestions[index + 1] || lines.length
      let questionAnswers = [
        String(lines[question]),
        lines.slice(iStart, iEnd).join(""),
        this.tag,
      ]
      console.log(questionAnswers)
    })

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
      // not usefull for now
      // questionAnswers[1] = this.clozeDetection(questionAnswers[1], 1)
      this.csvData.push(questionAnswers)
    }
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
