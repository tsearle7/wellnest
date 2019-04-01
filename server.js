var express = require('express');
var app = express();

var server = app.listen(3000, () => {
	console.log('server is running on port', server.address().port);});

app.use(express.static(__dirname));

// Using Mongoose to connect to MongoDB
var mongoose = require('mongoose');
var dbURL = 'mongodb+srv://tsearle:dbFudgey2020@wellnest-0swvy.mongodb.net/test?retryWrites=true'
mongoose.connect(dbUrl , (err) => { 
   console.log('mongodb connected',err);
})
var Message = mongoose.model('Message',{ name : String, message : String})

// Body parser extracts the entire body portion of an incoming request stream 
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// Define GET Method

app.get('/messages', (req,res) => {
	Message.find({}, (err,messages) => {
		res.send(messages);
	})
})

// Define POST Method
app.post('/messages', (req, res) = > {
	var message = new Message(req.body);
	message.save((err) => {
		if(err)
			sendStatus(500);
		res.sendStatus(200);
	})
})