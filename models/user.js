const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const UserSchema = new Schema({
	profilePicURL:{type:String, required:false},
	firstname: {type: String, required:true},
	lastname: {type: String, required:true},
	email: {type:String, required:true, unique: true},
	password: {type: String, required:true},
    date :{ type: Date, default: Date.now },
    post :[{type: Schema.ObjectId, ref: "Post"}]
	
})


UserSchema
.virtual("fullname")
.get(function () {
	return this.firstname + ' ' + this.lastname;
});


UserSchema
.virtual('url')
.get(function () {
	return '/user/' + this._id;
});



module.exports = mongoose.model("User", UserSchema)

