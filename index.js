const express=require('express');
const path=require('path');
const port=process.env.PORT || 3000;
const app=express();
const server=app.listen(port,(req,res)=>{
    console.log('Server is running!');
});
const io=require('socket.io')(server);
const users=new Set();

app.use(express.static(path.join(__dirname,'public')));
io.on('connection',onConnect);

function onConnect(socket)
{
    users.add(socket.id);
    io.emit('clients-total',users.size);
    socket.on('disconnect',()=>{
        users.delete(socket.id);
    });
    socket.on('message',(data)=>{
        socket.broadcast.emit('message',data);
    });
}