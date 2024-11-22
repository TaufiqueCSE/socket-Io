import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  // Connect to the correct server
  const socket = useMemo(()=>io("http://localhost:4000"),[]);
  const [message,setMessage]=useState("")
  const [room,setRoom]=useState("")
  const [showMessage,setShowMessage]=useState([])
  const [socketID,setSocketID]=useState("")


  const handleSubmitForm=(e)=>{
    e.preventDefault();
    socket.emit("message",{message,room})
    setMessage("")
  }

  useEffect(() => {
    // Event: When connected to server
    socket.on("connect", () => {
      console.log("user connected: ", socket.id);
      setSocketID(socket.id)
    });

    // Event: Listen to 'welcome' message from server
    socket.on("welcome", (message) => {
      console.log(message);
    });
    
    socket.on("recieve-message",(message)=>{
      // console.log(message)
      console.log(showMessage)
      setShowMessage((prevMessages) => [...prevMessages, message]);
    })


    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Dependency array ensures this runs only once

  return <div style={{margin:"100px"}}>
    <h1>Learnign socket io</h1>
    <h4>socket id: {socketID}</h4>
    <form action="" onSubmit={handleSubmitForm}>
      <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="enter the message" />
      <input type="text" value={room} onChange={(e)=>setRoom(e.target.value)} placeholder="enter the room" />
      <button type="submit">Send</button>
    </form>
    <div>
      {
        showMessage?.map((item,index)=>(
          <h4 key={index}>{item}</h4>
        ))
      }
    </div>
  </div>;
};

export default App;
