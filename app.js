// How to start server: npm run devStart

const express = require('express');
const app = express()

app.set('view engine', 'ejs')


app.get('/', (req, res) =>{
    res.render("index", {text: "World"})
} )

app.post('/', (req, res) =>{
    res.
})

// user routes
const userRouter = require('./routes/users')
const checkerRouter = require('./routes/checker')
app.use("/users", userRouter)
app.use("/checke", checkerRouter)

app.listen(3000);