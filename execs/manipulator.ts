const path = require("path")

import { manipulatorManCommander } from "../cli_args/cli_manipulator"
import { LaTeXManipulator } from "../manipulator/LaTeXManipulator"
import { MDManipulator } from "../manipulator/MDManipulator"

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
if (path.extname(manipulatorManCommander.opts().input) == ".tex") {
  const tex = new LaTeXManipulator(
    manipulatorManCommander.opts().input,
    manipulatorManCommander.opts().fileName,
    // can get rid of you
    manipulatorManCommander.opts().ankiTag,
    manipulatorManCommander.opts().run
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

  if (
    manipulatorManCommander.opts().typeOfFile == 1 ||
    manipulatorManCommander.opts().typeOfFile == 3
  ) {
    tex.writeToFile()
  }

  const md = new MDManipulator(
    manipulatorManCommander.opts().input,
    tex.getFileName(),
    tex.getTagName(),
    manipulatorManCommander.opts().run,
    tex.getFileText()
  )
  md.imageDetection()
  md.codeDetection()
  md.fillCsvData2()
  md.styleAllTitles()
  if (
    manipulatorManCommander.opts().typeOfFile == 3 ||
    manipulatorManCommander.opts().typeOfFile == 2
  ) {
    md.csvWriteToFile()
  }
}

if (path.extname(manipulatorManCommander.opts().input) == ".md") {
  const md = new MDManipulator(
    manipulatorManCommander.opts().input,
    manipulatorManCommander.opts().fileName,
    // tukaj imam težave, saj ne naredi pravilnega taga
    // verjetno je problem v konstruktorju
    manipulatorManCommander.opts().ankiTag,
    manipulatorManCommander.opts().run
  )
  md.imageDetection()
  md.codeDetection()
  md.fillCsvData2()
  md.styleAllTitles()
  if (
    manipulatorManCommander.opts().typeOfFile == 2 ||
    manipulatorManCommander.opts().typeOfFile == 3
  ) {
    md.csvWriteToFile()
  }
}
