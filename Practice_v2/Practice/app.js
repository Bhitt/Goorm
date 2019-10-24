var express     = require("express"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    Dog         = require("./models/dog"),
	mtg         = require('mtgsdk'),
    app         = express();


var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(bodyParser.urlencoded({extended: true}));


//makes database 
mongoose.connect("mongodb://localhost/DogPark", { useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine","ejs");

app.get("/", function(req,res){
	res.render("index");
});

app.get("/register", function(req,res){
	res.render("register");
});

app.get("/landing", function(req, res){
	res.render("landing");
});

app.get("/adopt", function(req,res){
	res.render("adopt");
});

app.post("/adopt", function(req, res){
	Dog.create(req.body.dog,function(err,newDog){
		if(err){
			console.log(err);
			res.redirect("/");
		}else{
			//console.log(newDog);
			res.redirect("/");
		}
	});
});

app.get("/show", function(req,res){
	//Get all dogs from db
    Dog.find({}, function(err, allDogs){
        if(err){
            console.log(err);
        }else{
            res.render("show", {dogs: allDogs});
        }
    });
});

app.get("/chat", function(req,res){
	//show chat
	res.render("chat");
});

// testing display of cards
app.get("/testCollection", function(req,res){
	var multiverseids = ["473131","473132","473133","473134","473135"];
	res.render("testCollection", {ids:multiverseids});
});

// input page to search for a card
app.get("/searchCard", function(req,res){
	res.render("searchCard");
});

//post request to query card
app.post("/search", function(req,res){
	var q = '';
	q = req.body.cardName;
	mtg.card.where({ name: q})
	.then(cards => {
		//console.log(cards);
		res.render("showCard", {cards: cards});
	})
});
	

app.get("*", function(req,res){
	res.redirect("/");
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
		console.log('user disconnected');
	  });
});

server.listen(3000, function(){
	console.log("The server is listening on port 3000");
});
