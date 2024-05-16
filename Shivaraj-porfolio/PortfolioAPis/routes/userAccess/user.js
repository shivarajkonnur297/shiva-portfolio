const express = require('express');
const router = express.Router();
const userService = require('../../services/userAccess/user');


router
.post('/get',userService.get)
.post('/create',userService.validate(),userService.create)
.put('/update',userService.validate(),userService.update)
.post('/getForms',userService.getForms)
.post('/dashboard',userService.dashBoard)

module.exports = router;