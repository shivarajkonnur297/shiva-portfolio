const express = require("express");
const router = express.Router();
var globalService = require("../services/global");
router

  // .all("*", globalService.checkAuthorization)
  // .use("/api", globalService.checkToken)

  .use("/api/form", require("./userAccess/form"))
  .use("/api/role", require("./userAccess/role"))
  .use("/api/roleDetail", require("./userAccess/roleDetail"))
  .use("/api/user", require("./userAccess/user"))
  .use("/api/userRoleMapping", require("./userAccess/userRoleMapping"))

  .use('/api/contact', require('./FormsApis/ContactForm'))
  .use('/api/Shivacontact', require('./FormsApis/ContactFormShiva'))

module.exports = router;
