class CommandFunctions {
  static myParseInt(value, dummyPrevious) {
    // parseInt takes a string and an optional radix
    return parseInt(value)
  }
  static joinThings(value, previous) {
    return `${previous || ""} ${value}`.trim()
  }
}

module.exports = CommandFunctions
