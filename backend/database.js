const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '271819nb',
  database: 'askhub',
  port: 3306
});

connection.connect((err) => {
    err ? console.error('Erro de conexão:', err) : console.log('database.js diz: Conectado ao banco de dados askhub');
});

module.exports = connection;