const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios')
const getURLS = require('get-urls') 

const Storage = require('./storage')

const TELEGRAM_API_KEY = process.env.API_KEY
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`

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

const handleURLS = (message, urls) => {
  let from = message.from
  let chat = message.chat
  let text = urls.length > 1 ? 'Nice urls!' : 'Nice url!'

  storeURLS(chat, from, urls)
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
  
  console.log(message)

  if (message && message.photo) {
    let file_id = message.photo[message.photo.length - 1].file_id
    let url = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/getFile?file_id=${file_id}`

    axios.get(url).then(response => {

      let from = message.from
      let chat = message.chat
      let group = chat.title
      let username = from.username

      let image = [{ url: `https://api.telegram.org/file/bot${TELEGRAM_API_KEY}/${response.data.result.file_path}` }]
      
      Storage.storeImage({ group, username, image }, (response) => {
        console.log(response)
      })
    })
  }
  
  if (message && message.text) {
    let urls = Array.from(getURLS(message.text))

    if (urls.length > 0) {
      handleURLS(message, urls)
    }
  }
  res.end('ok')
}

app.post('/message', onMessage)

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
