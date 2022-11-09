const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    Username:String,
    Reasoning:String,
    Room:String,

})


const Bot = mongoose.model("Bot",reportSchema);

module.exports = Bot