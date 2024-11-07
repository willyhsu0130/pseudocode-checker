const express = require('express')
const router = express.Router()

router.get("/", (req, res) =>{
    res.send("Checker")
})

router.post("/", (req, res) =>{
    res.send("Check code")
})

module.exports = router