const path = require("path")

import { manipulatorManCommander } from "../cli_args/cli_manipulator"
import { LaTeXManipulator } from "../manipulator/LaTeXManipulator"
import { MDManipulator } from "../manipulator/MDManipulator"

const tex = new LaTeXManipulator(
  manipulatorManCommander.opts().input,
  manipulatorManCommander.opts().fileName,
  manipulatorManCommander.opts().ankiTag,
  manipulatorManCommander.opts().run
)

/**
 * REQUIRED
 * for cleaning up LaTeX document
 */

if (path.extname(manipulatorManCommander.opts().input) == ".tex") {
  tex.removeEndlines()
  tex.removeTabs()
  tex.removeSections()
  tex.removeLaTeX()
  tex.removeDoubleEmptyLines()
  tex.writeToFile()
}
