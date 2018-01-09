const mysql = require('mysql');
const config = require('../config/default');
const Users=require('../sql_model/users');

const pool = mysql.createPool({
    host: config.database.HOST,
    port: config.database.PORT,
    user: config.database.USERNAME,
    password: config.database.PASSWORD
});

let query = (sql, values) => {
    return new Promise((resolve, rejeact) => {
        pool.getConnection((err, connection) => {
            if (err) {
                resolve(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        resolve(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release();
                })
            }
        })
    })
};

let createTable=(sql)=>{
    return query(sql,[]);
};

createTable(Users);

//注册用户
const registerData=(value)=>{
    var _sql="insert into users set name=?,password=?";
    return query(_sql,value);
};

module.exports={
    query,
	createTable,
    registerData
}