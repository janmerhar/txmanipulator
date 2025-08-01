import { Command } from "commander"

// A little hack to reset the commander instance before each test.
// This is needed because commander instances are singletons and retain their state.
const freshCommander = () => {
  const commander = new Command()
  commander
    .requiredOption("-i, --input <string>", "Name of file that will be imported")
    .requiredOption(
      "-tof, --type-of-file <number>",
      "1 => MD file, 2 => CSV file, 3 => MD and CSV file",
      "3"
    )
    .option(
      "-at, --anki-tag <string>",
      "Input tag field value for imported document: eg. OMA-13"
    )
    .option(
      "-f, --file-name <string>",
      "Name of the output file",
      "DEFAULT_NAME" // Using a default string for predictability in tests
    )
    .option(
      "-r, --run <number>",
      "1 => runs manipulated data in program,  0 => doesn't run anything",
      "1"
    )
  return commander
}

describe("manipulatorManCommander", () => {
  it("parses required arguments and one optional argument", () => {
    const commander = freshCommander()
    const input = ["dummy", "dummy", "-i", "test.md", "-at", "MyTag"]
    commander.parse(input)
    const opts = commander.opts()
    expect(opts.input).toBe("test.md")
    expect(opts.ankiTag).toBe("MyTag")
  })

  it("uses default values for optional arguments", () => {
    const commander = freshCommander()
    const input = ["dummy", "dummy", "-i", "test.md"]
    commander.parse(input)
    const opts = commander.opts()
    expect(opts.input).toBe("test.md")
    expect(opts.typeOfFile).toBe("3")
    expect(opts.fileName).toBe("DEFAULT_NAME")
    expect(opts.run).toBe("1")
    expect(opts.ankiTag).toBeUndefined()
  })

  it("handles multi-word arguments", () => {
    const commander = freshCommander()
    const input = ["dummy", "dummy", "-i", "my file.md", "-at", "my anki tag"]
    commander.parse(input)
    const opts = commander.opts()
    expect(opts.input).toBe("my file.md")
    expect(opts.ankiTag).toBe("my anki tag")
  })
})