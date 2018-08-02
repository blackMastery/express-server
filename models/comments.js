const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const CommentSchema = new Schema({
	message:{type: String, required: true},
	postId:{type: Schema.ObjectId, ref:"Post", required: true},
	userId:{type: Schema.ObjectId, ref:"User", required: true},
    date :{ type: Date, default: Date.now },


});


CommentSchema
.virtual("url")
.get(function(){
	return '/comments/' + this._id;
});


module.exports = mongoose.model('Comment', CommentSchema)
