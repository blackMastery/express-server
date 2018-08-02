var express = require('express');
var router = express.Router();

router.get('/google',(req,res)=>{
    console.log("on route")
    res.send('you have the google route for google authentication')
})

module.exports = router;
