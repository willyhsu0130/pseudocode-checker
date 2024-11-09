const express = require('express')
const router = express.Router()

router.get("/", (req, res) =>{
    res.send("User List")
})

router.get("/new", (req, res) =>{
    res.render("users/new", {firstName: "test"})
})

router.post("/", (req, res) =>{
    // same name as input
    const isValid = true;
    if (isValid){
        users.push
        res.redirect(`/`)
    }
    req.body.firstName;
    console.log(req.body.firstName)
    res.send("Hi")
})

router
    .route("/:id")
    .get((req, res) =>{
        console.log(req.user)
        res.send(`Get user with id of ${req.params.id}`)
    })
    .put((req, res) =>{
        res.send(`Update user with id of ${req.params.id}`)
    })
    .delete((req, res) =>{
        res.send(`Delete user with id of ${req.params.id}`)
    })

const users = [{name: "Kyle"}, {name: "Sally"}];
//param ask as middleware between a request and the actual response to the user
//allows us to get user
router.param("id", (req, res, next, id) =>{
    req.user = users[id];
    //goes to next peice of middleware.
    next();
})
module.exports = router