const fs = require("fs")
const readline = require("readline")
const child_process = require("child_process")
const cliArgs = process.argv.slice(2)


class Csv_manipulator {
  constructor(filePath, fileName) {
    this.filePath = filePath
    this.fileName = fileName || filePath.match(/(.+?)(\.[^.]*$|$)/)[1]
    this.csvData = []
  }

  getFilePath() {
    return this.filePath
  }
  getFileName() {
    return this.fileName
  }
  getCsvData() {
    return this.csvData
  }

  pushToCsvData(pushable) {
    console.log(this.csvData)
    this.csvData.push(pushable)
  }

  // function that converts questions and answers to a table
  fileToCsv() {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(this.filePath),
      console: false,
      // this is used to log progress of each line in console
      //   output: process.stdout,
    })

    var previous = ""
    var current = ""
    var question = ""
    var answer = ""

    let that = this

    readInterface.on("line", (line) => {
      // keeping track with lines
      previous = current
      current = line

      // searching ending of questions
      // and pushing question-answer array to csvData
      if (
        line.length == 0 &&
        previous.length != 0 &&
        question.length != 0 &&
        answer.length != 0
      ) {
        let pushable = [question, answer]
        // that.csvData.push(pushable)
        this.pushToCsvData(pushable)
        question = ""
        answer = ""
      }

      // setting new question
      // and answer to empty string
      if (current.match(/----+/)) {
        question = previous
        answer = ""
      }

      // append line to answer if the title and line are not empty
      if (question.length != 0 && line.length != 0 && !current.match(/----+/)) {
        answer += `${line}\n`
      }
    })
  }
}

const csv = new Csv_manipulator(cliArgs[0])
csv.fileToCsv()
console.log(csv.csvData)
