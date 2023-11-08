require('./config/db')
const app = require('express')();
const http = require('http');
const socketIo = require('socket.io');
// const {createAdapter} = require('@socket.io/mongo-adapter');
const cors = require('cors')
app.use(cors({
    origin: "*"
}));

const server = http.createServer(app);
const io = socketIo(server);
const stream = require('./models/User');

const port = 3000;

const bodyParser = require('express').json;

app.use(bodyParser());

const UserRouter = require('./api/User')

app.use('/user', UserRouter);


const { emit } = require('process');

server.listen(port, () => {
    console.log(`Port: ${port}`)
    stream.watch().on("change", data => {
        console.log(data)
    })        
}) 