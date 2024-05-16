const express = require('express');
const router = express.Router();
const ContactForm = require('../../services/FormsApis/ContactForm');

router
.post('/get',ContactForm.get)
.post('/create',ContactForm.validate(),ContactForm.create)
.put('/update',ContactForm.validate(),ContactForm.update)


module.exports = router;