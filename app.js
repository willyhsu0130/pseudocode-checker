// How to start server: npm run devStart

const express = require('express');
const app = express()


app.use(express.static("public"))
app.use(express.urlencoded({ extended: true}))

app.set('view engine', 'ejs');

// routes can accept a function that runs when that route is run



// user routes
const userRouter = require('./routes/users')
const checkerRouter = require('./routes/checker')
app.use("/users", userRouter)
app.use("/checke", checkerRouter)

function logger(req, res, next){
    console.log(req.originalUrl)
    next();
}
app.listen(3000);