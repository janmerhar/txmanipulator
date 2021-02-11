const path = require("path")

class CommandFunctions {
  static myParseInt(value: any, dummyPrevious: any) {
    // parseInt takes a string and an optional radix
    return parseInt(value)
  }
  static joinThings(value: any, previous: any) {
    return `${previous || ""} ${value}`.trim()
  }
  static lowerCase(value: string, dummyPrevious: any) {
    return value.toLowerCase()
  }
  static fileWithoutExtension(value: string) {
    if (path.extname(value).length == 0) {
      return value
    } else {
      return value
        .split(".")
        .splice(0, value.split(".").length - 1)
        .join(".")
    }
  }
}

export { CommandFunctions }
