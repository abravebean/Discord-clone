const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const Bot = require('./models/bot.js')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
require('dotenv').config()
const methodOverride= require('method-override')
const 
{   userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,  } = require("./utils/user");
  
//static folder
app.use(express.static(path.join(__dirname, "public")));
//MIDDLEWARE 
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
//Chatter bot
const botName = 'Chatter Bot'    
//MONGOOSE
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
    useUNifiedTopology: true,
})

//INDEX
app.get('/report/',(req,res)=>{
 
  res.render('index.ejs')
})

//CREATE
app.post('/report/', (req, res) => {
  console.log(req.body)
  Bot.create(req.body,(error, createdReport) => {
    console.log(error)
    res.redirect("/report/")
})

    })

//UPDATE
app.put("/report/:id", (req, res) => {
  console.log(req.body)
   Bot.findByIdAndUpdate(
     req.params.id,
     req.body,
     {
       new: true,
     },
     (error, updatedProduct) => {
       res.redirect(`/report/${req.params.id}`)
     }
   )
 })

// Run when client connects
io.on("connection", (socket) => {
    console.log(" client connecting")
    socket.on("joinRoom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
socket.join(user.room);
  
// Welcome current user with message from chatterbot 
    socket.emit("message", formatMessage(botName, "Welcome to Discord!"));
  
// Broadcast when a user connects
     socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, `${user.username} has joined the chat`)
        );
  
// Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });
  
// Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      
      const user = getCurrentUser(socket.id);
        
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });
  
// Runs when client disconnects
    socket.on("disconnect", () => {
    const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });

  // Database Connection Logs
const db = mongoose.connection
db.on("error", (err) => console.log(err.message))
db.on("connected", () => console.log("mongo connected"))
db.on("disconnected", () => console.log("mongo disconnected"))
  
const PORT= 3000|| process.env.PORT;
//LISTENER
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));