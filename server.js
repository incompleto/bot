const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios')
const getURLS = require('get-urls')

const API_KEY = process.env.API_KEY
const TELEGRAM_URL = `https://api.telegram.org/bot${API_KEY}/sendMessage`

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

const answerToURLS = (res, urls, message) => {
  let chat_id = message.chat.id
  let text = urls.size > 1 ? 'Nice urls!' : 'Nice url!'
  let data = { chat_id, text }
  
  axios
    .post(TELEGRAM_URL, data)
    .then(response => {
      res.end('ok')
    })
    .catch(err => {
      console.log('Error :', err)
      res.end('Error :' + err)
    })
}

app.post('/message', function(req, res) {
  const { message } = req.body
  let urls = new Set()

  console.log(message)
  
  if (message && message.text) {
    urls = getURLS(message.text)
  }
  
  console.log(urls, message.text)
  
  if (!message && !urls.size) {
    return res.end()
  }
  

  if (urls.size > 0) {
    answerToURLS(res, urls, message)
  }
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});