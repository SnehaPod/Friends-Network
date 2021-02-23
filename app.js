const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
const port = process.env.PORT || 8095;
var followFriend = require("./api/controller").followFriend;
var unfollowFriend = require("./api/controller").unfollowFriend;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

mongoose.connect(uri, { useNewUrlParser: true }, () => {
    console.log("Connected to DB");
})

// Route to create new friend connections
app.post('/api/friend/follow', followFriend)

// Route to unfriend connections
app.post('/api/friend/unfollow', unfollowFriend)

app.listen(port, () => {
    console.log("App listening on ", port);
})

module.exports = app;