const express = require('express');
const router = express.Router();
const roleService = require('../../services/userAccess/role');

router
.post('/get',roleService.get)
.post('/create',roleService.validate(),roleService.create)
.put('/update',roleService.validate(),roleService.update)


module.exports = router;