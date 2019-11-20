$("#postForm").on("submit", function(e)
{
  e.preventDefault();

  let titleV = $("#title").val();
  let contentV = $("#content").val();
  let authorV = $("#author").val();

  let urlPost = '/api/blog-posts';

  let post = {
    "title": '"' + titleV + '"',
    "author": '"' + authorV + '"',
    "content": '"' + contentV + '"' }

  $.ajax({
    url: urlPost,
    method: 'POST',
    contentType: 'application/json',
    data: post,
    success: function (data, status)
  {
    console.log("Success");
    console.log(data);
    console.log(status);
  },
  error: function(xhr, desc, err)
  {
    console.log(xhr);
    console.log("Desc: " + desc + "\nErr: " + err);
    console.log(post);
  }
});
});
