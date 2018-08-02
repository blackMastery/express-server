const async = require("async");
const msgs = "not implemented as yet";
const Comment = require('../models/comments');
const Post = require('../models/Post');
const { sanitizeBody } = require('express-validator/filter');
const User = require("../models/user");
const boom = require('boom');

function boomErrorString(reason, error){
  return `Incorrent or ${reason} ${error} `
}


exports.comment_list = function (req,res,next) {
	   Comment.find({},"postId userId")
	   .populate("userId")
       .select('message')
       .exec(function (err,message) {
       			res.send({message})
       })


}



exports.comment_create = function (req, res, next) {
	sanitizeBody('*').trim().escape();
    // console.log(req)
    const {body} = req.body
	let commentData = {
		message: body.message,
		postId: body.postId,
		userId: body.userId,
	}
	// console.log(">>>>>>>>>>>>>", req.body.body)
    const newComment = new Comment(commentData);
    const promise = newComment.save();
	promise.then((comment)=>{
			// res.send(comment.message)
			Post.findById(body.postId)
			.exec((err , post)=>{
				if(err){
					// next(boom.badRequest(boomErrorString(err.reason, err.path)))
					// return
					// console.log(err)
				}
				post.comments.push(comment)

				Post.findByIdAndUpdate(body.postId,
					{$set: {comments: [...post.comments]}},
					(err, doc)=>{
						if(err){
							console.log(err)

						}
						// res.send("comment saved")
						// console.log(comment)
					}
				).populate({
					path:"comments",
					populate:{
						path: "userId",
						 select: "email firstname lastname date"
					}
					}).exec((err,docs)=>{
						if (!err) {
							console.log("MY DOCSSS",docs.comments,"my users",)
							res.send(docs.comments);
							res.end()

						}
					})





			})
	})
	.catch((err)=> {
		console.log(err)
		// console.log(Object.keys(err.errors))
    let error = new Error(err.message)
    error.httpStatusCode = 400;
    error.message = err.message;
    // next(error);
		// console.log(56,Object.keys(err), err.message, "path", err.path)
		// next(boom.badRequest(err.message,err.message))
	})
}



exports.get_comment = function (req, res, next) {

	 Comment.find({postId: req.params.id}, "message userId ")
		 .populate({
			 path: "userId",
			 select: "email firstname lastname date"
			})
		 .exec(function (err,message) {
			if(err){
				// console.log(err)
				// console.log(56,Object.keys(err), err.message, "path", err.path)

				next(boom.badRequest(boomErrorString(err.reason, err.path)))
				return
			}
			console.log("comments sent..")


			res.send({message})
		})
}


exports.comment_delete = function (req,res,next) {
	Comment.findOneAndRemove({_id: req.params.id},function (err) {
		if(err){
			next(boom.badRequest(boomErrorString(err.reason, err.path)))
		}
		res.send("comment deleted")


		// body...
	})

}
