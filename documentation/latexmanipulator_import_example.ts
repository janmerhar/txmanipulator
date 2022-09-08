import { LaTeXManipulator } from "txmanipulator"

const tex = new LaTeXManipulator(
  "name_of_input_file.md",
  "name_of_output_file.csv",
  "name_of_anki_tag",
  "run_option: int"
)

tex
  // Remove \n end lines
  .removeEndlines()
  // Remove \t tabs
  .removeTabs()
  // Remove \section LaTeX tags
  .removeSections()
  // Remove remaining LaTeX tags
  .removeLaTeX()
  // Remove double \n\n end lines
  .removeDoubleEmptyLines()
  // Remove LaTeX commented lines that start with %
  .removeLaTeXComments()

// Finally writing computed Markdown file to .md file
tex.writeToFile()
