import * as fs from "fs"
import * as child_process from "child_process"
import csvStringify from "csv-stringify"
import * as path from "path"
const hljs = require("highlight.js")

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

  clozeDetection(text: string, counter: number) {
    let clozedText = text.replace(/\{\{(.)*\}\}/g, (a, b) => {
      a = a.replace(/[\{\}]/g, "")
      const output = `{{c${counter}::${a}}}`
      counter += 1
      return output
    })
    return clozedText
  }

  imageDetection() {
    let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
    let imageFormats = [
      "JPEG",
      "PNG",
      "GIF",
      "APNG",
      "TIFF",
      "MP4",
      "MPEG",
      "MPG",
      "AVI",
      "WEBM",
    ]

    let matches = this.fileText.match(urlRegex)
    if (matches) {
      matches.forEach((match: string) => {
        let extension = path.extname(match).split(".")[1]
        // replacing image link with IMG tag
        if (imageFormats.indexOf(extension)) {
          if (!this.fileText.match(`<img src="${match}" />`)) {
            this.fileText = this.fileText
              .split(match)
              .join(`<img src="${match}" />`)
          }
        }
      })
    }
  }

  // syntax styles availble at
  // https://github.com/highlightjs/highlight.js/blob/main/src/styles/atom-one-dark.css
  codeDetection() {
    // /s allows operator . to match newlines
    const topCodeRegex = /```[a-z]+\r*\n/gs

    let topSplit = this.fileText.split(topCodeRegex)
    if (topSplit) {
      topSplit.forEach((el: string, index: number) => {
        if (el.match("```")) {
          let codeText = el.split("```")[0]
          let highlightedCode = `<pre><code>${
            hljs.highlightAuto(codeText).value
          }</code></pre>`

          this.fileText = this.fileText.replace(
            codeText.trim(),
            highlightedCode
          )
        }
      })
    }
    // cleaning out MD ``` code syntax
    this.fileText = this.fileText
      .split(/```[a-z]+\r*\n/)
      .join("\n")
      .split("```")
      .join("\n")
  }

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

    // searching for indexes of questions
    let iQuestions: any[] = []
    questions.forEach((question, index) => {
      iQuestions.push(lines.indexOf(question))
    })

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

  // searching for n-title-type title
  // eg. Title1: Title2 => Title3
  // eg. Title1: Title2
  numOfTitles(title: string): number {
    let matchColumn = title.match(/.+:/)
    let matchArrow = title.match(/.+=>/)

    let number = 1
    if (matchColumn && matchArrow) {
      number = 3
    } else if (matchColumn) {
      number = 2
    }

    return number
  }

  // function that encaspuslates text within passed tags and class parameters
  // needed implementation in case of non array like classes parametre
  addHTML(element: string, tag: string, classes: string[]): string {
    let openingTag = `<${tag} class="`

    for (let i = 0; i < classes.length; i++) {
      openingTag += " " + classes[i]
    }
    openingTag += `">`
    openingTag += element
    openingTag += `</${tag}>`

    return openingTag
  }

  modify3Titles(title: string): string {
    // splitting string into separate titles
    let cleanedTitles = {
      title1: title.split(":")[0].trim(),
      title2: title.split("=>")[0].split(":")[1].trim(),
      title3: title.split("=>")[1].trim(),
    }

    // modifying files to different colors
    let newTitles = {
      title1: `${this.addHTML(cleanedTitles.title1, "span", [
        "naslov-sklop-1",
      ])}: `,
      title2: `${this.addHTML(cleanedTitles.title2, "span", [
        "naslov-sklop-2",
      ])} => `,
      title3: `${this.addHTML(cleanedTitles.title3, "span", [
        "naslov-sklop-3",
      ])}`,
    }

    return newTitles.title1 + newTitles.title2 + newTitles.title3
  }

  modify2Titles(title: string): string {
    const cleanedTitles = {
      title1: title.split(":")[0].trim(),
      title2: title.split(":")[1].trim(),
    }

    const newTitles = {
      title1: `${this.addHTML(cleanedTitles.title1, "span", [
        "naslov-sklop-2",
      ])}: `,
      title2: `${this.addHTML(cleanedTitles.title2, "span", [
        "naslov-sklop-3",
      ])}`,
    }

    return newTitles.title1 + newTitles.title2
  }

  // function that automates title styling
  styleAllTitles(): void {
    // element is 2D array [question, answer(s)]
    this.csvData.map((element: string[]) => {
      let titleCount = this.numOfTitles(element[0])

      if (titleCount == 3) {
        element[0] = this.modify3Titles(element[0])
      } else if (titleCount == 2) {
        element[0] = this.modify2Titles(element[0])
      }

      return element
    })
  }
}

export { MDManipulator }
