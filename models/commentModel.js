var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
    commentBody: {
        type: String,
    }
});

var Comment = mongoose.model("Comment", CommentsSchema);

module.exports = Comment;