const fs = require("fs")
const path = require("path")

class File_merger {
  constructor(startingPath) {
    this.startingPath = startingPath
  }
  setSubdirectories() {
    const pathElements = fs
      .readdirSync(this.startingPath, {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory() && dirent.name.charAt(0) != ".")
      .map((dirent) => dirent.name)
    console.log(pathElements)
    this.pathElements = pathElements
    return pathElements
  }
  searchForFiles(fileExtension) {
    const filePaths = []
    for (const pathEl of this.pathElements) {
      let workingDir = path.join(this.startingPath, pathEl)
      let dirElements = fs
        .readdirSync(workingDir, { withFileTypes: true })
        .filter(
          (dirent) =>
            dirent.isFile() && dirent.name.indexOf(`.${fileExtension}`) != -1
        )
        .map((dirent) => dirent.name)
      if (dirElements.length > 0) {
        filePaths.push(path.join(workingDir, dirElements[[0]]))
      }
    }
    console.log(filePaths)
    return filePaths
  }
}

const fm = new File_merger("D:\\NODE\\LaTeX_helper")
fm.setSubdirectories()
fm.searchForFiles("js")
