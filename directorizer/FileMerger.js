const fs = require("fs")
const path = require("path")
const PDFMerger = require("pdf-merger-js")

class FileMerger {
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
    // console.log(fileExtension)
    const filePaths = []
    for (const pathEl of this.pathElements) {
      let workingDir = path.join(this.startingPath, pathEl)
      let dirElements = fs
        .readdirSync(workingDir, { withFileTypes: true })
        .filter(
          (dirent) =>
            dirent.isFile() && path.extname(dirent.name) == `.${fileExtension}`
        )
        .map((dirent) => dirent.name)
      for (const dirEl of dirElements) {
        filePaths.push(path.join(workingDir, dirEl))
      }
    }
    // console.log(filePaths)
    this.filePaths = filePaths
    return filePaths
  }
  async mergeAndWrite(fileExtension) {
    const merger = new PDFMerger()
    const merging = async () => {
      for (const filePath of this.filePaths) {
        merger.add(filePath)
      }
      const mergedFileName = `${path.basename(
        this.startingPath
      )}.${fileExtension}`
      await merger.save(mergedFileName)
      console.log(`Successfully written as ${mergedFileName}`)
    }
    merging()
  }
}

// const fm = new FileMerger("D:\\Anki_zapiski\\01_LETNIK\\DSB")
// fm.setSubdirectories()
// // I will create only with pdf files as they do not need any further compilation
// // I may options for mergin files of other types: eg. TEX
// fm.searchForFiles("pdf")
// fm.mergeAndWrite("pdf")

module.exports = FileMerger
