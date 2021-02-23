const async = require("async");
var userModel = require("../models/userSchema").userModel;

function followFriend(req, res) {
    if (req.body && req.body.friends) {
        var friends = req.body.friends;
        async.eachSeries(friends, async (el) => {
            try {
                const user = await userModel.findOne({ user: Object.keys(el)[0] });
                if (user) {
                    if (user.follows.indexOf(Object.values(el)[0]) == -1) {
                        user.follows.push(Object.values(el)[0]);
                    }
                    await user.save();
                } else {
                    var payload = {
                        user: Object.keys(el)[0],
                        follows: [Object.values(el)[0]],
                        followedBy: []
                    };
                    const newUser = await userModel.create(payload);
                }

                const followedUser = await userModel.findOne({ user: Object.values(el)[0] });
                if (followedUser) {
                    if (followedUser.followedBy.indexOf(Object.keys(el)[0]) == -1) {
                        followedUser.followedBy.push(Object.keys(el)[0]);
                    }
                    await followedUser.save();
                } else {
                    var payload = {
                        user: Object.values(el)[0],
                        follows: [],
                        followedBy: [Object.keys(el)[0]]
                    };
                    const newUser = await userModel.create(payload);
                }
                Promise.resolve();
            }

            catch (err) {
                Promise.reject(err);
            }

        }, function () {
            getConnections().then(results => {
                res.json({
                    message: 'User connections updated successfully',
                    friends: results
                })
            })
                .catch(err => {
                    res.json({
                        message: "Error fetching users",
                        err: err
                    })
                })
        })



    } else {
        res.json({
            message: "Empty request payload"
        })
    }
}

function unfollowFriend(req, res) {
    if (req.body && req.body.friends) {
        var friends = req.body.friends;
        async.eachSeries(friends, async (el) => {
            try {
                const user = await userModel.findOne({ user: Object.keys(el)[0] });
                if (user) {
                    if (user.follows.indexOf(Object.values(el)[0]) !== -1) {
                        user.follows.splice(Object.values(el)[0], 1);
                    }
                    await user.save();
                } else {
                    var payload = {
                        user: Object.keys(el)[0],
                        follows: [Object.values(el)[0]],
                        followedBy: []
                    };
                    const newUser = await userModel.create(payload);
                }

                const followedUser = await userModel.findOne({ user: Object.values(el)[0] });
                if (followedUser) {
                    if (followedUser.followedBy.indexOf(Object.keys(el)[0]) !== -1) {
                        followedUser.followedBy.splice(Object.keys(el)[0], 1);
                    }
                    await followedUser.save();
                } else {
                    var payload = {
                        user: Object.values(el)[0],
                        follows: [],
                        followedBy: [Object.keys(el)[0]]
                    };
                    const newUser = await userModel.create(payload);
                }
                Promise.resolve();
            }

            catch (err) {
                Promise.reject(err);
            }

        }, function () {
            getConnections().then(results => {
                res.json({
                    message: 'User connections updated successfully',
                    friends: results
                })
            })
                .catch(err => {
                    res.json({
                        message: "Error fetching users",
                        err: err
                    })
                })
        })


    } else {
        res.json({
            message: "Empty request payload"
        })
    }
}

function getConnections() {
    return new Promise((resolve, reject) => {
        var output = {};
        userModel.find({}).then(users => {
            users.forEach(el => {
                output[el['user']] = {
                    follow: el.follows,
                    followedBy: el.followedBy
                }
            })
            resolve(output)
        })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = {
    followFriend,
    unfollowFriend
}