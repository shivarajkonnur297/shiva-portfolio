var mysql = require('mysql');

var counter = 0;
var poolConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    timezone: 'IST',
    multipleStatements: true
}

exports.openConnection = () => {
    var connection = mysql.createConnection(poolConfig);
    counter += 1;

    connection.connect();
    connection.beginTransaction((error)=>{
        if(error)
        console.log("Transaction error : ",error);
    });

    return connection;
}

exports.closeConnection = (connection) => {
    try {
        connection.release();
    } catch (error) {
    }
}

exports.getDB = () => {

    var connection = mysql.createConnection(poolConfig);
    counter += 1;
    connection.connect();
   
    console.log("counter : " + counter);
    return connection;
}

exports.executeDDL = (query, supportKey, callback) => {
    var con = this.openConnection();
    //counter += 1;
    // console.log("Counter = " + counter);
    try {
        //   console.log(query);

        con.query(query, callback);
        //console.log(dbConfig.getDB().query(query));
        //if(JSON.stringify(query).startsWith('UPDATE'))
        // if (supportKey)
        //     logger.database(supportKey + " " + query, supportKey);

    } catch (error) {
        console.log("Error : -" + error)
    }
    finally {
        con.end();
    }
}

exports.executeDQL = (query, supportKey, callback) => {
    // var con = this.openConnection();
    //counter += 1;
    // console.log("Counter = " + counter);
   
    try {
        var connection = mysql.createConnection(poolConfig);
        counter += 1;
    
        connection.connect();
         //console.log(query);
         connection.query(query, callback);
        //console.log(dbConfig.getDB().query(query));
        //if(JSON.stringify(query).startsWith('UPDATE'))
        // if (supportKey)
        //     logger.database(supportKey + " " + query, supportKey);

    } catch (error) {
        console.log("Error : -" + error)
    }
    finally {
        connection.end();
    }
}

exports.executeDML = (query, values, supportKey, con, callback) => {

    //counter += 1;
    // console.log("Counter = " + counter);
    try {
         //console.log(query,values);
        con.query(query, values, callback);
        // if (supportKey)
        //     logger.database(supportKey + " " + query, supportKey);
    } catch (error) {
        console.log("Error : -" + error)
    }
    finally { }
}

exports.executeDMLPromise = (query, values, supportKey, con) => {
    try {

    return new Promise((resolve) =>{
        con.query(query, values, function (err, rows, fields) {
            if (err) {
                console.log(err)
                resolve("ERROR");
            }
   //console.log(query, values,rows)
            resolve(rows);
        });
    })
} catch (error) {
    console.log("Error : -" + error);
    return '';
}

}

exports.rollbackConnection = (connection) => {
    try {
        connection.rollback(function () {

            connection.end();
        });
    } catch (error) {
        // console.log("Exception in rollbackConnection : ", error);
    }
}

exports.commitConnection = (connection) => {
    try {

        connection.commit(function () {
            connection.end();
        });
    } catch (error) {
        // console.log("Exception in rollbackConnection : ", error);
    }
}