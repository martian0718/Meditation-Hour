var mongoose = require("mongoose");

//SCHEMA SETUP
var meditationSchema = new mongoose.Schema({
    name: String,
    description: String,
    time: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
          }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Meditation", meditationSchema);