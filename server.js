var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message', {
	name : String,
	message : String
})

const uri = 'mongodb+srv://tsearle:dbFudgey2020@wellnest-0swvy.mongodb.net/test?retryWrites=true';

// Define GET Method
app.get('/messages', (req,res) => {
	Message.find({}, (err,messages) => {
		res.send(messages);
	})
})

// Define POST Method
app.post('/messages', async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('saved');

    var censored = await Message.findOne({message:'badword'});
      if(censored)
        await Message.remove({_id: censored.id})
      else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})

// SocketIO
io.on('connection', () => {
	console.log('a user is connected')
})

mongoose.connect(uri,{ useNewUrlParser: true }, (err) => { 
   console.log('mongodb connected',err);
})

var server = http.listen(3000, () => {
	console.log('server is running on port', server.address().port);
});