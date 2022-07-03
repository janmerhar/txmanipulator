import path from "path"

import { manipulatorManCommander } from "./cli_args/cli_manipulator"
import { LaTeXManipulator } from "./manipulator/LaTeXManipulator"
import { MDManipulator } from "./manipulator/MDManipulator"

const manipulatorOpts = manipulatorManCommander.opts()
const extensionName = path.extname(manipulatorOpts.input)

/**
 * Cleaning LaTeX document
 * Writing MD file
 * Calling MDManipulator
 */
if (extensionName == ".tex") {
  const tex = new LaTeXManipulator(
    manipulatorOpts.input,
    manipulatorOpts.fileName,
    // can get rid of you
    manipulatorOpts.ankiTag,
    manipulatorOpts.run
  )

  tex
    .removeEndlines()
    .removeTabs()
    .removeSections()
    .removeLaTeX()
    .removeDoubleEmptyLines()
    .removeLaTeXComments()

  // mogoče je še prezgodaj
  // in to raje naredim v MDManipulator
  // tex.prepareMd()

  if (manipulatorOpts.typeOfFile == 1 || manipulatorOpts.typeOfFile == 3) {
    tex.writeToFile()
  }

  const md = new MDManipulator(
    manipulatorOpts.input,
    tex.fileName,
    tex.tag,
    manipulatorOpts.run,
    tex.fileText
  )
  // nekako moram narediti, da bom lahko outputal datoteko po CSV
  // md.replaceMathExpression()
  md.imageDetection()
    .codeDetection()
    .fillCsvData2()
    .CSVstyleAllTitles()
    .titleAnswerReplaceSpecial()
    .CSVLineBreaksToHTML()

  if (manipulatorOpts.typeOfFile == 3 || manipulatorOpts.typeOfFile == 2) {
    md.csvWriteToFile()
  }
}

if (extensionName == ".md") {
  const md = new MDManipulator(
    manipulatorOpts.input,
    manipulatorOpts.fileName,
    // tukaj imam težave, saj ne naredi pravilnega taga
    // verjetno je problem v konstruktorju
    manipulatorOpts.ankiTag,
    manipulatorOpts.run
  )
  // nekako moram narediti, da bom lahko outputal datoteko po CSV
  // md.replaceMathExpression()
  md.imageDetection()
    .codeDetection()
    .fillCsvData2()
    .CSVstyleAllTitles()
    .titleAnswerReplaceSpecial()
    .CSVLineBreaksToHTML()

  if (manipulatorOpts.typeOfFile == 2 || manipulatorOpts.typeOfFile == 3) {
    md.csvWriteToFile()
  }
}
