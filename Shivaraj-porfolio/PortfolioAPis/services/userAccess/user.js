const mm = require("../../utilities/globalModule");
const db = require("../../utilities/dbModule");
const { validationResult, body } = require("express-validator");
const logger = require("../../utilities/logger");

const jwt = require("jsonwebtoken");

const applicationkey = process.env.APPLICATION_KEY;

var userMaster = "user_master";
var viewUserMaster = "view_" + userMaster;

var donationDayBook = "donation_day_book";
var viewDonationDayBook = "view_" + donationDayBook;

var agentMaster = "agent_master";
var viewAgentMaster = "view_" + agentMaster;

function reqData(req) {
  var data = {
    ROLE_ID: req.body.ROLE_ID ? req.body.ROLE_ID : 0,
    NAME: req.body.NAME,
    EMAIL_ID: req.body.EMAIL_ID,
    MOBILE_NUMBER: req.body.MOBILE_NUMBER,
    IS_ACTIVE: req.body.IS_ACTIVE ? "1" : "0",
    PASSWORD: req.body.PASSWORD,
    CLIENT_ID: req.body.CLIENT_ID,
  };
  return data;
}

function reqDataAgent(req) {
  var dataAgent = {
    NAME: req.body.NAME,
    MOBILE_NO: req.body.MOBILE_NO,
    EMAIL_ID: req.body.EMAIL_ID,
    PASSWORD: req.body.PASSWORD,

    CLIENT_ID: req.body.CLIENT_ID,
  };
  return dataAgent;
}

function reqDataDay(req) {
  var dataDay = {
    AGENT_ID: req.body.AGENT_ID,
    DATE: req.body.DATE,
    DAY_START_TIME: req.body.DAY_START_TIME,
    OPENING_BALANCE: req.body.OPENING_BALANCE ? req.body.OPENING_BALANCE : 0,
    DAY_END_TIME: req.body.DAY_END_TIME,
    CLOSING_BALANCE: req.body.CLOSING_BALANCE,
    TOTAL_TRANSACTIONS: req.body.TOTAL_TRANSACTIONS,
    TOTAL_AMOUNT: req.body.TOTAL_AMOUNT,
    STATUS: req.body.STATUS,
    REMARK: req.body.REMARK,
    OTP: req.body.OTP,
    USER_ID: req.body.USER_ID,
    END_DATE: req.body.END_DATE,
    CLIENT_ID: req.body.CLIENT_ID,
  };
  return dataDay;
}

exports.validate = function () {
  return [
    // body('ROLE_ID').isInt(),
    body("NAME", " parameter missing").exists(),
    body("EMAIL_ID", " parameter missing").exists(),
    body("MOBILE_NUMBER", " parameter missing").exists(),
    body("PASSWORD", " parameter missing").exists(),
    body("ID").optional(),
  ];
};

exports.get = (req, res) => {
  var pageIndex = req.body.pageIndex ? req.body.pageIndex : "";

  var pageSize = req.body.pageSize ? req.body.pageSize : "";
  var start = 0;
  var end = 0;

  if (pageIndex != "" && pageSize != "") {
    start = (pageIndex - 1) * pageSize;
    end = pageSize;
  }

  let sortKey = req.body.sortKey ? req.body.sortKey : "ID";
  let sortValue = req.body.sortValue ? req.body.sortValue : "DESC";
  let filter = req.body.filter ? req.body.filter : "";

  let criteria = "";

  if (pageIndex === "" && pageSize === "")
    criteria = filter + " order by " + sortKey + " " + sortValue;
  else
    criteria =
      filter +
      " order by " +
      sortKey +
      " " +
      sortValue +
      " LIMIT " +
      start +
      "," +
      end;

  let countCriteria = filter;
  var deviceid = req.headers["deviceid"];
  var supportKey = req.headers["supportkey"]; //Supportkey ;
  try {
    mm.executeQuery(
      "select count(*) as cnt from " +
        viewUserMaster +
        " where 1 " +
        countCriteria,
      supportKey,
      (error, results1) => {
        if (error) {
          console.log(error);
          //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
          logger.error(
            supportKey +
              " " +
              req.method +
              " " +
              req.url +
              " " +
              JSON.stringify(error),
            applicationkey,
            supportKey,
            deviceid
          );
          res.send({
            code: 400,
            message: "Failed to get users count.",
          });
        } else {
          mm.executeQuery(
            "select * from " + viewUserMaster + " where 1 " + criteria,
            supportKey,
            (error, results) => {
              if (error) {
                console.log(error);
                //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                logger.error(
                  supportKey +
                    " " +
                    req.method +
                    " " +
                    req.url +
                    " " +
                    JSON.stringify(error),
                  applicationkey,
                  supportKey,
                  deviceid
                );
                res.send({
                  code: 400,
                  message: "Failed to get user information.",
                });
              } else {
                res.send({
                  code: 200,
                  message: "success",
                  count: results1[0].cnt,
                  data: results,
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
    logger.error(
      supportKey +
        " " +
        req.method +
        " " +
        req.url +
        " " +
        JSON.stringify(error),
      applicationkey,
      supportKey,
      deviceid
    );
    console.log(error);
  }
};

exports.create = (req, res) => {
  var data = reqData(req);
  const errors = validationResult(req);
  var deviceid = req.headers["deviceid"];
  var supportKey = req.headers["supportkey"]; //Supportkey ;

  var roleData = req.body.ROLE_DATA ? req.body.ROLE_DATA : [];

  var connection = db.openConnection();
  if (!errors.isEmpty()) {
    console.log(errors);
    res.send({
      code: 422,
      message: errors.errors,
    });
  } else {
    try {
      db.executeDML(
        "INSERT INTO " + userMaster + " SET ?",
        data,
        supportKey,
        connection,
        (error, results) => {
          if (error) {
            console.log(error);
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(
              supportKey +
                " " +
                req.method +
                " " +
                req.url +
                " " +
                JSON.stringify(error),
              applicationkey,
              supportKey,
              deviceid
            );
            db.rollbackConnection(connection);
            res.send({
              code: 400,
              message: "Failed to save user information...",
            });
          } else {
            if (roleData.length > 0) {
              var inserQuery = `INSERT INTO user_role_mapping(USER_ID,ROLE_ID,COLLEGE_ID,COLLEGE_CONTACT_ID,CLIENT_ID) VALUES ?`;
              var recordData = [];

              for (let index = 0; index < roleData.length; index++) {
                const roles = roleData[index];

                var rec = [results.insertId, roles, 0, 0, data.CLIENT_ID];
                recordData.push(rec);
              }

              db.executeDML(
                inserQuery,
                [recordData],
                supportKey,
                connection,
                (error, resultRole) => {
                  if (error) {
                    console.log(error);
                    logger.error(
                      supportKey +
                        " " +
                        req.method +
                        " " +
                        req.url +
                        " " +
                        JSON.stringify(error),
                      applicationkey,
                      supportKey,
                      deviceid
                    );
                    db.rollbackConnection(connection);
                    res.send({
                      code: 400,
                      message: "Failed to save user information...",
                    });
                  } else {
                    db.commitConnection(connection);
                    res.send({
                      code: 200,
                      message: "User information saved successfully...",
                    });
                  }
                }
              );
            } else {
              db.commitConnection(connection);
              res.send({
                code: 200,
                message: "User information saved successfully...",
              });
            }
          }
        }
      );
    } catch (error) {
      //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
      logger.error(
        supportKey +
          " " +
          req.method +
          " " +
          req.url +
          " " +
          JSON.stringify(error),
        applicationkey,
        supportKey,
        deviceid
      );
      console.log(error);
    }
  }
};

exports.update = (req, res) => {
  const errors = validationResult(req);

  var data = reqData(req);
  var deviceid = req.headers["deviceid"];
  var supportKey = req.headers["supportkey"]; //Supportkey ;
  var roleData = req.body.ROLE_DATA ? req.body.ROLE_DATA : [];

  var connection = db.openConnection();

  var criteria = {
    ID: req.body.ID,
  };
  var systemDate = mm.getSystemDate();
  var setData = "";
  var recordData = [];
  Object.keys(data).forEach((key) => {
    //data[key] ? setData += `${key}= '${data[key]}', ` : true;
    // setData += `${key}= :"${key}", `;
    data[key] ? (setData += `${key}= ? , `) : true;
    data[key] ? recordData.push(data[key]) : true;
  });

  if (!errors.isEmpty()) {
    console.log(errors);

    res.send({
      code: 422,
      message: errors.errors,
    });
  } else {
    try {
      db.executeDML(
        `UPDATE ` +
          userMaster +
          ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `,
        recordData,
        supportKey,
        connection,
        (error, results) => {
          if (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(
              supportKey +
                " " +
                req.method +
                " " +
                req.url +
                " " +
                JSON.stringify(error),
              applicationkey,
              supportKey,
              deviceid
            );
            console.log(error);
            db.rollbackConnection(connection);
            res.send({
              code: 400,
              message: "Failed to update user information.",
            });
          } else {
            if (roleData.length > 0) {
              db.executeDML(
                `delete from user_role_mapping where USER_ID = ?`,
                [criteria.ID],
                supportKey,
                connection,
                (error, resultDelete) => {
                  if (error) {
                    console.log(error);
                    db.rollbackConnection(connection);
                    res.send({
                      code: 400,
                      message: "Failed to save user information...",
                    });
                  } else {
                    var inserQuery = `INSERT INTO user_role_mapping(USER_ID,ROLE_ID,COLLEGE_ID,COLLEGE_CONTACT_ID,CLIENT_ID) VALUES ?`;
                    var recordData = [];

                    for (let index = 0; index < roleData.length; index++) {
                      const roles = roleData[index];

                      var rec = [criteria.ID, roles, 0, 0, data.CLIENT_ID];
                      recordData.push(rec);
                    }

                    db.executeDML(
                      inserQuery,
                      [recordData],
                      supportKey,
                      connection,
                      (error, resultRole) => {
                        if (error) {
                          console.log(error);
                          logger.error(
                            supportKey +
                              " " +
                              req.method +
                              " " +
                              req.url +
                              " " +
                              JSON.stringify(error),
                            applicationkey,
                            supportKey,
                            deviceid
                          );
                          db.rollbackConnection(connection);
                          res.send({
                            code: 400,
                            message: "Failed to save user information...",
                          });
                        } else {
                          db.commitConnection(connection);
                          res.send({
                            code: 200,
                            message: "User information updated successfully...",
                          });
                        }
                      }
                    );
                  }
                }
              );
            } else {
              db.commitConnection(connection);
              res.send({
                code: 200,
                message: "User information updated successfully...",
              });
            }
          }
        }
      );
    } catch (error) {
      //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
      logger.error(
        supportKey +
          " " +
          req.method +
          " " +
          req.url +
          " " +
          JSON.stringify(error),
        applicationkey,
        supportKey,
        deviceid
      );
      console.log(error);
    }
  }
};

/////Methods with transaction commit rollback

exports.get1 = async (req, res) => {
  try {
    var pageIndex = req.body.pageIndex ? req.body.pageIndex : "";

    var pageSize = req.body.pageSize ? req.body.pageSize : "";
    var start = 0;
    var end = 0;

    if (pageIndex != "" && pageSize != "") {
      start = (pageIndex - 1) * pageSize;
      end = pageSize;
    }

    let sortKey = req.body.sortKey ? req.body.sortKey : "ID";
    let sortValue = req.body.sortValue ? req.body.sortValue : "DESC";
    let filter = req.body.filter ? req.body.filter : "";

    let criteria = "";

    if (pageIndex === "" && pageSize === "")
      criteria = filter + " order by " + sortKey + " " + sortValue;
    else
      criteria =
        filter +
        " order by " +
        sortKey +
        " " +
        sortValue +
        " LIMIT " +
        start +
        "," +
        end;

    let countCriteria = filter;
    var deviceid = req.headers["deviceid"];
    var supportKey = req.headers["supportkey"]; //Supportkey ;

    var connection = await mm.getConnection();

    var countQuery =
      "select count(*) as cnt from " +
      viewUserMaster +
      " where 1 " +
      countCriteria;

    await mm.executeQueryTransaction(countQuery, connection).then(
      async (result) => {
        if (result.length > 0) {
          var dataquery =
            "select * from " + viewUserMaster + " where 1 " + criteria;

          await mm.executeQueryTransaction(dataquery, connection).then(
            (results) => {
              if (results.length > 0) {
                res.send({
                  code: 200,
                  message: "success",
                  count: result[0].cnt,
                  data: results,
                });
              } else {
                //No data found
                res.send({
                  code: 200,
                  message: "No Data",
                });
              }
            },
            (error) => {
              console.log(
                "Error occurred in method : ",
                req.method,
                "Error : ",
                error
              );
              logger.error(
                supportKey +
                  " " +
                  req.method +
                  " " +
                  req.url +
                  " " +
                  JSON.stringify(error),
                applicationkey,
                supportKey,
                deviceid
              );
              res.send({
                code: 400,
                message: "Failed to get users count.",
              });
            }
          );
        } else {
          //No data found
          res.send({
            code: 200,
            message: "No Data",
          });
        }
      },
      (error) => {
        console.log(
          "Error occurred in method : ",
          req.method,
          "Error : ",
          error
        );
        logger.error(
          supportKey +
            " " +
            req.method +
            " " +
            req.url +
            " " +
            JSON.stringify(error),
          applicationkey,
          supportKey,
          deviceid
        );
        res.send({
          code: 400,
          message: "Failed to get users count.",
        });
      }
    );
  } catch (error) {
    logger.error(
      supportKey +
        " " +
        req.method +
        " " +
        req.url +
        " " +
        JSON.stringify(error),
      applicationkey,
      supportKey,
      deviceid
    );
    console.log(error);
  }
};

exports.create1 = async (req, res) => {
  var data = reqData(req);
  const errors = validationResult(req);
  var deviceid = req.headers["deviceid"];
  var supportKey = req.headers["supportkey"]; //Supportkey ;

  if (!errors.isEmpty()) {
    console.log(errors);
    res.send({
      code: 422,
      message: errors.errors,
    });
  } else {
    try {
      var connection = await mm.getConnection(); //get connection from pool

      mm.executeQueryDataTransaction(
        "INSERT INTO " + userMaster + " SET ?",
        data,
        connection
      ).then(
        (results) => {
          res.send({
            code: 200,
            message: "User information saved successfully...",
          });
        },
        (error) => {
          //console.log("Error in method : ", req.method, req.url, "Error : ", error);
          console.log("Error in method : ", error.sqlMessage);
          //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
          logger.error(
            supportKey +
              " " +
              req.method +
              " " +
              req.url +
              " " +
              JSON.stringify(error),
            applicationkey,
            supportKey,
            deviceid
          );
          res.send({
            code: 400,
            message: "Failed to save user information...",
          });
        }
      );

      mm.endConnection(connection);
    } catch (error) {
      //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
      logger.error(
        supportKey +
          " " +
          req.method +
          " " +
          req.url +
          " " +
          JSON.stringify(error),
        applicationkey,
        supportKey,
        deviceid
      );
      console.log(
        "Exception in method : ",
        req.method,
        req.url,
        " Error : ",
        error
      );
      mm.endConnection(connection);
    }
  }
};

exports.update1 = async (req, res) => {
  try {
    const errors = validationResult(req);
    var data = reqData(req);
    var deviceid = req.headers["deviceid"];
    var supportKey = req.headers["supportkey"];
    var criteria = {
      ID: req.body.ID,
    };
    var systemDate = mm.getSystemDate();
    var setData = "";
    var recordData = [];
    Object.keys(data).forEach((key) => {
      //data[key] ? setData += `${key}= '${data[key]}', ` : true;
      // setData += `${key}= :"${key}", `;
      data[key] ? (setData += `${key}= ? , `) : true;
      data[key] ? recordData.push(data[key]) : true;
    });

    if (!errors.isEmpty()) {
      console.log(errors);
      res.send({
        code: 422,
        message: errors.errors,
      });
    } else {
      var connection = await mm.getConnection();
      mm.executeQueryDataTransaction(
        `UPDATE ` +
          userMaster +
          ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `,
        recordData,
        connection
      ).then(
        (results) => {
          res.send({
            code: 200,
            message: "User information updated successfully...",
          });
        },
        (error) => {
          logger.error(
            supportKey +
              " " +
              req.method +
              " " +
              req.url +
              " " +
              JSON.stringify(error),
            applicationkey,
            supportKey,
            deviceid
          );
          console.log(error);
          res.send({
            code: 400,
            message: "Failed to update user information.",
          });
        }
      );
      mm.endConnection(connection);
    }
  } catch (error) {
    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
    logger.error(
      supportKey +
        " " +
        req.method +
        " " +
        req.url +
        " " +
        JSON.stringify(error),
      applicationkey,
      supportKey,
      deviceid
    );
    console.log(error);
    mm.endConnection(connection);
  }
};

exports.login = (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;

    //var cloudId = req.body.cloudid ? req.body.cloudid : '';

    var supportKey = req.headers["supportkey"];

    if (
      !username &&
      username == "" &&
      username == undefined &&
      !password &&
      password == "" &&
      password == undefined
    ) {
      res.send({
        code: 400,
        message: "username or password parameter missing",
      });
    } else {
      //and DEVICE_ID = '${deviceId}
      mm.executeQuery(
        `SELECT * FROM ${viewUserMaster}  WHERE  (MOBILE_NUMBER ='${username}' or EMAIL_ID='${username}') and PASSWORD ='${password}' and IS_ACTIVE = 1`,
        supportKey,
        (error, results1) => {
          if (error) {
            console.log(error);
            // logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            res.send({
              code: 400,
              message: "Failed to get record",
            });
          } else {
            if (results1.length > 0) {
              mm.executeQuery(
                `SELECT ROLE_ID,ROLE_NAME FROM view_user_role_mapping where USER_ID = ${results1[0].ID}`,
                supportKey,
                (error, resultRole) => {
                  if (error) {
                    console.log(error);
                    res.send({
                      code: 400,
                      message: "Failed to get record",
                    });
                  } else {
                    var userDetails = [
                      {
                        USER_ID: results1[0].ID,
                        CLIENT_ID: results1[0].CLIENT_ID,
                        NAME: results1[0].NAME,
                        EMAIL_ID: results1[0].EMAIL_ID,
                        ROLE_ID: results1[0].ROLE_ID,
                        ROLE_DETAILS: resultRole,
                      },
                    ];

                    // mm.executeQueryData(`update user`)

                    generateToken(results1[0].ID, res, userDetails);
                  }
                }
              );
            } else {
              // logger.error('APIK' +apikey+' '+req.method+" " + req.url +'Email does not exit',req.headers['supportkey']);
              res.send({
                code: 404,
                message: "Username OR Password does not exits",
              });
            }
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    // logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
  }
};

exports.loginApp = (req, res) => {
  try {
    var dataDay = reqDataDay(req);
    dataDay.STATUS = "AS";

    var username = req.body.username;
    var password = req.body.password;
    var OTP = req.body.OTP;
    //var cloudId = req.body.cloudid ? req.body.cloudid : '';

    var supportKey = req.headers["supportkey"];

    if (
      !username ||
      username == "" ||
      username == undefined ||
      !password ||
      password == "" ||
      password == undefined ||
      !OTP ||
      OTP == "" ||
      OTP == undefined
    ) {
      res.send({
        code: 400,
        message: "username or password or OTP parameter missing",
      });
    } else {
      //and DEVICE_ID = '${deviceId}
      mm.executeQuery(
        `SELECT * FROM ${viewAgentMaster}  WHERE  (MOBILE_NO ='${username}' or EMAIL_ID='${username}') and PASSWORD ='${password}'`,
        supportKey,
        (error, resultsDayBook) => {
          if (error) {
            console.log(error);
            // logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            res.send({
              code: 400,
              message: "Failed to get record",
            });
          } else {
            mm.executeQuery(
              `SELECT * FROM ${viewDonationDayBook}  WHERE  OTP = ${OTP} AND STATUS != 'AS'`,
              supportKey,
              (error, resultsDay) => {
                if (error) {
                  console.log(error);
                  // logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                  res.send({
                    code: 400,
                    message: "Failed to get record",
                  });
                } else {
                  if (resultsDayBook.length > 0 && resultsDay.length > 0) {
                    mm.executeQuery(
                      `SELECT EMAIL_ID,PASSWORD FROM view_agent_master where ID = ${resultsDayBook[0].ID}`,
                      supportKey,
                      (error, results1) => {
                        if (error) {
                          console.log(error);
                          res.send({
                            code: 400,
                            message: "Failed to get record",
                          });
                        } else {
                          mm.executeQuery(
                            `SELECT AGENT_ID,ID FROM view_donation_day_book where ID = ${resultsDay[0].ID}`,
                            supportKey,
                            (error, result) => {
                              if (error) {
                                console.log(error);
                                res.send({
                                  code: 400,
                                  message: "Failed to get record",
                                });
                              } else {
                                var dataDay = reqDataDay(req);
                                dataDay.STATUS = "AS";

                                var systemDate = mm.getSystemDate();
                                var setData = "";
                                var recordData = [];
                                Object.keys(dataDay).forEach((key) => {
                                  //data[key] ? setData += `${key}= '${data[key]}', ` : true;
                                  // setData += `${key}= :"${key}", `;
                                  dataDay[key]
                                    ? (setData += `${key}= ? , `)
                                    : true;
                                  dataDay[key]
                                    ? recordData.push(dataDay[key])
                                    : true;
                                });
                                dataDay.STATUS = "AS";
                                mm.executeQueryData(
                                  `UPDATE ` +
                                    donationDayBook +
                                    ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where OTP = ${OTP} `,
                                  recordData,
                                  supportKey,
                                  (error, results) => {
                                    if (error) {
                                      //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                                      logger.error(
                                        supportKey +
                                          " " +
                                          req.method +
                                          " " +
                                          req.url +
                                          " " +
                                          JSON.stringify(error),
                                        applicationkey
                                      );
                                      console.log(error);
                                      res.send({
                                        code: 400,
                                        message:
                                          "Failed to update donation  information.",
                                      });
                                    } else {
                                      let current = new Date();
                                      let cDate =
                                        current.getFullYear() +
                                        "-" +
                                        (current.getMonth() + 1) +
                                        "-" +
                                        current.getDate();
                                      let cTime =
                                        current.getHours() +
                                        ":" +
                                        current.getMinutes() +
                                        ":" +
                                        current.getSeconds();
                                      var dateTime = cDate + " " + " " + cTime;
                                      var userDetailApp = [
                                        {
                                          AGENT_ID: resultsDay[0].AGENT_ID,
                                          UNIQUE_NO:
                                            resultsDayBook[0].UNIQUE_NO,
                                          DAYBOOKID: resultsDay[0].ID,
                                          DAY_START_TIME:
                                            resultsDay[0].DAY_START_TIME,
                                          // DATE: resultsDay[0].DATE,
                                          OTP: resultsDay[0].OTP,
                                          Login_Time: dateTime,
                                        },
                                      ];

                                      // mm.executeQueryData(`update user`)

                                      generateTokenApp(
                                        resultsDayBook[0].ID,
                                        res,
                                        userDetailApp
                                      );

                                      // var userDayBook = [
                                      //     {
                                      //         AGENT_ID: resultsDay[0].AGENT_ID,
                                      //         DATE: resultsDay[0].DATE,
                                      //         DAYBOOK :resultRole
                                      //     }
                                      // ]

                                      // mm.executeQueryData(`update user`)

                                      // generateToken(resultsDay[0].AGENT_ID, res, userDayBook);
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  } else {
                    // logger.error('APIK' +apikey+' '+req.method+" " + req.url +'Email does not exit',req.headers['supportkey']);
                    res.send({
                      code: 404,
                      message: "Username OR Password OR OTP NOT VALID",
                    });
                  }
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    // logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
  }
};

exports.logoutApp = (req, res) => {
  const errors = validationResult(req);
  var dataDay = reqDataDay(req);
  dataDay.STATUS = "AE";
  var supportKey = req.headers["supportkey"];
  var AGENT_ID = req.body.AGENT_ID;
  var systemDate = mm.getSystemDate();
  var setData = "";
  var recordData = [];
  Object.keys(dataDay).forEach((key) => {
    //data[key] ? setData += `${key}= '${data[key]}', ` : true;
    // setData += `${key}= :"${key}", `;
    dataDay[key] ? (setData += `${key}= ? , `) : true;
    dataDay[key] ? recordData.push(dataDay[key]) : true;
  });

  if (!errors.isEmpty()) {
    console.log(errors);
    res.send({
      code: 422,
      message: errors.errors,
    });
  } else {
    try {
      mm.executeQueryData(
        ` UPDATE ` +
          donationDayBook +
          ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where AGENT_ID = ${AGENT_ID} `,
        recordData,
        supportKey,
        (error, results) => {
          if (error) {
            //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
            logger.error(
              supportKey +
                " " +
                req.method +
                " " +
                req.url +
                " " +
                JSON.stringify(error),
              applicationkey
            );
            console.log(error);
            res.send({
              code: 400,
              message: "Failed to update donationDay information.",
            });
          } else {
            mm.executeQueryData(
              ` UPDATE ` +
                donationDayBook +
                ` SET OTP = NULL WHERE AGENT_ID = ${AGENT_ID}`,
              recordData,
              supportKey,
              (error, results) => {
                if (error) {
                  //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
                  logger.error(
                    supportKey +
                      " " +
                      req.method +
                      " " +
                      req.url +
                      " " +
                      JSON.stringify(error),
                    applicationkey
                  );
                  console.log(error);
                  res.send({
                    code: 400,
                    message: "Failed to update donationDay information.",
                  });
                } else {
                  res.send({
                    code: 200,
                    message: "DonationDay information updated successfully...",
                  });
                }
              }
            );
          }
        }
      );
    } catch (error) {
      //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
      logger.error(
        supportKey +
          " " +
          req.method +
          " " +
          req.url +
          " " +
          JSON.stringify(error),
        applicationkey
      );
      console.log(error);
    }
  }
};

function generateTokenApp(AGENT_ID, res, resultsUserAPP) {
  try {
    var dataAPP = {
      AGENT_ID: AGENT_ID,
    };

    jwt.sign({ dataAPP }, process.env.SECRET, (error, token) => {
      if (error) {
        console.log("token error", error);
        //  logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        //logger.error('APIK' + req.headers['apikey'] + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
      } else {
        res.send({
          code: 200,
          message: "Login sucessfull",
          dataAPP: [
            {
              token: token,
              UserData: resultsUserAPP,
            },
          ],
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

exports.dashBoard = (req, res) => {
  var supportKey = req.headers["supportkey"];

  try {
    var AGENT_ID = req.body.AGENT_ID;
    var sqlDash = `SELECT (select DATE from donation_day_book where ID = 1) AS DAY_START_DATE, (SELECT IFNULL(sum(AMOUNT),0) as AMOUNT from donation_master where AGENT_ID = '${AGENT_ID}' AND DATE = current_date()) AS TODAYS_DONATION_TOTAL`;

    mm.executeQuery(sqlDash, supportKey, (error, resultTotalAmount) => {
      if (error) {
        console.log(error);
        logger.error(
          supportKey +
            " " +
            req.method +
            " " +
            req.url +
            " " +
            JSON.stringify(error),
          applicationkey
        );
        res.send({
          code: 400,
          message: "Failed to get record",
        });
      } else {
        var sqlDashBoardT = `SELECT (SELECT IFNULL(sum(AMOUNT),0) as AMOUNT from donation_master where AGENT_ID = '${AGENT_ID}' and TYPE_ID = 0 and DATE = current_timestamp()) AS TODAYS_TYPE_0_TOTAL`;
        mm.executeQuery(
          sqlDashBoardT,
          supportKey,
          (error, resultDashBoardT) => {
            if (error) {
              console.log(error);
              logger.error(
                supportKey +
                  " " +
                  req.method +
                  " " +
                  req.url +
                  " " +
                  JSON.stringify(error),
                applicationkey
              );
              res.send({
                code: 400,
                message: "Failed to get record",
              });
            } else {
              var sqlDashBoardTy = `SELECT (SELECT IFNULL(sum(AMOUNT),0) as AMOUNT from donation_master where AGENT_ID = '${AGENT_ID}' and TYPE_ID = 0 and DATE = current_timestamp()) AS TODAYS_TYPE_1_TOTAL`;
              mm.executeQuery(
                sqlDashBoardTy,
                supportKey,
                (error, resultDashBoardTy) => {
                  if (error) {
                    console.log(error);
                    logger.error(
                      supportKey +
                        " " +
                        req.method +
                        " " +
                        req.url +
                        " " +
                        JSON.stringify(error),
                      applicationkey
                    );
                    res.send({
                      code: 400,
                      message: "Failed to get record",
                    });
                  } else {
                    var sqlDashBoardType = `SELECT (SELECT IFNULL(count(ITEM_NAMES),0) as ITEM_NAMES from item_donation_master where AGENT_ID = '${AGENT_ID}' and DATE = current_timestamp()) AS TODAYS_ITEM_TOTAL`;
                    mm.executeQuery(
                      sqlDashBoardType,
                      supportKey,
                      (error, resultDashBoardType) => {
                        if (error) {
                          console.log(error);
                          logger.error(
                            supportKey +
                              " " +
                              req.method +
                              " " +
                              req.url +
                              " " +
                              JSON.stringify(error),
                            applicationkey
                          );
                          res.send({
                            code: 400,
                            message: "Failed to get record",
                          });
                        } else {
                          res.send({
                            code: 200,
                            message: "Successfull displayed on dashboard",
                            TotalAmount: resultTotalAmount,
                            "DashBoardTypeId 0 ": resultDashBoardT,
                            "DashBoardTypeId 1": resultDashBoardTy,
                            "DashBoardTypeId 2": resultDashBoardType,
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  } catch (error) {
    //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
    // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey);
    console.log(error);
  }
};

function generateToken(userId, res, resultsUser) {
  try {
    var data = {
      USER_ID: userId,
    };

    jwt.sign({ data }, process.env.SECRET, (error, token) => {
      if (error) {
        console.log("token error", error);
        //  logger.error('APIK:' + req.headers['apikey'] + ' ' + supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        //logger.error('APIK' + req.headers['apikey'] + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
      } else {
        res.send({
          code: 200,
          message: "Login sucessfull",
          data: [
            {
              token: token,
              UserData: resultsUser,
            },
          ],
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

exports.getForms1 = (req, res) => {
  try {
    var userId = req.body.USER_ID;
    var supportKey = req.headers["supportkey"];
    var filter = req.body.filter ? " AND " + req.body.filter : "";

    if (userId) {
      mm.executeQuery(
        `select ROLE_ID from view_user_master where ID = '${userId}'`,
        supportKey,
        (error, results) => {
          if (error) {
            console.log(error);
            res.send({
              code: 400,
              message: "Failed to get Record.",
            });
          } else {
            if (results.length > 0) {
              mm.executeQuery(
                `select * from view_role_details where ROLE_ID = '${results[0].ROLE_ID}' ${filter} order by SEQ_NO`,
                supportKey,
                (error, results) => {
                  if (error) {
                    console.log(error);
                    res.send({
                      code: 400,
                      message: "Failed to get Record.",
                    });
                  } else {
                    res.send({
                      code: 200,
                      message: "Form Data",
                      data: results,
                    });
                  }
                }
              );
            } else {
              console.log(error);
              res.send({
                code: 400,
                message: "No user found ",
              });
            }
          }
        }
      );
    } else {
      res.send({
        code: 400,
        message: "Failed to get Record.",
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getForms = (req, res) => {
  try {
    var ROLE_ID = req.body.ROLE_ID;
    var supportKey = req.headers["supportkey"];
    //var filter = req.body.filter ? (' AND ' + req.body.filter) : ''

    if (ROLE_ID) {
      var query = `SET SESSION group_concat_max_len = 4294967290;SELECT replace(REPLACE(( CONCAT('[',GROUP_CONCAT(JSON_OBJECT('level',1,'title',m.FORM_NAME,'icon',m.ICON,'link',m.LINK,'SEQ_NO',m.SEQ_NO,'children',( IFNULL((SELECT replace(REPLACE(( CONCAT('[',GROUP_CONCAT(JSON_OBJECT('level',2,'title',FORM_NAME,'icon',ICON,'link',link,'SEQ_NO',SEQ_NO)),']')),'"[','['),']"',']') FROM view_role_details WHERE PARENT_ID = m.FORM_ID AND ROLE_ID = m.ROLE_ID  and IS_ALLOWED=1 AND SHOW_IN_MENU = 1 order by SEQ_NO ASC),'[]') )
            )),']')),'"[','['),']"',']') AS data FROM view_role_details m WHERE PARENT_ID = 0 AND ROLE_ID = ${ROLE_ID} AND IS_ALLOWED = 1 AND SHOW_IN_MENU = 1 order by SEQ_NO ASC`;

      // var query = `SET SESSION group_concat_max_len = 4294967290;
      // select replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'ROLE_ID',ROLE_ID,'FORM_ID',FORM_ID,'IS_ALLOWED',IS_ALLOWED,'SEQ_NO',SEQ_NO,'PARENT_ID',PARENT_ID,'CLIENT_ID',CLIENT_ID,'FORM_NAME',FORM_NAME,'ICON',ICON,'LINK',LINK,'subforms',(IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'ROLE_ID',ROLE_ID,'FORM_ID',FORM_ID,'IS_ALLOWED',IS_ALLOWED,'SEQ_NO',SEQ_NO,'PARENT_ID',PARENT_ID,'CLIENT_ID',CLIENT_ID,'FORM_NAME',FORM_NAME,'ICON',ICON,'LINK',LINK)),']'),'"[','['),']"',']') FROM view_role_details WHERE ROLE_ID = m.ROLE_ID and  IS_ALLOWED = 1 AND PARENT_ID = m.FORM_ID   order by SEQ_NO asc),'[]'))
      // )),']'),'"[','['),']"',']') as data FROM
      // view_role_details m Where ROLE_ID = ${ROLE_ID} AND IS_ALLOWED = 1 AND PARENT_ID = 0 order by SEQ_NO asc`

      mm.executeQuery(query, supportKey, (error, results) => {
        if (error) {
          console.log(error);
          res.send({
            code: 400,
            message: "Failed to get Record.",
          });
        } else {
          if (results.length > 0) {
            var json = results[1][0].data;
            if (json) {
              json = json.replace(/\\/g, "");
              json = JSON.parse(json);
            }
            res.send({
              code: 200,
              message: "SUCCESS",
              data: json,
            });
          } else {
            res.send({
              code: 400,
              message: "No Data",
            });
          }
        }
      });
    } else {
      res.send({
        code: 400,
        message: "Parameter missing - ROLE_ID ",
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
