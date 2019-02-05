const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios')
const getURLS = require('get-urls')
const Airtable = require('airtable')

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_ENDPOINT = process.env.AIRTABLE_ENDPOINT
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_NAME
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE

const API_KEY = process.env.API_KEY
const TELEGRAM_URL = `https://api.telegram.org/bot${API_KEY}/sendMessage`

Airtable.configure({
  endpointUrl: AIRTABLE_ENDPOINT,
  apiKey: AIRTABLE_API_KEY
})

let base = new Airtable({ AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)

const showError = (error) => {
  console.error(error)
}

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.use(bodyParser.json()) 
app.use(
  bodyParser.urlencoded({
    extended: true
  })
) 

const answerToURLS = (urls, message) => {
  let chat_id = message.chat.id
  let text = urls.length > 1 ? 'Nice urls!' : 'Nice url!'
  let data = { chat_id, text }

  return axios.post(TELEGRAM_URL, data)
}

const storeURLS = (chat, from, urls) => {
  let group = chat.title
  let username = from.username

  urls.forEach((url) => {
    base(AIRTABLE_TABLE).create({ group, username, url }, (response) => {
      console.log(response)
    })
  })
}

const onMessage = (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.end()
  }

  if (message && message.text) {
    let from = message.from
    let chat = message.chat

    let urls = Array.from(getURLS(message.text))

    if (urls.length > 0) {
      answerToURLS(urls, message)
        .then(response => {
          storeURLS(chat, from, urls)
        })
        .catch(err => {
          console.log('Error :', err)
          res.end('Error :' + err)
          return
        })
    }
  }

  res.end('ok')
}

app.post('/message', onMessage)

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});