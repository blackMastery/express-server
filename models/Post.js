const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const PostSchema = new Schema ({
	title: {type: String, required: true},
	content: {type: String, required: true },
	user:{type:Schema.ObjectId, ref:'User'},
	comments: [{type: Schema.ObjectId, ref:"Comment"}],
	date: {type:Date, default:Date.now}
})


PostSchema
.virtual('url')
.get(function(){
	return '/post/' + this._id;
})


module.exports = mongoose.model('Post', PostSchema)