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
    // console.log(pathElements)
    this.pathElements = pathElements
    return pathElements
  }
  // serches for only one file with fileExtension in directory
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
      for (const dirEl of dirElements) {
        filePaths.push(path.join(workingDir, dirEl))
      }
    }
    console.log(filePaths)
    return filePaths
  }
}

const fm = new File_merger("D:\\Anki_zapiski\\01_LETNIK\\OMA")
fm.setSubdirectories()
// i will create only with pdf files as they do not need any further compilation
fm.searchForFiles("tex")
