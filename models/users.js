var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

var UserSchema = new mongoose.Schema(
{
	username: {type: String, unique: true},
	banner: 
	{
		text: String,
		backgroundCol: String,
		textCol: String,
		borderCol: String,
		sprite: String,
		hover: String


	},
	misc:
	{
		threads: [String],
		posts: [String],
		avatar: String,
		postCount: Number,
		joinDate: String,
		badges: [String],
		signature: String,
		rank: String,
		about: String
	},
	hash: String,
	salt: String
});

UserSchema.methods.setPassword = function(password)
{
	this.salt = crypto.randomBytes(16).toString("hex");

	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex");
}

UserSchema.methods.validPassword = function(password)
{
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex");

	return this.hash === hash;
}

UserSchema.methods.generateJWT = function()
{
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 1);

	console.log(exp);

	return jwt.sign(
	{
		_id: this._id,
		username: this.username,
		exp: parseInt(exp.getTime() / 1000),
	}, process.env.SECRET);
}


mongoose.model("User", UserSchema);