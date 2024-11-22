import express from "express"
import {createServer} from "http";
import { Server } from "socket.io";
import cors from 'cors'

const app=express();
const port=4000;

const server=createServer(app)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
});

app.use(cors({origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true}))

app.get('/',(req,res)=>{
    res.send("hello")
})

io.on('connection',(socket)=>{
    console.log("user connected",socket.id);

    socket.on('message',({message,room})=>{
        console.log(message)
        // socket.emit("recieve-message",message)   //ye sirf usi jayega jo meessag esend kr rha socket means sief single user ko
        // io.emit("recieve-message",message)   //isse sab ko jayega message
        // socket.broadcast.emit("recieve-message",message)
        socket.to(room).emit("recieve-message",message)      //io.to se bhi kaam ho jayega but socket.to goof
    })

    socket.on('disconnect',()=>{
        console.log("user disconnected",socket.id)
    })

    // same name the evenet ka to bhi kaam kr raha he okay 
    // socket.emit("welcome",`welcome dosto to the server ${socket.id}`)  //isse sirf jo socket he usko hi jayega message or kisi ko ni
    // socket.broadcast.emit("welcome",`${socket.id} joined the server`)   //jo sockete he abhi usko chhodkar baaki ko jayega
    
})

server.listen(port,()=>{
    console.log(`port connected on ${port}`)
})


