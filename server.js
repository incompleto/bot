const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios')
const extractURLs = require('get-urls') 

const Storage = require('./storage')

const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`

const REGEXP_TAGS = /<#.*?\|(.*?)>|#(\w+)/gi
const REGEXP_TAG = /<#.*?\|(.*?)>|#(\w+)/

const showError = (error) => {
  console.error(error)
}

app.use(express.static('public'))

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html')
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

const handleURLS = (message, urls, tags) => {
  let from = message.from
  let chat = message.chat
  let description = extractDescription(message.text, tags, urls)
  
  console.log(from, chat, description, urls, tags)
  
  storeURLS(chat, from, urls, tags)
}

const handlePhoto = (message, photo) => {
  
  let file_id = photo[photo.length - 1].file_id
  let url = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/getFile?file_id=${file_id}`

  const onGetResponse = (response) => {
    
    let from = message.from
    let chat = message.chat
    let group = chat.title
    let username = from.username

    let image = [{ url: `https://api.telegram.org/file/bot${TELEGRAM_API_KEY}/${response.data.result.file_path}` }]

    Storage.storeImage({ group, username, image }, (response) => {
      console.log(response)
    })
  }
  
  axios.get(url).then(onGetResponse)
}

const handleChatAvatar = (message, photo) => {
  
  let file_id = photo[photo.length - 1].file_id
  let url = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/getFile?file_id=${file_id}`

  const onGetResponse = (response) => {

    let from = message.from
    let chat = message.chat
    let group = chat.title
    let username = from.username

    let image = [{ url: `https://api.telegram.org/file/bot${TELEGRAM_API_KEY}/${response.data.result.file_path}` }]

    Storage.storeAvatar({ group, username, image }, (response) => {
      console.log(response)
    })
  }
  
  axios.get(url).then(onGetResponse) 
}

const storeURLS = (chat, from, urls, tags) => {
  let group = chat.title
  let username = from.username

  urls.forEach((url) => {
    Storage.storeURL({ group, username, url, tags }, (response) => {
      console.log(response)
    })
  })
}

const extractTags = (text) => {

  let matches = text.match(REGEXP_TAGS)
  let tags = []
  
  if (matches && matches.length) {
    matches.forEach((m) => {
      let tag = m.match(REGEXP_TAG)
      tags.push(tag[1] || tag[2])
    })
  }

  return tags
}

const extractDescription = (text, tags, urls) => {  
  return text.split(' ').filter((word) => {
    if ((urls && !urls.includes(word)) && (tags && !tags.includes(word))) {
      return word 
    }
  }).join(' ')
}

const onMessage = (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.end()
  }

      
  if (message && message.photo) {
    handlePhoto(message, message.photo)
  }

  if (message && message.new_chat_photo) {
    handleChatAvatar(message, message.new_chat_photo)
  }
  
  if (message && message.text) {
    let tags = extractTags(message.text)
    let urls = Array.from(extractURLs(message.text))
    let description = extractDescription(message.text, urls, tags)

    console.log('Extracting description', description)
    console.log('Content', message.text, tags, urls)
    
    
    if (urls.length > 0) {
      handleURLS(message, urls, tags)
    }
  }
  res.end('ok')
}

app.post('/message', onMessage)

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
