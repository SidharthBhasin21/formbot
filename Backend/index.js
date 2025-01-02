const express = require('express');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv').config();
const cors = require("cors");


const userRouter = require('./routes/userRouter')
const formRouter = require('./routes/formRouter')
const folderRouter = require('./routes/folderRouter')
const dashboardRouter = require('./routes/dashboardRouter')

db()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.use('/auth', userRouter)
app.use('/form', formRouter)
app.use('/folder', folderRouter)
app.use('/dashboard', dashboardRouter)


app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
})