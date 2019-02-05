const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios')
const getURLS = require('get-urls') 

const API_KEY = process.env.API_KEY
const TELEGRAM_URL = `https://api.telegram.org/bot${API_KEY}/sendMessage`



const Storage = require('./storage')


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

const reply = (chat_id, text) => {
  return axios.post(TELEGRAM_URL, { chat_id, text })
}

const storeURLS = (chat, from, urls) => {
  let group = chat.title
  let username = from.username

  urls.forEach((url) => {
    Storage.storeURL({ group, username, url }, (response) => {
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
      let text = urls.length > 1 ? 'Nice urls!' : 'Nice url!'
      
      reply(message.chat.id, text)
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