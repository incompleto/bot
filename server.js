const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios')
const getURLS = require('get-urls')

const API_KEY=process.env.API_KEY

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

app.post('/message', function(req, res) {
  const { message } = req.body

  if (!message) {
    return res.end()
  }
  
  console.log(message)
  
  let urls = getURLS(message.text)
   
  if (!urls.size) {
    return res.end()
  }
  
  console.log(urls)

  let chat_id = message.chat.id
  let text = urls.size > 1 ? 'Nice urls!' : 'Nice url!'
  let url = `https://api.telegram.org/bot${API_KEY}/sendMessage`
   
  axios
    .post(url, { chat_id, text })
    .then(response => {
      res.end('ok')
    })
    .catch(err => {
      console.log('Error :', err)
      res.end('Error :' + err)
    })
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});