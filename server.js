const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const passport = require("passport")
const flash = require("connect-flash")
const session = require("express-session")
const fs = require('fs'); //file read-write
fs.writeFile('attendance.txt', '', 'utf8', (err) => { }); //to clear the files initially
fs.writeFile('duration.txt', '', 'utf8', (err) => { });
//var mongodb = require('mongodb');

const cors = require('cors')
const bodyParser = require("body-parser")

var num = 0
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

let http = require("http").Server(app)
const port = process.env.PORT || 3000
let io = require("socket.io")(http)

app.use(express.static("public"))

app.get('/attendance.txt', function (req, res) {
    res.download(__dirname + '/attendance.txt', 'attendance.txt');
})

app.get('/duration.txt', function (req, res) {
    res.download(__dirname + '/duration.txt', 'duration.txt');
})

const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users")
const formatMessage = require("./utils/messages.js")

const dotenv = require("dotenv")
dotenv.config()

// Passport Config
require("./config/passport")(passport)

// DB Config
//const db = process.env.DB_CONNECT
const db = "mongodb+srv://sohamsahare:Soham@123@cluster0.jxslv.mongodb.net/daksh?retryWrites=true&w=majority"

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

// EJS
app.use(expressLayouts)
app.set("view engine", "ejs")

// Express body parser
app.use(express.urlencoded({ extended: true }))

// Express session
app.use(
    session({ secret: "secret", resave: true, saveUninitialized: true })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
})

// Routes
app.use("/", require("./routes/index.js"))
app.use("/users", require("./routes/users.js"))

// io Connections
io.on("connection", (socket) => {

    // socket.on("joinRoom", ({ username, room_name }) => {
    //     // const user = userJoin(socket.id, username, room_name)
    //     // socket.join(user.room)
    //     if(num!=0)
    //     {
    //         const usernow = getCurrentUser(socket.id)
    //         io.to(usernow.room).emit("roomUsers", {
    //             room: usernow.room,
    //             users: getRoomUsers(usernew.room)
    //         })

    //         socket.emit("message", formatMessage("WebRTC BOT", 'Welcome!'))

    //         console.log("-----CLIENT CONNECTED: " + socket.id + " TO ROOM: " + room_name)
    //     }
    // })


    if (num != 0) {
        io.to(usernew.room).emit("roomUsers", {
            room: usernew.room,
            users: getRoomUsers(usernew.room)
        })

    }


    socket.on("request_call", ({ username, room_name }) => {
        const user = userJoin(socket.id, username, room_name)
        usernew = user
        socket.join(user.room)

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })

        socket.emit("message", formatMessage("WebRTC BOT", 'Welcome!'))

        console.log("-----CLIENT CONNECTED: " + socket.id + " TO ROOM: " + room_name)
        if (num != 0) {
            console.log("-----REQUESTING: " + socket.id)
            socket.to(user.room).emit("request_call", socket.id)
        }
        num++

        ////////////////////////////////////////.................................
        // const usernew = getCurrentUser(socket.id)

        // if(num!=0)
        // {   
        //     console.log("-----REQUESTING: "+ socket.id)
        //     socket.to(usernew.room).emit("request_call", socket.id)
        // }
        // console.log(num)
        // num++
        // chalja_pls()

    })

    //     socket.on("request_call", () => {
    //        //function chalja_pls(){
    //         const user = getCurrentUser(socket.id)


    //         // if(num!=0)
    //         // {   
    //             console.log("-----REQUESTING: "+ socket.id)
    //             socket.to(user.room).emit("request_call", socket.id)
    //         // }
    //         // console.log(num)
    //         // num++

    //    // }
    //     })

    socket.on("response_call", (id) => {
        console.log(socket.id + " -----RESPONSING----- " + id)
        socket.to(id).emit("response_call", socket.id)
    })

    socket.on("offer", (id, offer) => {
        console.log(socket.id + " -----OFFERING----- " + id)
        socket.to(id).emit("offer", socket.id, offer)
    })

    socket.on("answer", (id, answer) => {
        console.log(socket.id + " -----ANSWERING----- " + id)
        socket.to(id).emit("answer", socket.id, answer)
    })

    socket.on("ice", (id, ice) => {
        console.log(socket.id + " -----ICING----- " + id)
        socket.to(id).emit("ice", socket.id, ice)
    })

    socket.on("chatMessage", msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    })

    socket.on("disconnect", () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit("delete", {
                id: socket.id,
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }

        console.log("-----CLIENT DISCONNECTED: " + socket.id)
    })

    socket.on("attendance", (attendance, room_name) => {
        fs.writeFile(`attendance.txt`, attendance, 'utf8', (err) => { });
    })

    //get duration of time class was attended by each student
    socket.on("att_duration", (attendance, room_name, participantCount) => {
        fs.writeFile('duration.txt', '', 'utf8', (err) => { });
        lines = []
        console.log(attendance)
        lines = attendance.split('\n');
        console.log(lines.length + 'is len')
        let diff = 0
        let done = [];

        for (i = 0; i < (lines.length - 1) / 2; i++) {

            name = lines[i].split(' ').slice(0, 2).join(' ');
            if (done.includes(name)) {
                console.log(name)
                continue;
            }
            done.push(name);
            name_rev = lines[i].split(' ').reverse()
            //console.log(name_rev)
            time = name_rev.slice(0, 9).reverse().join(' ');
            //console.log(lines[i])
            //console.log(time)
            time_f1 = Date.parse(time);
            console.log(time_f1)
            for (j = i + 1; j < lines.length - 1; j++) {
                console.log(lines[j] + ' ' + j + 'is j')
                if (lines[j].split(' ').slice(0, 2).join(' ') == name) {

                    name_revj = lines[j].split(' ').reverse()
                    //console.log(name_rev)
                    timej = name_revj.slice(0, 9).reverse().join(' ');

                    //timej = lines[i].split(' ').slice(0,9).join(' ');
                    console.log('found')
                    time_f2 = Date.parse(timej);
                    console.log(time_f2)
                    diff = (time_f2 - time_f1) / (1000 * 60)
                }
            }
            fs.appendFile(`duration.txt`, name + " time duration attended: " + diff + ' minutes\n', 'utf8', (err) => { });
            //console.log(diff)
        }

    })
})

// Start Server
http.listen(port, () => {
    console.log("Listening on Port:", port)
    console.log("http://localhost:3000 \n")
})