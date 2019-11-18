let express = require('express');
let morgan = require('morgan');
let bp = require('body-parser');

//To use mongoose
let mongoose = require('mongoose');
let {BlogList} = require('./model');

let {DATABASE_URL, PORT} = require('./config');

mongoose.Promise = global.Promise;

let app = express();
let jsonParser = bp.json();

app.use(express.static('public'));
app.use(morgan('dev'));

const post = {
	id: uuid.v4(),
	title: string,
	content: string,
	author: string,
	publishDate: Date
};

let blogPosts = [
	{
		id: "1",
		title: "Im tired (Storytime)",
		content: "Pretty boring content",
		author: "Sergio Gonzalez",
		publishDate: new Date(2019, 11, 17, 8, 54, 30, 0);
	},
	{
		id: "2",
		title: "I want to play Witcher 3, but I forgot I had a lab",
		content: "This lab is from last week but I forgot to do it lol",
		author: "Sergio Gonzalez",
		publishDate: new Date(2019, 11, 17, 8, 55, 30, 0);
	},
	{
		id: "3",
		title: "I want vacations",
		content: "I have to play Pokémon Shield, The Outer Worlds and much more...",
		author: "Sergio Gonzalez",
		publishDate: new Date(2019, 11, 17, 8, 56, 23, 0);
	}
];


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

app.get('/api/blog-posts', (req, res, next) => {
	console.log("Req query", req.query);
	return res.status(200).json(blogPosts);

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

app.post('/api/blog-posts', jsonParser, (req, res, next) => {
	let {id, title, content, author, publishDate} = req.body;

	if (!newBlog.title || !newBlog.content || !newBlog.author || !newBlog.publishDate)
	{
		res.statusMessage = "Missing param(s)";
		return res.status(406).json({
			message: "Missing param(s)"
		});
	}

	let newBlog = {
		id, 
		title, 
		content, 
		author, 
		publishDate
	};

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
			message: "Blog not found";
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