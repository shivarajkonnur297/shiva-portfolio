var dbConfig = require("./dbConfig");
var logger = require("./logger");
var applicationkey = process.env.APPLICATION_KEY

exports.executeQuery = (query, supportKey, callback) => {

    try {
        dbConfig.getConnection(function (error, connection) {
            if (error) {
               
                throw error;
            }
            //console.log(query);

            connection.query(query, callback);
            connection.release();
           
        });

    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
    } finally {
        //dbConfig.end();
    }
}

exports.getSystemDate = function (date) {
    let date_ob = '2022-04-11 14:50:00';
  
    return date_ob;
}

exports.executeQueryData = (query, data, supportKey, callback) => {

    try {
        dbConfig.getConnection(function (error, connection) {
            if (error) {
                console.log(error);
                throw error;
            }
            //console.log(query, data);
            connection.query(query, data, callback);
            connection.on('error', function (error) {
                throw error;
                return;
            });
            // logger.database(query, applicationkey, supportKey);

            connection.release();
            
        });
      
    } catch (error) {
        console.log("Exception  In : " + query + " Error : ", error);
       
    } finally {
        // dbConfig.end();
    }
}

exports.sendSMS = (to, body, callback) => {
    const request = require('request');
    console.log("in sms send method", body);
    var options = {
        url: process.env.GM_API + 'sendSms',
        headers: {
            "apikey": process.env.GM_API_KEY,
            "supportkey": process.env.SUPPORT_KEY,
            "applicationkey": process.env.APPLICATION_KEY
        },
        body: {

            KEY: body.search(/otp/i) ? process.env.SMS_SERVER_KEY_OTP : process.env.SMS_SERVER_KEY,
            TO: to,
            BODY: String.raw`${body}`//body

        },
        json: true
    };

    //console.log(options);
    request.post(options, (error, response, body) => {
        if (error) {
            callback(error);
        } else {
            //console.log("bdoy: ", response.body);
            if (response.body.code == 400)
                callback("SMS SEND ERROR." + JSON.stringify(body));
            else
                callback(null, "SMS SEND : " + JSON.stringify(body))
        }
    });
}

exports.sendWSMS = (to, template_name,PARAMETERS,encoding, callback) => {
    const request = require('request');
    console.log(to, template_name,PARAMETERS,encoding, callback);
    console.log("in wsms send method");
    var options = {
        url: process.env.GM_API + 'sendWSms',
        headers: {
            "apikey": process.env.GM_API_KEY,
            "supportkey": process.env.SUPPORT_KEY,
            "applicationkey": process.env.APPLICATION_KEY
        },
        body: {
 
            W_SMS_KEY: process.env.W_SMS_KEY,
            SEND_TO: to,
            template_name: template_name,//body
			PARAMETERS:PARAMETERS,
			ENCODING:encoding
 
        },
        json: true
    };
 
    //console.log(options);
    request.post(options, (error, response, body) => {
        if (error) {
            callback(error);
        } else {
            //console.log("wsms body: ", body);
			callback(null, body);
        }
    });
}

exports.sendWMediaSMS = (to, template_name, PARAMETERS,HPARAMETERS, encoding, callback) => {
    const request = require('request');
    console.log("in wsms send method");
    var options = {
        url: process.env.GM_API + 'sendWMediaSms',
        headers: {
            "apikey": process.env.GM_API_KEY,
            "supportkey": process.env.SUPPORT_KEY,
            "applicationkey": process.env.APPLICATION_KEY
        },
        body: {

            W_SMS_KEY: process.env.W_SMS_KEY,
            SEND_TO: to,
            template_name: template_name,//body
            PARAMETERS: PARAMETERS,
            HPARAMETERS: HPARAMETERS,
            ENCODING: encoding

        },
        json: true
    };

    //console.log(options);
    request.post(options, (error, response, body) => {
        if (error) {
            callback(error);
        } else {
            console.log("wsms body: ", body);

            callback(null, body)
        }
    });
}

exports.sendEmail = (to, subject, body, callback) => {
    console.log("Mail subject ", subject)
    console.log(to);
    var request = require('request');
 
    console.log("email key ", process.env.EMAIL_SERVER_KEY)
 
    var options = {
        url: process.env.GM_API + 'sendEmail',
        headers: {
            "apikey": process.env.GM_API_KEY,
            "supportkey": process.env.SUPPORT_KEY,
            "applicationkey": process.env.APPLICATION_KEY
        },
        body: {
            KEY: process.env.EMAIL_SERVER_KEY,
            TO: to,
            SUBJECT: subject,
            BODY: body
        },
        json: true
    }
 
    request.post(options, (error, response, body) => {
        if (error) {
            console.log("request error -send email ", error);
            //sms sent failed
            //data.STATUS = 'F';
            callback("EMAIL SEND ERROR.");
        } else {
            console.log(body);
            //sms sent  
            // CHECK STATUS FOR SENT SMS
            callback(null, "EMAIL SEND");
        }
    });
}




