var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NewsSchema = new Schema({
    newsTitle: {
        type: String,
    },
    newsLink: {
        type: String,
    }
});

var News = mongoose.model("News", NewsSchema);

module.exports = News;