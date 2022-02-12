import * as fs from "fs"
import * as child_process from "child_process"
import csvStringify from "csv-stringify"
import * as path from "path"
import hljs from "highlight.js"

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
    this.filePath = filePath
    this.fileName =
      fileName ?? path.basename(filePath).replace(path.extname(filePath), "")
    this.runPrograms = runPrograms
    this.fileText = fileText ?? fs.readFileSync(filePath, "utf-8")
    this.tag = this.generateTag(tag)
  }

  generateTag(tag: string): string {
    const fileNameSplitted = this.fileName.split("_")
    const newTag =
      tag && tag.length > 0
        ? tag
        : fileNameSplitted.length === 3
        ? `${fileNameSplitted[1]}-${fileNameSplitted[0]}`
        : ""

    return newTag
  }

  replaceMathExpression(isVaried: boolean = true): MDManipulator {
    if (isVaried) {
      // option for inline and multiline math => not obsidian friendly
      this.fileText = this.fileText
        .split(/\\\(\s*/)
        .join("$")
        .split(/\s*\\\)/)
        .join("$")
    } else {
      // option for multiline only => obsidian friendly
      this.fileText = this.fileText
        .split(/\\\(\s*/)
        .join("$$")
        .split(/\s*\\\)/)
        .join("$$")
    }

    // transforming multiline math expressions to $$ syntax
    this.fileText = this.fileText
      .split(/\\\[\s*/)
      .join("$$")
      .split(/\s*\\\]/)
      .join("$$")

    // NOTE: Returning this for chaining
    return this
  }

  clozeDetection(text: string, counter: number): string {
    let clozedText = text.replace(/\{\{(.)*\}\}/g, (a, b) => {
      a = a.replace(/[\{\}]/g, "")
      const output = `{{c${counter}::${a}}}`
      counter += 1
      return output
    })
    return clozedText
  }

  imageDetection(): MDManipulator {
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
    // Preveri, da je matchana slika in ne le link
    // Ce je navaden link, ga ustrezno popravi
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

    // NOTE: Returning this for chaining
    return this
  }

  // syntax styles availble at
  // https://github.com/highlightjs/highlight.js/blob/main/src/styles/atom-one-dark.css
  codeDetection(): MDManipulator {
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

    // NOTE: Returning this for chaining
    return this
  }

  fillCsvData2(): MDManipulator {
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
      let iStart = iQuestions[index] + 1 + 1
      let iEnd = iQuestions[index + 1] ?? lines.length

      let questionAnswers = [
        String(lines[question]),
        lines.slice(iStart, iEnd).join("\n").trim(),
        this.tag,
      ]

      this.csvData.push(questionAnswers)
    })

    // NOTE: Returning this for chaining
    return this
  }

  csvWriteToFile(
    writePath: string = this.fileName,
    writeExtension: string = "csv"
  ): MDManipulator {
    csvStringify(
      this.randomizeArray(this.csvData),
      {
        header: false,
        delimiter: ";",
      },
      (err: any, csvToWrite: any) => {
        if (err) {
          throw err
        }

        fs.writeFileSync(writePath + "." + writeExtension, csvToWrite)
        // opening Anki desktop application with a prompt for inporting current CSV file
        // Anki should be running before we can pass CLI parameter for import
        if (this.runPrograms === 1) {
          child_process.exec(`anki &`)
          child_process.exec(`anki ${writePath + "." + writeExtension}`)
        }
      }
    )

    // NOTE: Returning this for chaining
    return this
  }

  randomizeArray(inputArray: any[]): any[] {
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
    let encapsulatedHTML = `<${tag} class="`

    encapsulatedHTML += classes.join(" ")

    encapsulatedHTML += `">`
    encapsulatedHTML += element
    encapsulatedHTML += `</${tag}>`

    return encapsulatedHTML
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

    return `${newTitles.title1}<br />${newTitles.title2}<br />${newTitles.title3}`
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

    // return newTitles.title1 + newTitles.title2
    return `${newTitles.title1}<br />${newTitles.title2}`
  }

  // function that automates title styling
  CSVstyleAllTitles(): MDManipulator {
    // element is 2D array [question, answer(s)]
    this.csvData.map((element: string[]) => {
      let titleCount = this.numOfTitles(element[0])

      if (titleCount === 3) {
        element[0] = this.modify3Titles(element[0])
      } else if (titleCount === 2) {
        element[0] = this.modify2Titles(element[0])
      }

      return element
    })

    // NOTE: Returning this for chaining
    return this
  }

  CSVLineBreaksToHTML(): MDManipulator {
    this.csvData.map((element: string[]) => {
      element[0] = element[0].split(/\r*\n/).join("<br />")
      element[1] = element[1].split(/\r*\n/).join("<br />")
    })

    // NOTE: Returning this for chaining
    return this
  }

  titleReplaceSpecial(element: string): string {
    /*
      ZAČASNO ZAKOMENTIRAM DOKLER NE NAREDIM BOLJŠE REŠITVE

    const oldCharacters = [":", "=>"]
    const newCharacters = ["\\(:\\)", "\\(\\Rightarrow\\)"]
    */
    const oldCharacters = ["=>"]
    const newCharacters = ["\\(\\Rightarrow\\)"]

    oldCharacters.forEach((character, index) => {
      element = element.split(character).join(newCharacters[index])
    })

    return element
  }

  titleAnswerReplaceSpecial(): MDManipulator {
    // uprabim funckijo title replace in poznere answer replace
    this.csvData.map((element: string[], index: number) => {
      element[0] = this.titleReplaceSpecial(element[0])
      element[1] = this.answerReplaceSpecial(element[1])
      return element
    })

    // NOTE: Returning this for chaining
    return this
  }

  // searches for lines that star with ::
  // and styles them for Anki output
  doubleColumnDefinition(element: string): string {
    let definition = element.match(/::(.+)\n+/)

    let newElement = element
    if (definition) {
      // capatilizing first letter in string
      let replacementString = definition[1].trim()
      replacementString =
        replacementString.charAt(0).toUpperCase() + replacementString.slice(1)

      newElement = newElement
        .split(definition[0])
        .join(
          this.addHTML(`\\(::\\) ${replacementString}`, "div", ["definition"])
        )
    }

    return newElement
  }

  answerReplaceSpecial(element: string): string {
    element = this.doubleColumnDefinition(element)
    element = this.dashesToLonger(element)

    return element
  }

  // dela le na prvem elementu ne glede na /g flag
  dashesToLonger(element: string): string {
    // return element.replace(/(\n|^)(-)( *.*\n)/g, "$1—$3")
    let tmpElement = element.split(/\n *-/).join("\n—")
    tmpElement = tmpElement.split(/^ *-/).join("—")

    return tmpElement
  }
}

export { MDManipulator }
