const async = require('async');
const Post = require('../models/Post');
const User = require('../models/user');
const Comments = require('../models/comments')
const Joi = require('joi');
const { sanitizeBody } = require('express-validator/filter');
const boom = require('boom');





exports.post_list = function (req, res, next) {
		console.log(req.headers)
		const {authorization} = req.headers;
		console.log(authorization)
	
	Post.find({}, "title content comments user")
	.populate({
		path:"comments",
		populate:{
			path: "userId",
			 select: "email firstname lastname date"
		}

	})
	.populate({
		path: 'user',
		select: 'firstname lastname email'
	})
	.exec(function (err, post) {
		if(err){
			console.log(err)
			next(boom.badRequest(err.message))

		}
		// console.log(post)
		res.send({post})

	})
}


exports.post_detail = function (req, res, next) {
	Post.findById(req.params.id, "title content")
	.populate({
		path:"comments",
		populate:{
			path: "userId",
			 select: "email firstname lastname date"
		}

	})
	.populate({
		path: 'user',
		select: 'firstname lastname email'
	})
    .exec(function (err, post) {
    	if (err) {
				console.log(err)
				res.status(404).json({
                message:"Not found"
              });
			}
			res.send({post})
		});





}


exports.create_post = function (req, res, next) {
		sanitizeBody('*').trim().escape();
		console.log(req.headers)
	const schema = {
		title: Joi.string().min(3).required(),
		content: Joi.string().min(3).required()
	};


    const {error, value} = Joi.validate(req.body,schema)

       switch(error.details[0].context.key){
       	case "title":
       			console.log(error)

       	case "content":
       			console.log(error)

       	default :
       			console.log("no errorsss")

       }

		const {title , content, userId } = req.body;

		const new_post = new Post({title, content, user:userId})


         let promisedPost = new_post.save();
         promisedPost.then((post)=>{
         	User.findById(userId)
         	.exec((err,user)=>{
         		if(err){
         			console.log(err)
         			return
         		} 
         		//updating user reference to posts 
         		user.post.push(new_post)
         		User.findByIdAndUpdate(userId,
         			{$set:{post:[...user.post]}},
         			(err, docs)=>{
         				if(err){
         					console.log(err)
         					return
         				}
         				res.send("post Saved")

         			})
         	})

         })



}




exports.post_delete = function (req, res, next ) {
	const { postid } = req.params;
	
	Post.findByIdAndRemove(postid)
	.then((p)=>{
		console.log(p)
		res.end(`${p.title} has been deleted...`)
	})
	.catch(err=>{
		console.log(err)
		res.status(404).json({
                message:err
              });
	})
	
	Comments.findByIdAndRemove(postid)
	.then(c=>console.log(c))
	.catch(err=>console.log(err))
	
	// res.send();
}
	







exports.post_update = function (req, res, next) {
	const {postid} = req.params;
	const {title,content} = req.body;
	Post.findOne({ _id: postid }, function (err, doc){
		if(err){
			res.status(403).json({
                message:`${title} post cant be found`
              });
		}
	  doc.title = title;
	  doc.content = content;
	  doc.save();
		res.end("Saved")
	});
}
