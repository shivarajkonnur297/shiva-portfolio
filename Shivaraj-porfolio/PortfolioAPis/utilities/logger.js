const request = require('request');

exports.error = async (message, applicationkey, supportkey, deviceid) => {

    try {

        var options = {
            url: process.env.GM_API + 'device/addErrorLog',
            method: 'POST',
            json: true,
            headers: {
                'User-Agent': 'request',
                'apikey': 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
                'applicationkey': 'pd1zAtB3Bg9pRJp6',
                'supportkey': process.env.SUPPORT_KEY,
                'deviceid': deviceid
            },
            body: {
                MESSAGE: message,
                APPLICATION_KEY: applicationkey
            }
        };

        request(options, (error, response, body) => {
            if (error) {
                console.log("addErrlog Error : ", error);
            } else {
                console.log("addErrlog Response : ", body);
            }
        });

    } catch (error) {
        console.log("addErrlog Exception : ", error);
    }
}