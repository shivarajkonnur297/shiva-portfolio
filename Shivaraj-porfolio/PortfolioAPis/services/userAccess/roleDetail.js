const mm = require('../../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require("../../utilities/logger");

const applicationkey = process.env.APPLICATION_KEY;

var roleDetails = "role_details";  
var viewRoleDetails = "view_" + roleDetails;


function reqData(req) {

    var data = {
        ROLE_ID: req.ROLE_ID,
        FORM_ID: req.FORM_ID,
        IS_ALLOWED: req.IS_ALLOWED ? 1 : 0,
        SEQ_NO: req.SEQ_NO ? req.SEQ_NO : 0,
        CLIENT_ID: req.CLIENT_ID,
        SHOW_IN_MENU: req.SHOW_IN_MENU ? req.SHOW_IN_MENU : 0
    }
    return data;
}



exports.validate = function () {
    return [

        body('ROLE_ID').isInt(),
        body('FORM_ID').isInt(),
        body('SEQ_NO').isInt().optional(),
        body('ID').optional(),


    ]
}


exports.get = (req, res) => {

    var pageIndex = req.body.pageIndex ? req.body.pageIndex : '';

    var pageSize = req.body.pageSize ? req.body.pageSize : '';
    var start = 0;
    var end = 0;

    if (pageIndex != '' && pageSize != '') {
        start = (pageIndex - 1) * pageSize;
        end = pageSize;
    }

    let sortKey = req.body.sortKey ? req.body.sortKey : 'ID';
    let sortValue = req.body.sortValue ? req.body.sortValue : 'DESC';
    let filter = req.body.filter ? req.body.filter : '';

    let criteria = '';

    if (pageIndex === '' && pageSize === '')
        criteria = filter + " order by " + sortKey + " " + sortValue;
    else
        criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;

    let countCriteria = filter;
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey']; //Supportkey ;
    try {
        mm.executeQuery('select count(*) as cnt from ' + viewRoleDetails + ' where 1 ' + countCriteria, supportKey, (error, results1) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                res.send({
                    "code": 400,
                    "message": "Failed to get roleDetails count.",
                });
            } else {
                mm.executeQuery('select * from ' + viewRoleDetails + ' where 1 ' + criteria, supportKey, (error, results) => {
                    if (error) {
                        console.log(error);
                        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                        res.send({
                            "code": 400,
                            "message": "Failed to get roleDetail information."
                        });
                    } else {
                        res.send({
                            "code": 200,
                            "message": "success",
                            "count": results1[0].cnt,
                            "data": results
                        });
                    }
                });
            }
        });
    } catch (error) {
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        console.log(error);
    }
}


exports.create = (req, res) => {

    var data = reqData(req);
    const errors = validationResult(req);
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey']; //Supportkey ;

    if (!errors.isEmpty()) {

        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    } else {
        try {
            mm.executeQueryData('INSERT INTO ' + roleDetails + ' SET ?', data, supportKey, (error, results) => {
                if (error) {
                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                    res.send({
                        "code": 400,
                        "message": "Failed to save roleDetail information..."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "RoleDetail information saved successfully...",
                    });
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
            console.log(error)
        }
    }
}


exports.update = (req, res) => {
    const errors = validationResult(req);
    var data = reqData(req);
    var deviceid = req.headers['deviceid'];
    var supportKey = req.headers['supportkey']; //Supportkey ;
    var criteria = {
        ID: req.body.ID,
    };
    var systemDate = mm.getSystemDate();
    var setData = "";
    var recordData = [];
    Object.keys(data).forEach(key => {

        //data[key] ? setData += `${key}= '${data[key]}', ` : true;
        // setData += `${key}= :"${key}", `;
        data[key] ? setData += `${key}= ? , ` : true;
        data[key] ? recordData.push(data[key]) : true;
    });

    if (!errors.isEmpty()) {
        console.log(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    } else {
        try {
            mm.executeQueryData(`UPDATE ` + roleDetails + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, supportKey, (error, results) => {
                if (error) {
                    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
                    console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update roleDetail information."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "RoleDetail information updated successfully...",
                    });
                }
            });
        } catch (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
            console.log(error);
        }
    }
}


exports.addBulk = (req, res) => {
    try {
        var data = req.body.data;
        var supportKey = req.headers['supportkey'];
        var errors1 = "";
        var ROLE_ID1 = req.body.ROLE_ID;


        if ((!ROLE_ID1 && ROLE_ID1 == undefined && ROLE_ID1 == '') || (data == undefined && data.length == 0 && data == "")) {
            res.send({
                "code": 400,
                "message": "ROLE_ID  or data parameter missing"
            });

        } else {

            data.forEach(roleDetailsItem => {
                roleDetailsItem.ROLE_ID = ROLE_ID1;
                var dataRecord = reqData(roleDetailsItem);

                mm.executeQuery(`select * from  ${viewRoleDetails} where ROLE_ID = '${ROLE_ID1}' and FORM_ID = '${dataRecord.FORM_ID}'`, supportKey, (error, resultsIsDataPresent) => {
                    if (error) {
                        //logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + ' ' + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                        // res.send({
                        //     "code": 400,
                        //     "message": "Failed to get record"
                        // });
                        console.log(error)
                    } else {
                        if (resultsIsDataPresent.length > 0) {
                            //update record
                            mm.executeQuery(`update ${roleDetails} set SHOW_IN_MENU = ${dataRecord.SHOW_IN_MENU} ,IS_ALLOWED ='${dataRecord.IS_ALLOWED}',SEQ_NO = '${dataRecord.SEQ_NO}' where  ID = '${resultsIsDataPresent[0].ID}'`, supportKey, (error, resultsUpdate) => {
                                if (error) {
                                    console.log(error);
                                    errors1 += ('\n' + error);
                                }
                            });
                        } else {
                            //insert record 
                            mm.executeQueryData('INSERT INTO ' + roleDetails + ' SET ?', dataRecord, supportKey, (error, resultsInsert) => {
                                if (error) {
                                    console.log(error)
                                    errors1 += ('\n' + error);
                                }
                            });
                        }
                    }
                });
            });

            if (errors1.length > 0) {
                //logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + ' ' + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                res.send({
                    "code": 400,
                    "message": "Failed to Insert Role details"
                });
            } else {
                res.send({
                    "code": 200,
                    "message": "New role details Successfully added",
                });
            }
        }
    } catch (error) {
        console.log(error);
    }

}



exports.getMappingData11 = (req, res) => {

    try {
        var supportKey = req.headers['supportkey'];
        var roleId = req.body.ROLE_ID;

        var query = `SELECT m.ID AS FORM_ID,m.*,If((SELECT IS_ALLOWED FROM ${viewRoleDetails}  WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}')=1,1,0) AS IS_ALLOWED,IF(IFNULL((SELECT SEQ_NO FROM view_role_details WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}'),'')='',0,(SELECT SEQ_NO FROM view_role_details WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}')) AS SEQ_NO,(SELECT SHOW_IN_MENU FROM view_role_details WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}') AS SHOW_IN_MENU FROM view_form_master m`


        mm.executeQuery(query, supportKey, (error, results) => {
            if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + ' ' + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                res.send({
                    "code": 400,
                    "message": "Failed to get record"
                });
            } else {
                if (results.length > 0) {
                    res.send({
                        "code": 200,
                        "message": "success",
                        "data": results
                    });
                } else {

                    res.send({
                        "code": 200,
                        "message": "success",
                        "data": results
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}

exports.getMappingData = (req, res) => {

    try {
        var supportKey = req.headers['supportkey'];
        var roleId = req.body.ROLE_ID;

        mm.executeQuery(`SELECT * FROM view_role_master where ID = ${roleId}`, supportKey, (error, results) => {
            if (error) {
                res.send({
                    "code": 400,
                    "message": "Failed to get record"
                });
            }
            else {
                if (results.length > 0) {
                    var query = ``;
                    // if (results[0].PARENT_ID == 0) {

                        query = `SELECT m.ID AS FORM_ID,m.*,If((SELECT IS_ALLOWED FROM ${viewRoleDetails}  WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}')=1,1,0) AS IS_ALLOWED,IF(IFNULL((SELECT SEQ_NO FROM view_role_details WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}'),'')='',0,(SELECT SEQ_NO FROM view_role_details WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}')) AS SEQ_NO,(SELECT SHOW_IN_MENU FROM view_role_details WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}') AS SHOW_IN_MENU FROM view_form_master m `

                    // }
                    // else {

                    //     query = `SELECT m.ID AS FORM_ID,m.*,If((SELECT IS_ALLOWED FROM ${viewRoleDetails}  WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}')=1,1,0) AS IS_ALLOWED,IF(IFNULL((SELECT SEQ_NO FROM view_role_details WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}'),'')='',0,(SELECT SEQ_NO FROM view_role_details WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}')) AS SEQ_NO,(SELECT SHOW_IN_MENU FROM view_role_details WHERE FORM_ID=m.ID AND ROLE_ID='${roleId}') AS SHOW_IN_MENU FROM view_form_master m  WHERE ID IN (SELECT FORM_ID FROM view_role_details WHERE ROLE_ID = ${results[0].PARENT_ID} and IS_ALLOWED = 1) `

                    // }

                    mm.executeQuery(query, supportKey, (error, results1) => {
                        if (error) {
                            console.log(error);
                            //logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + ' ' + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                            res.send({
                                "code": 400,
                                "message": "Failed to get record"
                            });
                        } else {
                            if (results.length > 0) {
                                res.send({
                                    "code": 200,
                                    "message": "success",
                                    "data": results1
                                });
                            } else {

                                res.send({
                                    "code": 200,
                                    "message": "success",
                                    "data": results1
                                });
                            }
                        }
                    });
                }
                else {
                    res.send({
                        "code": 400,
                        "message": "No role Id record found"
                    });
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
}




exports.checkAccess = (req, res) => {
    try {
        var roleId = req.body.ROLE_ID;
        var formLink = req.body.LINK;
        var supportKey = req.headers['supportkey']

        if (roleId && formLink) {

            mm.executeQuery(`select * from view_role_details where ROLE_ID = ${roleId} AND LINK = '${formLink}' and IS_ALLOWED = 1`, supportKey, (error, results) => {
                if (error) {

                    console.log(error);
                    //logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + ' ' + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                    res.send({
                        "code": 400,
                        "message": "Failed to get record"
                    });

                }
                else {
                    if (results.length > 0) {

                        res.send({
                            "code": 200,
                            "message": "success",
                            "data": true
                        });
                    }
                    else {
                        res.send({
                            "code": 200,
                            "message": "success",
                            "data": false
                        });
                    }

                }

            })

        }
        else {
            //logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + ' ' + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            res.send({
                "code": 400,
                "message": "Parameter Missing roleId or formLink "
            });

        }

    } catch (error) {
        console.log(error)
    }
}