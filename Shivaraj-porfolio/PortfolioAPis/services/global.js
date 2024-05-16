const jwt = require("jsonwebtoken");
const mm = require("../utilities/globalModule");
const formidable = require("formidable");
const path = require("path");


exports.checkToken = function (req, res, next) {
  try {
    //console.log('token',req.headers['token']);

    if (req.headers["token"]) {
      jwt.verify(
        req.headers["token"],
        process.env.SECRET,
        (error, authData) => {
          if (error) {
            console.log("error", error);
            //logger.error('APIK' + apikey + ' ' + req.method + " " + req.url + 'Wrong Token.', req.headers['supportkey']);
            res.send({
              code: 403,
              message: "Wrong Token.",
            });
          } else {
            // console.log( "alae")
            req.authData = authData;
            next();
          }
        }
      );
    } else {
      res.send({
        code: 403,
        message: "No Token Provided.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.checkAuthorization = (req, res, next) => {
  let API = process.env.API_KEY;
  try {
    if (API == req.headers["apikey"]) {
      next();
    } else {
      res.send({
        code: 401,
        message: "Unauthorized USER",
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      code: 401,
      message: "Unauthorized USER",
    });
  }
};

exports.uploadPhoto = function (req, res) {
  const fs = require("fs");
  //   console.log('fnm   ',req.query.folderName)
  var folderName = req.params["folderName"];
  var form = new formidable.IncomingForm();
  var pathName = path.join(__dirname, "../Uploads/", folderName, "/");

  form.parse(req, function (err, fields, files) {
    var oldPath = files.Image.filepath;
    var newPath = pathName + files.Image.originalFilename;

    var rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, function (err) {
      if (err) {
        console.log(err);
        res.send({
          code: 400,
          message: "failed to upload ",
        });
      } else {
        res.send({
          code: 200,
          message: "uploaded",
        });
      }
    });
  });
};

exports.randomOtp = (req, res) => {
  function generate() {
    // Declare a digits variable
    // which stores all digits
    var OTP = Math.floor(100000 + Math.random() * 900000);
    // var digits = '0123456789';
    // let OTP = '';
    // for (let i = 0; i < 6; i++ ) {
    //     OTP += digits[(Math.random())];
    // }
    return OTP;
  }
  // console.log(generate())
};

exports.sendSMSEmail = (type, to, subject, body, callback) => {
  console.log("type : ", type);
  if (type == "M") {
    mm.sendSMS(to, body, (error, result) => {
      if (error) {
        console.log(error);
        callback(error);
      } else {
        console.log("results in ", result);
        callback(null, result);
      }
    });
  } else if (type == "E") {
    mm.sendEmail(to, subject, body, (error, results) => {
      if (error) {
        console.log(error);
        callback(error);
      } else {
        console.log("Email Send To : ", to);
        callback(null, results);
      }
    });
  }
};