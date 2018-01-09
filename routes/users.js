const userModel=require('../lib/mysql');
const md5=require('md5');
const moment=require('moment');
const fs=require('fs');
const users=async (ctx,next)=>{
  ctx.body = 'this is a users response!'
}

module.exports = {
  users
}
