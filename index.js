const express = require('express')
const fs = require('fs')
const csvp = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors({ origin: '*' }))

const port = process.env.PORT || 8080

let csvReadings = []

function loadCsv() {
  fs.createReadStream('./students.csv')
    .pipe(csvp({}))
    .on('data', (data) => csvReadings.push(data))
    .on('end', () => {
      console.log('csv succesfully loaded')
    })
}

loadCsv()

app.get('/students', (req, res) => {
  console.log('request made to get all students')
  res.send(csvReadings)
})

app.get('/students/:id', (req, res) => {
  console.log('request made to get one student detail')
  const info = csvReadings.find((x) => x.studentNo === req.params.id)
  res.send(info)
})

app.post('/student', (req, res) => {
  console.log('request made to add new student')
  //we have req.body with studentNo, firstName and lastName Now add those data to csv-writer and append the data to nextline.
  res.send(req.body)

  const stdNo = req.body.studentNo
  const fName = req.body.firstName
  const lName = req.body.lastName

  console.log(stdNo, fName, lName)

  const csvWriter = createCsvWriter({
    path: './students.csv',
    header: [
      { id: 'stdno', title: 'studentNo' },
      { id: 'fname', title: 'firstName' },
      { id: 'lname', title: 'lastName' },
    ],
    append: true,
  })

  const records = [{ stdno: stdNo, fname: fName, lname: lName }]

  csvWriter
    .writeRecords(records) // returns a promise
    .then(() => {
      console.log('New record added...')
    })

  csvReadings = []
  loadCsv()
})

app.listen(port, () => {
  console.log('serve at http://localhost:8080')
})
