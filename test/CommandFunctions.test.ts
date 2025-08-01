import { CommandFunctions } from "../cli_args/CommandFunctions"

describe("CommandFunctions", () => {
  it("parses number", () => {
    // Integer to Integer
    expect(CommandFunctions.myParseInt(123, null)).toEqual(123)

    // String to Integer
    expect(CommandFunctions.myParseInt("456", null)).toEqual(456)
    expect(CommandFunctions.myParseInt("456.654", null)).toEqual(456)

    // Float to Integer
    expect(CommandFunctions.myParseInt(3.14159, null)).toEqual(3)
  })

  it("joins strings", () => {
    const testJoinThings = (strings: Array<any>): String => {
      let output = ""
      for (const el of strings) {
        output = CommandFunctions.joinThings(el, output)
      }

      return output
    }

    // Array of strings
    const strings1 = ["abc", "beta", "c", "2", "3.14"]
    expect(testJoinThings(strings1)).toEqual(strings1.join(" "))

    // Array of numbers
    const strings2 = [1, 2, 3.14, 46, 500000]
    expect(testJoinThings(strings2)).toEqual(strings2.join(" "))

    // Array of strings and numbers
    const strings3 = [...strings1, ...strings2]
    expect(testJoinThings(strings3)).toEqual(strings3.join(" "))
  })

  it("returns lowercase string", () => {
    // Lowercase string
    const stringOG = "latex template"
    expect(CommandFunctions.lowerCase(stringOG, null)).toEqual(stringOG)

    // Uppercase string
    const string2 = "LATEX TEMPLATE"
    expect(CommandFunctions.lowerCase(string2, null)).toEqual(stringOG)

    // Lowercase and uppercase string
    const string3 = "LaTeX Template"
    expect(CommandFunctions.lowerCase(string3, null)).toEqual(stringOG)
  })

  it("decodes file name without extension", () => {
    // Basename of a file without extension
    const file1 = "example"
    expect(CommandFunctions.fileWithoutExtension(file1)).toEqual(file1)

    // Basename of a file with single extension
    const file2 = "example.txt"
    expect(CommandFunctions.fileWithoutExtension(file2)).toEqual(file1)

    // Basename of a file with double extension
    const file3 = "example.txt.md"
    expect(CommandFunctions.fileWithoutExtension(file3)).toEqual(file2)

    // Path of a file without extension
    const file4 = `/home/jan/Programming/LaTeX_template/${file1}`
    expect(CommandFunctions.fileWithoutExtension(file4)).toEqual(file4)

    // Path of a file with single extension
    const file5 = `/home/jan/Programming/LaTeX_template/${file2}`
    expect(CommandFunctions.fileWithoutExtension(file5)).toEqual(file4)

    // Path of a file with double extension
    const file6 = `/home/jan/Programming/LaTeX_template/${file3}`
    expect(CommandFunctions.fileWithoutExtension(file6)).toEqual(file5)
  })

  // I cannot properly test this method,
  // since it relies on process.cwd() function within method body
  // and takes zero input arguments
  it.todo("decodes file name off directory structure")
})
