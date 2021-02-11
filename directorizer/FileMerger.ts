import * as fs from "fs"
const path = require("path")
const PDFMerger = require("pdf-merger-js")

class FileMerger {
  startingPath: string
  pathElements: Array<any>
  filePaths: Array<any>

  constructor(startingPath: string) {
    this.startingPath = startingPath
    this.pathElements = []
    this.filePaths = []
  }
  setSubdirectories() {
    const pathElements = fs
      .readdirSync(this.startingPath, {
        withFileTypes: true,
      })
      .filter(
        (dirent: any) => dirent.isDirectory() && dirent.name.charAt(0) != "."
      )
      .map((dirent: any) => dirent.name)
    // console.log(pathElements)
    this.pathElements = pathElements
    return pathElements
  }
  // serches for only one file with fileExtension in directory
  searchForFiles(fileExtension: string) {
    // console.log(fileExtension)
    const filePaths = []
    for (const pathEl of this.pathElements) {
      let workingDir = path.join(this.startingPath, pathEl)
      let dirElements = fs
        .readdirSync(workingDir, { withFileTypes: true })
        .filter(
          (dirent: any) =>
            dirent.isFile() && path.extname(dirent.name) == `.${fileExtension}`
        )
        .map((dirent: any) => dirent.name)
      for (const dirEl of dirElements) {
        filePaths.push(path.join(workingDir, dirEl))
      }
    }
    // console.log(filePaths)
    this.filePaths = filePaths
    return filePaths
  }
  async mergeAndWrite(fileExtension: string) {
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
