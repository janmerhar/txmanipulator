const path = require("path")

class CommandFunctions {
  static myParseInt(value, dummyPrevious) {
    // parseInt takes a string and an optional radix
    return parseInt(value)
  }
  static joinThings(value, previous) {
    return `${previous || ""} ${value}`.trim()
  }
  static lowerCase(value, dummyPrevious) {
    return value.toLowerCase()
  }
  static fileWithoutExtension(value) {
    if (path.extname(value).length == 0) {
      console.log(value)
      return value
    } else {
      return value
        .split(".")
        .splice(0, value.split(".").length - 1)
        .join(".")
    }
  }
}

module.exports = CommandFunctions
