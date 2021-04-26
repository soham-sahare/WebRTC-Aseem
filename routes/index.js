const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const mongoose = require("mongoose")

const Pusher = require("pusher");
const db = "mongodb+srv://sohamsahare:Soham@123@cluster0.jxslv.mongodb.net/daksh?retryWrites=true&w=majority"


const pusher = new Pusher({
    appId: "1189764",
    key: "1176fd9708941139f177",
    secret: "514dfc10fcf2ce089b02",
    cluster: "ap2",
    useTLS: true
});


// Login Page
router.get('/', forwardAuthenticated, (req, res) => res.redirect('users/login'));

// Dashboard
router.get('/index', ensureAuthenticated, (req, res) =>
    res.render('index', {
        user: req.user
    })
);

router.post('/poll', ensureAuthenticated, (req, res) => {
    res.render('poll')
});

// router.post('/poll', ensureAuthenticated, (req, res) => {
//     pusher.trigger("os-poll", "os-vote", {
//         points: 1,
//         os: req.body.os
//     });

//     return res.json({ success: true, message: "Thank You" })
// });

router.get('/poll/:pollID', (req, res) => {

    const PollSchema = mongoose.Schema({
        title: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        id: String
    });

    try {
        users = mongoose.model('Poll')
    } catch (error) {
        Poll = mongoose.model('Poll', PollSchema, 'pollres');
    }

    const m = new Poll();
    id = req.params['pollID']
    // res.send()

    data = Poll.findOne({ id: id }, function (err, poll) {
        // console.log(poll.title);

        res.render('submitpoll', {
            title: poll.title,
            option1: poll.option1,
            option2: poll.option2,
            option3: poll.option3,
            option4: poll.option4
        })

    });



    // console.log(data);
    // Poll.find({ PollID: id }, function (err, docs) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         console.log("First function call : ", docs);
    //     }
    // });

    // res.render('poll', {
    //     user: req.user
    // })
})

router.post('/poll/create', (req, res) => {



    const { title, option1, option2, option3, option4 } = req.body;

    const PollSchema = mongoose.Schema({
        title: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        id: String
    });

    try {
        users = mongoose.model('Poll')
    } catch (error) {
        Poll = mongoose.model('Poll', PollSchema, 'pollres');
    }


    function stringGen() {
        var text = "";
        var len = 10;
        var char_list =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < len; i++) {
            text += char_list.charAt(Math.floor(Math.random() * char_list.length));
        }
        return text;
    }

    var poll1 = new Poll({ title: title, option1: option1, option2: option2, option3: option3, option4: option4, id: stringGen() });

    // save model to database
    poll1.save(function (err, poll) {
        if (err) return console.error(err);
        res.send("Created Successfully")
    });
});

module.exports = router;