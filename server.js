const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios')

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

  console.log(message)

  if (!message) {
    return res.end()
  }

  let chat_id = message.chat.id
  let text = 'Polo'
  
  axios
    .post(`https://api.telegram.org/bot${API_KEY}/sendMessage`, { chat_id, text })
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
