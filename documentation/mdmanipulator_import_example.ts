import { MDManipulator } from "txmanipulator"

const md = new MDManipulator(
  "name_of_input_file.md",
  "name_of_output_file.csv",
  "name_of_anki_tag",
  "run_option: int"
)

md
  // Detecting and encapsulating images in <img> tags
  .imageDetection()
  // Detecting blocks of code and translating them into HTML
  .codeDetection()
  // Creating basic data for writing to csv file
  .fillCsvData2()
  // Customization for specific type of anki cards' titles
  .CSVstyleAllTitles()
  // Cosmetic improvement for every title of anki cards
  .titleAnswerReplaceSpecial()
  // Translating \n line breaks to HTML tag <br>
  .CSVLineBreaksToHTML()

// Finally writing computed anki cards to .csv file
md.csvWriteToFile()
