let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let blogSchema = mongoose.Schema({
	id: {type: uuid.v4()},
	title: {type: String},
	content: {type: String},
	author: {type: String},
	publishDate: {type: Date}
});

let Blog = mongoose.model('Blog', blogSchema);

let BlogList = {
	get: function()
	{
		return Blog.find()
			.then(blogs => {
				return blogs;
			})
			.catch(err => {
				throw Error(err);
			});
	},
	post: function(newBlog)
	{
		return Blog.create(newBlog)
			.then(blog => {
				return blog;
			})
			.catch(err => {
				throw Error(err);
			});
	},
	getByAuthor: function(Author)
	{
		return Blog.findByAuthor(Author)
			.then(blog => {
				return blog;
			})
			.catch(err => {
				throw Error(err);
			});
	}
}

module.exports = {BlogList};