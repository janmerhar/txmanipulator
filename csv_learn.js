const stringify = require("csv-stringify")

const columns = {
  question: "question",
  answer: "answer",
}

const data = [
  ["Vprašanje1", "Odgovor1"],
  ["vprašanje2", "odgovor2"],
  ["jan\n je car\r\n\\(x + y \\)", "anede;"],
]

stringify(
  data,
  {
    header: false,
    delimiter: ";",
  },
  (err, output) => {
    if (err) throw err
    console.log(output)
  }
)
