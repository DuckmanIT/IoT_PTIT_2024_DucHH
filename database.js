// database.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'iot',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = {
  insertData: (data, callback) => {
    const current_time = Date.now();
    const gmtNow = new Date(current_time);
    const haNoiNow = new Date(gmtNow.getTime() + (7 * 3600 * 1000));
    const formattedTime = haNoiNow.toISOString().slice(0, 19).replace('T', ' ');
    const insertQuery = 'INSERT INTO data (temperature, humidity, light, time) VALUES (?, ?, ?, ?)';
    connection.query(insertQuery, [data.temperature, data.humidity, data.light, formattedTime], callback);
  },

  searchData: (condition, callback) => {
    var searchQuery = "";
    if (condition.condition == "") {
      searchQuery = 'SELECT * FROM data';
    }
    else {
      searchQuery = 'SELECT * FROM data WHERE ' + condition.orderby +  ' = ' + condition.condition;
    }
      
    console.log(condition);
    connection.query(searchQuery,  callback);
  },

  getData :(data, callback) => {
    const getQuery = "SELECT * FROM data ORDER BY time DESC LIMIT ?, ?";
    connection.query(getQuery, [data.start, data.end - data.start], callback);
  },

  getSoLanDen : (data, callback) => {
    const query = 'SELECT COUNT(*) FROM iot.action as lan_den WHERE action_name = "bật đèn"';
    connection.query(query, callback);
  },

  getSoLanQuat : (data, callback) => {
    const query = 'SELECT COUNT(*) FROM iot.action as lan_den WHERE action_name = "bật quạt"';
    connection.query(query, callback);
  },

  getSoLanDieuHoa : (data, callback) => {
    const query = 'SELECT COUNT(*) FROM iot.action as lan_dieu_hoa WHERE action_name = "bật điều hòa"';
    connection.query(query, callback);
  },

  deleteData : (data, callback) => {
    const deleteQuery = "DELETE FROM data WHERE id = ?";
    connection.query(deleteQuery, [data.id], callback);
  },

  updateData : (data, callback) => {
    const updateQuery = "UPDATE data SET temperature = ?, humidity = ?, light = ? WHERE id = ?";
    connection.query(updateQuery, [data.temperature, data.humidity, data.light, data.id], callback);
  },

  getHistory : (data, callback) => {
    const getQuery = "SELECT * FROM action ORDER BY time DESC LIMIT ?, ?";
    connection.query(getQuery, [data.start, data.end], callback);
  },

  insertHistory : (data, callback) => {
    const insertQuery = "INSERT INTO action (time, client_name, action_name, state) VALUES (?, ?, ?, ?)";
    connection.query(insertQuery, [data.time, data.client_name, data.action_name, data.state], callback);
  }
};