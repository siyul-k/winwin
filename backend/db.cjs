const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'N190727$$', // ← 본인의 MySQL 비밀번호 입력
  database: 'winwin'
});

module.exports = connection;
