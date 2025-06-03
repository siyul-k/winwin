const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',       // XAMPP 기본은 빈 문자열
  database: 'winwin'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL 연결 실패:', err);
  } else {
    console.log('✅ MySQL 연결 성공!');
  }
});

module.exports = connection;
