const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')

const Utils = require('./utils')
const Storage = require('./storage')

const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`

app.use(express.static('public'))

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html')
})

app.use(bodyParser.json()) 
app.use(
  bodyParser.urlencoded({
    extended: true
  })
) 

const showError = (error) => {
  console.error(error)
}

const reply = (chat_id, text) => {
  return axios.post(TELEGRAM_URL, { chat_id, text })
}

const onStorageResponse = (response) => {
  console.log('Saved!', response)
}

const handleURLS = (message) => {
  let text = message.text
  let urls = Utils.extractURLS(text)
  
  if (!urls) {
    return
  }
  
  let tags = Utils.extractTags(text)
  let user = message.from.username
  let room = message.chat.title
  let comment = Utils.extractDescription(text, Utils.prependHashtags(tags), urls)

  storeURLS(room, user, comment, urls, tags)
}

const handleAvatar = (message) => {  
  handlePhoto(message, message.new_chat_photo)
}

const handlePhoto = (message, photo = undefined) => {
  let text = message.caption
  let tags = Utils.extractTags(text)
  let urls = Utils.extractURLS(text)
    
  photo = !photo ? message.photo : photo
  
  let file_id = photo[photo.length - 1].file_id
  let url = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/getFile?file_id=${file_id}`

  const onGetResponse = (response) => {

    let user = message.from.username
    let room = message.chat.title
    let type = 'image'
    let text = 'test'
    let comment = Utils.extractDescription(text, Utils.prependHashtags(tags), urls)

    let url = `https://api.telegram.org/file/bot${TELEGRAM_API_KEY}/${response.data.result.file_path}` 

    Storage.store({ url, text, type, comment, tags, room, user }, onStorageResponse)
  }

  axios.get(url).then(onGetResponse)
}

const storeURLS = (room, user, comment, urls, tags) => {
  let type = 'website'
  let text = ''
  
  urls.forEach((url) => {
    Storage.store({ url, text, type, comment, tags, room, user }, onStorageResponse)
  })
}

const onMessage = (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.end()
  } 
  
  if (message.photo) {
    handlePhoto(message)
  } else if (message.new_chat_photo) {
    handleAvatar(message)
  } else if (message.text) {
    handleURLS(message)
  }
  
  res.end('ok')
}

app.post('/message', onMessage)

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})