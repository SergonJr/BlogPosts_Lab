let express = require('express');
let morgan = require('morgan');
let bp = require('body-parser');
let uuid = require('uuid');
const path = require('path');

//To use mongoose
let mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
let {BlogList} = require('./blog-post-model');

let {DATABASE_URL, PORT} = require('./config');

mongoose.Promise = global.Promise;

let app = express();
let jsonParser = bp.json();
app.use(bp.urlencoded({extended: true}));

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(jsonParser);

function getByAuthor(Author)
{
	let aList = blogPosts.filter(function (Blog) {return Blog.author == Author});

	if (aList.length > 0)
	{
		console.log(aList);
		return aList;
	}
	else
	{
		return null;
	}
};

function getByID(ID)
{
	let aList = blogPosts.filter(function (Blog) {return Blog.id == ID});

	if (aList.length > 0)
	{
		console.log(aList);
		return aList;
	}
	else
	{
		return null;
	}
};

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
  	res.header(
    	"Access-Control-Allow-Headers",
    	"Origin, X-Requested-With, Content-Type, Accept, Authorization"
  	);
	
	if (req.method === "OPTIONS") 
	{
    	res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    	return res.status(200).json({});
 	}
  	next();
});

app.get('/api/blog-posts', (req, res, next) => {
	console.log("Req query", req.query);

	BlogList.get()
		.then(blogs => {
			return res.status(200).json(blogs);
		})
		.catch(error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status(500).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.get('/api/blog-post', (req, res, next) => {
	if (!req.query.author)
	{
		res.statusMessage = "Missing author parameter";
		return res.status(406).json({
			message: "Missing author parameter"
		});
	}

	let blogByAuthor = getByAuthor(req.query.author);

	if (!blogByAuthor)
	{
		res.statusMessage = "Blogs not found";
		return res.status(404).json({
			message: "Blogs not found"
		});
	}

	BlogList.getByID(req.query.id)
		.then(blogs => {
			return res.status(201).json(blogs);
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB";
			return res.status(500).json({
				message : "Something went wrong with the DB",
				status : 500
			});
		});
});

app.post('/api/blog-posts', (req, res, next) => {
	newBlog = req.body;
	console.log(req.body);
	if (!newBlog.title || !newBlog.content || !newBlog.author)
	{
		res.statusMessage = "Missing param(s)";
		return res.status(406).json({
			message: "Missing param(s)"
		});
	}

	newBlog.id = uuid.v4();
	newBlog.publishDate = new Date();

	BlogList.post(newBlog)
		.then(blog => {
			return res.status(201).json(blog);
		})
		.catch(err => {
			res.statusMessage = "Something went wrong with the DB";
			return res.status(500).json({
				message : "Something went wrong with the DB",
				status : 500
			});
		});
		
});

app.delete('/api/blog-posts/:id', (req, res, next) => {
	let remBlog = getByID(req.params.id);

	if (!remBlog)
	{
		res.statusMessage = "Blog not found";
		return res.status(404).json({
			message: "Blog not found"
		});
	}

	blogPosts = blogPosts.filter(function (Blog) { return Blog.id != req.params.id});

	return res.status(200);
});

app.put('/api/blog-posts/:id', jsonParser, (req, res, next) => {
	console.log("Req query", req.params);
	upBlog = req.body;

	if (!newBlog.id)
	{
		res.statusMessage = "Missing param(s)";
		return res.status(406).json({
			message: "Missing param(s)"
		});
	}

	if (req.params.id != upBlog.id)
	{
		res.statusMessage = "ID in param must match body ID";
		return res.status(409).json({
			message: "ID in param must match body ID"
		});
	}

	for (var i in blogPosts)
	{
		if (blogPosts[i].id == upBlog.id)
		{
			blogPosts[i].title = upBlog.title;
			blogPosts[i].content = upBlog.content;
			blogPosts[i].author = upBlog.author;
			blogPosts[i].publishDate = upBlog.publishDate;
			break;
		}
	}

	return res.status(202)
})

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					console.log(path.join(__dirname, 'views/index.html'));
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };
