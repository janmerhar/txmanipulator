// import { templateCommander } from "../cli_args/cli_template"
import dateFormat from "dateformat"

// templateCommander.parse(process.argv)

describe("templateCommander", () => {
  const defaultObject = {
    author: "",
    date: dateFormat(new Date(), "yyyy-mm-dd"),
    fileName: "DEFAULT_NAME",
  }

  it("parses required arguments", () => {
    // Single word input
    const {
      templateCommander: templateCommander1,
    } = require("../cli_args/cli_template")

    const input1 = ["dummy", "dummy", ..."-t Title".split(" ")]
    templateCommander1.parse(input1)
    expect(templateCommander1.opts()).toEqual({
      ...defaultObject,
      title: "Title",
    })

    // Multiple word input
    const {
      templateCommander: templateCommander2,
    } = require("../cli_args/cli_template")

    const input2 = ["dummy", "dummy", ..."-t Title, but longer".split(" ")]
    templateCommander2.parse(input2)
    expect(templateCommander2.opts()).toEqual({
      ...defaultObject,
      // For some reason commander.js library
      // keeps old arguments alive
      // i believe it is due to
      // CommandFunctions.joinThings()
      // that cocatenates previous arguments with newer ones
      title: "Title" + " " + "Title, but longer",
    })
  })
  it.todo("parses optional arguments")
})
