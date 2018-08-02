const User = require("../models/user")
const msgs = "NOT IMPLEMENTED AS YET";
const Joi = require('joi');
const { sanitizeBody } = require('express-validator/filter');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');





exports.user_get_list = function (req,res,next) {
	User.find({},"firstname lastname email password fullname")
	.exec(function (err, user) {
		if (err) {console.log(err)}
			
			res.send({user})
	})
}



exports.user_create = function (req,res,next) {

	sanitizeBody('*').trim().escape();
    const schema = {
    	firstname: Joi.string().min(3).required(),
    	lastname: Joi.string().min(3).required(),
    	email: Joi.string().email(),
			password: Joi.string().regex(
				new RegExp('^[a-zA-Z0-9]{8,32}$'))
		}

		const {error, value} = Joi.validate(req.body,schema)
		if(error){
			
			switch(error.details[0].context.key){
				case 'firstname':
							res.status(400).send({
								error:"invalid firstname must be greater than 3 letters long"
							})
							break;
				case 'lastname':
						res.status(400).send({
							error: "invalid lastname must be greater than 3 letters long.."
						})
						break;
				case 'email':
				console.log(error)

					res.status(400).send({
						error:"you must provide a valid email address"
					})
				break;

				case 'password':
						console.log(error)
					res.status(400).send({
						error:
						`The password you provide failed to match the following rules 
						1. It must contain only the following character: lower case, upper case numeric 
						2. It must be at least 8 characters in length and not greater than 32 in length` 
					})
					break;
				default:
					console.log(error)
				res.status(400).send({
					error:`Invalid registration information`
				})
                break;
			}

			// return res.send("!!!!")
		}

  
        function saveUser(userObject, userModel){
		    const newUser = new userModel(userObject);
		    newUser.save((err)=>console.log("error from saving user",err))
        }



        const myPlaintextPassword = req.body.password;
        const saltRounds = 10
        const userData ={
		 firstname : req.body.firstname,
		 lastname : req.body.lastname,
         email : req.body.email,
         password:""
		}
        
            var salt = bcrypt.genSaltSync(saltRounds);
            var hash = bcrypt.hashSync(myPlaintextPassword, salt);
	        userData.password =  hash
        	saveUser(userData, User)
        	res.send("saved");


       

}


exports.user_delete = function (req, res, next) {
	res.send(msgs)
}

// Login and hash user password
exports.login = function (req, res ) {
	User.findOne({email:req.body.email})
	.select("firstname lastname password fullname")
	.exec(function (err, user) {
		// body...
		// console.log(user)
        // let  {password} = user;
		if (err) {
			console.log(err)
			return 
		}
		if(!user){
			console.log("user not found")
			return res.status(404).send({error:"User not found"})
		}



	bcrypt.compare(req.body.password, user.password, function(err,response){
	            if(err){console.log(err)}
				if(response){
					var myToken = jwt.sign({email:req.body.email}, 'passmaster')
					console.log(myToken)
					res.send({email:req.body.email,
						access_token:myToken,
						userId: user._id,
						fullname: user.fullname
					})
					// console.log(myToken)
					// console.log("this is login  ",req.session.user)
						}else{
					console.log("password does not match",err)
					res.status(401).send({error:'Incorrect password!'})
						}
					})

	})
}
// Return all posts created by a specific user
exports.user_posts = function(req, res){
	let {userid} = req.params;
	// Post
	Post.find({user:userid}, "title content comments user")
	.populate({
		path: 'user',
		select: 'firstname lastname email'
	})
	.exec(function(err, posts){
		res.send(posts)
	})

}
