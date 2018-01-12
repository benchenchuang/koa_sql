const mysql = require('mysql');
const config = require('../config/default');
const users=require('../sql_model/users');
const banners=require('../sql_model/banners');

const pool = mysql.createPool({
    host: config.database.HOST,
    port: config.database.PORT,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database:config.database.DATABASE
});

let query = ( sql, values ) => {
      return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
          if (err) {
            reject( err )
          } else {
            connection.query(sql, values, ( err, rows) => {
              if ( err ) {
                reject( err )
              } else {
                resolve( rows )
              }
              connection.release()
            })
          }
        })
      })
    }


let createTable=(sql)=>{
    return query(sql,[]);
};
// 建表
createTable(users);
createTable(banners);

//注册用户
const registerData=(value)=>{
    let _sql = "insert into users set username=?,password=?,moment=?";
    return query(_sql,value);
};
//根据用户名查询用户
const findByName=(name)=>{
    let _sql=`select * from users where username="${name}"`;
    return query(_sql);
}
//更新用户信息
const updateUser=(value)=>{
  let _sql = "update users set password=?,avator=?  where id=?"
  return query( _sql, value )
}
//只修改头像
const updateAvatar=(value)=>{
  let _sql = "update users set avator=? where id=?"
  return query( _sql, value )
}
//获取所有banners
const getBanners=(type)=>{
  if(type){
    let _sql=`select * from banners where online='1' order by -id`;
    return query(_sql);
  }else{
    let _sql=`select * from banners order by -id`;
    return query(_sql);
  }
};
//根据页数和数量查询内容
const getPageBanners=(page,limit)=>{
  let _sql=`select * from banners order by -id limit ${(page-1)*limit},${limit}`;
  return query(_sql);
};
//创建新banner
const createBanner=(value)=>{
  let _sql = "insert into banners set name=?,content=?,url=?,pic=?,online=?,moment=?";
  return query(_sql,value);
};
//删除banner
const deleteBanner=(id)=>{
  let _sql = `delete from banners where id=${id}`;
  return query( _sql)
};
//根据id 查询banner
const bannerById=(id)=>{
  let _sql=`select * from banners where id=${id}`;
  return query(_sql);
};
//更新banner信息
const updateBanner=(id,value)=>{
  let _sql="update banners set name=?, content=?, url=?, pic=?, online=?, moment=? where id="+id;
  return query(_sql,value);
}

module.exports={
    query,
	  createTable,
    registerData,
    findByName,
    updateUser,
    updateAvatar,
    createBanner,
    getBanners,
    deleteBanner,
    getPageBanners,
    bannerById,
    updateBanner
}