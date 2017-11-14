var express = require('express');
var router = express.Router();

router.get('/tasks', function(req,res,next){
    res.send('TASK PAGE');
})

module.exports = router;