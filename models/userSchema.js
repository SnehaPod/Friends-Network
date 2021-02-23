const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true
    },
    follows: [
        {
            type: String,
        }
    ],
    followedBy: [
        {
            type: String,
        }
    ]
});

var userModel = mongoose.model('Users', userSchema);

module.exports = { userModel };