import path from "path"

import { manipulatorManCommander } from "../cli_args/cli_manipulator"
import { LaTeXManipulator } from "../manipulator/LaTeXManipulator"
import { MDManipulator } from "../manipulator/MDManipulator"

const manipulatorOpts = manipulatorManCommander.opts()

/*
    NAČRT: 
    - tex
        1) prečiščim datoteko
        2) pošljem v mdman
        3) naredi izpise
    - md 
        1) preberem datoteko
        2) naredim CSV
        3) zaženem Anki
*/

/**
 * Cleaning LaTeX document
 * Writing MD file
 * Calling MDManipulator
 */
if (path.extname(manipulatorOpts.input) == ".tex") {
  const tex = new LaTeXManipulator(
    manipulatorOpts.input,
    manipulatorOpts.fileName,
    // can get rid of you
    manipulatorOpts.ankiTag,
    manipulatorOpts.run
  )

  tex.removeEndlines()
  tex.removeTabs()
  tex.removeSections()
  tex.removeLaTeX()
  tex.removeDoubleEmptyLines()
  tex.removeLaTeXComments()

  // mogoče je še prezgodaj
  // in to raje naredim v MDManipulator
  // tex.prepareMd()

  if (manipulatorOpts.typeOfFile == 1 || manipulatorOpts.typeOfFile == 3) {
    tex.writeToFile()
  }

  const md = new MDManipulator(
    manipulatorOpts.input,
    tex.getFileName(),
    tex.getTagName(),
    manipulatorOpts.run,
    tex.getFileText()
  )
  // nekako moram narediti, da bom lahko outputal datoteko po CSV
  // md.replaceMathExpression()
  md.imageDetection()
  md.codeDetection()
  md.fillCsvData2()
  md.CSVstyleAllTitles()
  md.titleAnswerReplaceSpecial()
  md.CSVLineBreaksToHTML()
  if (manipulatorOpts.typeOfFile == 3 || manipulatorOpts.typeOfFile == 2) {
    md.csvWriteToFile()
  }
}

if (path.extname(manipulatorOpts.input) == ".md") {
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
  md.codeDetection()
  md.fillCsvData2()
  md.CSVstyleAllTitles()
  md.titleAnswerReplaceSpecial()
  md.CSVLineBreaksToHTML()

  if (manipulatorOpts.typeOfFile == 2 || manipulatorOpts.typeOfFile == 3) {
    md.csvWriteToFile()
  }
}
