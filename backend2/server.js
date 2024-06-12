import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import { initData, onMessage } from './src/wsConnect.js';
//deploy
import path from "path";
//import express from "express";
import cors from "cors";

const app = express()                               //create app middleware
const server = http.createServer(app)               //use http protocol to create server
const wss = new WebSocketServer({server}) 

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
      res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
}

wss.on('connection', (ws)=>{
    //web socket connection logic
    ws.box = ''; //record active ChatBox name
   initData(ws); //init data in the very beginning
    ws.onmessage = (e)=>{onMessage(wss, ws, e);}
});
  

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV === "development") {
    app.use(cors());
   }
server.listen(PORT, ()=>{console.log("Server listening on port" + PORT + "!")});