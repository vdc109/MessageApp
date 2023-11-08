const express = require('express');
const app = express();
const router = express.Router();
const User = require('../models/User');
// const chatDB = require('../models/User');

const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    let { userName, email, password } = req.body;
    userName = userName.trim();
    email = email.trim();
    password = password.trim();

    if (userName == " " || email == " " || password == " "){
        res.json({
            status: "FAILED",
            message: "Empty input field/fields"
        })
    } else if (!/^[\w-\.]+@([\w]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password has to at least 8 characters"
        })
    } else {
        User.find({userName}).then(result => {
            if (result.length) {
                res.json ({
                    status: "FAILED",
                    message: "Username already exists!"
                })
            }
            else {
                User.find({email}).then(result => {
                    if (result.length) {
                        res.json({
                            status: "FAILED",
                            message: "User with the provided email already exists"
                        })
                    } else {
                        const Rounds = 10;
                        bcrypt.hash(password, Rounds).then(hashedPassword => {
                            const newUser = new User ({
                                userName,
                                email, 
                                password: hashedPassword,
                                friends: [],
                                requests: [],
                                receive: [],
                                chatDB: []
                            })
        
                            newUser.save().then(result => {
                                res.json ({
                                    status: "SUCCESS",
                                    message: "Signup Successful",
                                    data: result
                                })
                            }).catch (e => {
                                res.json ({
                                    status: "FAILED",
                                    message: "An error occured while saving the user's account! "
                                })
                            })
                        }) .catch(e => {
                            res.json ({
                                status: "FAILED",
                                message: "A problem occured while hashing password!"
                            })
                        }) 
                    }
                }).catch(e =>{
                    console.log(e);
                    res.json({
                        status: "FAILED",
                        message: "Error occured when checking for existing user!"
                    })
                })
            }
        }).catch(e => {
            console.log(e);
            res.json({
                status: "FAILED",
                message: "Error occured while checking for existing username!"
            })
        })
    }
})

router.post('/signin', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == " " || password == " ") {
        res.json({
            status: "FAILED",
            message: "Empty credentials entered"
        })
    } else {
        User.find({email}).then (data => {
            if (data.length) {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        res.json({
                            status: "SUCCESS",
                            message: "Signin successful",
                            data: data
                        })
                    } else {
                        res.json ({
                            status: "FAILED",
                            message: "Invalid password entered!"
                        })
                    }
                }). catch(e => {
                    console.log(e);
                    res.json ({
                        status: "FAILED",
                        message: "An error occurred while comparing passwords"
                    })
                })
            }
            else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered"
                })
            }
        }).catch(e => {
            console.log(e);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user"
            })
        })
    }
})

router.post('/send/:id/:id2', (req, res) => {
    fetch_sender = req.params.id;
    fetchid_receiver = req.params.id2;

    if (fetch_sender == fetchid_receiver) {
        res.json({
            status: "FAILED",
            message: "Cannot send request to yourself",
        })
    }
    else {
        User.find({_id: fetch_sender, requests: {_id: fetchid_receiver}}) .then(data => {
            if (data.length) {
                res.json({
                    status: "FAILED",
                    message: "Request already sent"
                })
            } else {
                User.findOneAndUpdate({_id: fetch_sender}, {$push: {requests: {_id: fetchid_receiver}}}). then (data => {
                    User.findOneAndUpdate({_id: fetchid_receiver}, {$push: {receive: {_id: fetch_sender}}}). then (data => {
                        res.json ({
                            status: "SUCCESS",
                            message: "Request sent / Request received"
                        })
                    })
                })
            }
        })
    }
})

router.post('/chat/:id/:id2' , (req, res) => {
    sender = req.params.id;
    receiver = req.params.id2;
    let {from, to, value, time} = req.body;
    from = from.trim();
    to = to.trim();
    value = value.trim();
    time = time.trim();
    
    if (!from || !to || !value) {
        res.json({
            status: "FAILED",
            message: "Chat error"
        })
    } else {
        User.findOneAndUpdate({_id: sender}, {$push: {chatDB: {"from": from, "to": to, "value": value, "time": time}}}). then (data => {
            User.findOneAndUpdate({_id: receiver}, {$push: {chatDB: {"from": from, "to": to, "value": value, "time": time}}}). then (data => {
                
            })  
        })
    }

    User.find({"_id": sender}). then(data_sen => {
        User.find({"_id": receiver}). then(data_rec => {
            res.json({
                status: "SUCCESS",
                message: "Chatting",
                sender: data_sen,
                receiver: data_rec                
            })
        })
    })
})

router.post('/delete/:id', (req, res) => {
    fetchid = req.params.id;
    User.findOneAndDelete({_id: fetchid}). then(data => {
        res.json({
            status: "SUCCESS",
            message: "Data delete successful",
            data: data
        })
    })
})

router.post('/accept/:id/:id2', (req, res) => {
    receive = req.params.id;
    request = req.params.id2;

    User.find({_id: request, friends: {_id: receive}}). then(data => {
        if (data.length) {
            User.findOneAndUpdate({_id: request}, {$pull: {requests: {_id: receive}}}). then(data => {
                User.findOneAndUpdate({_id: receive}, {$pull: {receive: {_id: request}}}). then(data2 => {
                })
            });

            res.json ({
                status: "FAILED",
                message: "Already friend",
                data: data
            })
        } else {
            User.find({_id: receive, friends: {_id: request}}). then(data2 => {
                if (data.length) {
                    User.findOneAndUpdate({_id: request}, {$pull: {requests: {_id: receive}}}). then(data => {
                        User.findOneAndUpdate({_id: receive}, {$pull: {receive: {_id: request}}}). then(data2 => {
                        })
                    });

                    res.json ({
                        status: "FAILED",
                        message: "Already friend",
                        data: data2
                    })
                }
                else {
                    User.findOneAndUpdate({_id: request}, {$pull: {requests: {_id: receive}}}). then(data => {
                        User.findOneAndUpdate({_id: receive}, {$pull: {receive: {_id: request}}}). then(data2 => {
                            User.findOneAndUpdate({_id: request}, {$push: {friends: {_id: receive, text: []}}}). then(data3 => {
                                User.findOneAndUpdate({_id: receive}, {$push: {friends: {_id: request, text: []}}}). then(data4 => {
                                })
                            })
                        })
                    });
        
                    User.find({_id: receive}). then(data_rec => {
                        User.find({_id: request}) .then(data_req => {
                            res.json({
                                status: "SUCCESS",
                                message: "Accept Success",
                                receiver: data_rec,
                                requester: data_req
                            })
                        })
                    })
                }
            })
        }
    })
})

router.post('/decline/:id/:id2', (req, res) => {
    receive = req.params.id;
    request = req.params.id2;
    
    User.findOneAndUpdate({_id: request}, {$pull: {requests: {_id: receive}}}). then(data => {
        User.findOneAndUpdate({_id: receive}, {$pull: {receive: {_id: request}}}). then(data2 => {
        })
    });

    User.find({_id: receive}). then(data_rec => {
        User.find({_id: request}) .then(data_req => {
            res.json({
                status: "SUCCESS",
                message: "Decline Success",
                receiver: data_rec,
                requester: data_req
            })
        })
    })
})

router.get('/realtimefetch/:id', (req, res) => {
    fetchid = req.params.id;
    setInterval(function() {
        var data = User.find({_id: fetchid});
        res.json({
            data: data
        })
        res.end();
    }, 1000);
})

router.get('/fetch/:id', (req, res) => {
    fetchid = req.params.id;
    User.find({_id: fetchid}).then (data => {
        if (data.length) {
            res.json({
                status: "SUCCESS",
                message: "Data fetched",
                data: data
            })
        }
        else {
            res.json({
                status: "FAILED",
                message: "Data fetch failure"
            })
        }
    })
})

// router.get('/message/:id', (req, res) => {
//     sender = req.params.id;

//     User.find({_id: sender}). then(data1 => {
//         res.json({
//             data: data1
//         })
//     })
// })

router.get('/search/:name', (req, res) => {
    fetchid = req.params.name;
    User.find({userName: fetchid}).then (data => {
        if (data.length) {
            res.json({
                status: "SUCCESS",
                message: "Searched data fetched",
                data: data
            })
        }
        else {
            res.json({
                status: "FAILED",
                message: "No data found"
            })
        }
    })
})

module.exports = router;