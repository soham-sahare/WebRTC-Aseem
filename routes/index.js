const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const mongoose = require("mongoose")
var http = require('http');
var url = require('url');

const db = "mongodb+srv://sohamsahare:Soham@123@cluster0.jxslv.mongodb.net/daksh?retryWrites=true&w=majority"

// Login Page
router.get('/', forwardAuthenticated, (req, res) => res.redirect('users/login'));

// Dashboard
router.get('/index', ensureAuthenticated, (req, res) =>
    res.render('index', {
        user: req.user
    })
);

router.get('/poll/:user', ensureAuthenticated, (req, res) => {

    const PollSchema = mongoose.Schema({
        title: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        choice: String,
        userID: String,
        id: String
    });

    try {
        users = mongoose.model('Poll')
    } catch (error) {
        Poll = mongoose.model('Poll', PollSchema, 'pollres');
    }

    const m = new Poll();
    id = req.params['user']
    // res.send()

    data = Poll.find({ userID: id }, function (err, poll) {
        // console.log(poll.title);

        // console.log(poll);
        var hostname = req.headers.host; // hostname = 'localhost:8080'
        var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'
        link = 'http://' + hostname


        res.render("mypolls", {
            userID: id,
            all_polls: poll,
            link: link
        })

    });

});

router.get('/poll/create/:id', ensureAuthenticated, (req, res) => {
    id = req.params['id']
    // console.log(id);
    res.render('createPoll', {
        userID: id
    })
});

router.get('/poll/delete/:id', ensureAuthenticated, (req, res) => {
    id = req.params['id']

    const PollSchema = mongoose.Schema({
        title: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        choice: String,
        userID: String,
        id: String
    });

    try {
        users = mongoose.model('Poll')
    } catch (error) {
        Poll = mongoose.model('Poll', PollSchema, 'pollres');
    }
    // console.log(id);
    Poll.deleteOne({ id: id }, function (err) {
        if (err) return handleError(err);
        // data = Poll.find({ userID: id }, function (err, poll) {
        //     // console.log(poll.title);

        //     // console.log(poll);
        //     var hostname = req.headers.host; // hostname = 'localhost:8080'
        //     var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'
        //     link = 'http://' + hostname

        direct = "/poll/" + req.user.userID
        // console.log(direct);

        res.redirect(direct)

        // });
    });
});

router.get('/poll/submit/:id', ensureAuthenticated, (req, res) => {
    id = req.params['id']

    const PollSchema = mongoose.Schema({
        title: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        choice: String,
        userID: String,
        id: String
    });

    try {
        Poll = mongoose.model('Poll')
    } catch (error) {
        Poll = mongoose.model('Poll', PollSchema, 'pollres');
    }

    const PollAnsSchema = mongoose.Schema({
        pollID: String,
        chosen: String,
        correct: String,
        submitterID: String,
        submittedBy: String
    });

    try {
        Pollans = mongoose.model('PollAns')
    } catch (error) {
        Pollans = mongoose.model('PollAns', PollAnsSchema, 'poll_answers');
    }

    const m = new Poll();

    // res.send()

    data = Poll.findOne({ id: id }, function (err, poll) {
        // console.log(poll.title);

        // console.log(poll);
        // console.log(id);
        Pollans.findOne({ submitterID: req.user.userID, pollID: id }, function (err, ans) {

            if (ans) {
                allowed = "no"
            }
            else {
                allowed = "yes"
            }

            res.render("submitpoll", {
                myID: req.user,
                event: poll,
                allowed: allowed
            })
        })


    });

    // console.log(id);
    // res.render('submitpoll', {
    //     id: id
    // })
});

router.post('/poll/vote/:id', ensureAuthenticated, (req, res) => {

    id = req.params['id']

    const { userchosen } = req.body;
    submiter = req.user.name

    console.log(userchosen);

    // my = "POLL: " + id + " COrrect ans: " + userchosen + "  submitter: " + submiter
    // res.send(my)

    const PollAnsSchema = mongoose.Schema({
        pollID: String,
        chosen: String,
        correct: String,
        submitterID: String,
        submittedBy: String
    });

    try {
        Pollans = mongoose.model('PollAns')
    } catch (error) {
        Pollans = mongoose.model('PollAns', PollAnsSchema, 'poll_answers');
    }

    const PollSchema = mongoose.Schema({
        title: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        choice: String,
        userID: String,
        id: String
    });

    try {
        Poll = mongoose.model('Poll')
    } catch (error) {
        Poll = mongoose.model('Poll', PollSchema, 'pollres');
    }

    data = Poll.findOne({ id: id }, function (err, poll) {

        // const { userchosen } = req.body;

        // console.log(poll.title);

        // console.log(poll);
        // console.log(id);

        var poll1 = new Pollans({
            pollID: id,
            chosen: userchosen,
            correct: poll.choice,
            submitterID: req.user.userID,
            submittedBy: submiter
        });

        // save model to database
        poll1.save(function (err, poll) {
            if (err) return console.error(err);
            direct = "/poll/submit/" + id
            // console.log(direct);

            res.redirect(direct)
            // res.redirect()
        });

    });



});

router.get('/poll/view/:id', ensureAuthenticated, (req, res) => {

    id = req.params['id']

    const PollSchema = mongoose.Schema({
        title: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        choice: String,
        userID: String,
        id: String
    });

    try {
        Poll = mongoose.model('Poll')
    } catch (error) {
        Poll = mongoose.model('Poll', PollSchema, 'pollres');
    }

    const PollAnsSchema = mongoose.Schema({
        pollID: String,
        chosen: String,
        correct: String,
        submitterID: String,
        submittedBy: String
    });

    try {
        Pollans = mongoose.model('PollAns')
    } catch (error) {
        Pollans = mongoose.model('PollAns', PollAnsSchema, 'poll_answers');
    }

    const m = new Poll();

    // res.send()

    data = Poll.findOne({ id: id }, function (err, poll) {
        // console.log(poll.title);

        // console.log(poll);
        // console.log(id);
        Pollans.find({ pollID: id }, function (err, ans) {


            res.render("viewpoll", {
                myID: req.user,
                event: poll,
                submitions: ans
            })
        })


    });

    // m = "ID OF POLL: " + id
    // res.send(m)

});

router.post('/poll/create/:userid', ensureAuthenticated, (req, res) => {

    userid = req.params['userid']

    const { title, option1, option2, option3, option4, poll } = req.body;

    // console.log(poll);

    const PollSchema = mongoose.Schema({
        title: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        choice: String,
        userID: String,
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
        var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++) {
            text += char_list.charAt(Math.floor(Math.random() * char_list.length));
        }
        return text;
    }

    var poll1 = new Poll({
        title: title,
        option1: option1,
        option2: option2,
        option3: option3,
        option4: option4,
        choice: poll,
        userID: userid,
        id: stringGen()
    });

    // save model to database
    poll1.save(function (err, poll) {
        if (err) return console.error(err);
        direct = "/poll/" + req.user.userID
        // console.log(direct);

        res.redirect(direct)
        // res.redirect()
    });

    // console.log(id);
    // res.render('createPoll', {
    //     userID: userid
    // })
});

module.exports = router;