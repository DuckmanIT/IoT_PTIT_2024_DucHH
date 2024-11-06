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
    let searchQuery = "SELECT * FROM data";
    const queryParams = [];

    if (condition.condition) {
        if (condition.orderby === 'time') {
            // Tìm kiếm với thời gian chính xác, không dùng LIKE
            searchQuery += " WHERE DATE_FORMAT(time, '%m/%d/%Y, %h:%i:%s %p') = ?";
            queryParams.push(condition.condition);
        } else {
            searchQuery += " WHERE " + condition.orderby + " = ?";
            queryParams.push(condition.condition);
        }
    }

    const page = condition.page || 1;
    const pageSize = condition.pageSize || 10;
    const offset = (page - 1) * pageSize;

    searchQuery += " ORDER BY time DESC LIMIT ? OFFSET ?";
    queryParams.push(pageSize, offset);

    console.log("Truy vấn SQL:", searchQuery);
    console.log("Tham số:", queryParams);

    connection.query(searchQuery, queryParams, callback);
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

  getHistory: (data, callback) => {
    let getQuery = "SELECT * FROM action";
    const queryParams = [];
  
    if (data.exact_time) {
      // Nếu có `exact_time`, thêm điều kiện tìm kiếm vào truy vấn
      getQuery += " WHERE DATE_FORMAT(time, '%m/%d/%Y, %h:%i:%s %p') = ?";
      queryParams.push(data.exact_time);
    }
  
    // Tính toán phân trang
    const page = data.page || 1; 
    const pageSize = data.pageSize || 10;
    const offset = (page - 1) * pageSize;
  
    getQuery += " ORDER BY time DESC LIMIT ? OFFSET ?";
    queryParams.push(pageSize, offset);
  
    console.log("Truy vấn SQL:", getQuery);
    console.log("Tham số:", queryParams);
  
    connection.query(getQuery, queryParams, callback);
  },

  insertHistory : (data, callback) => {
    const insertQuery = "INSERT INTO action (time, client_name, action_name, state) VALUES (?, ?, ?, ?)";
    connection.query(insertQuery, [data.time, data.client_name, data.action_name, data.state], callback);
  },

  getWindSpeedData: (data, callback) => {
    const getQuery = "SELECT * FROM wind_speed ORDER BY time DESC LIMIT ?, ?";
    connection.query(getQuery, [data.start, data.end - data.start], callback);
  },

  insertWindSpeed: (windSpeed, callback) => {
    const current_time = Date.now();
    const gmtNow = new Date(current_time);
    const haNoiNow = new Date(gmtNow.getTime() + (7 * 3600 * 1000));
    const formattedTime = haNoiNow.toISOString().slice(0, 19).replace('T', ' ');
    const insertQuery = "INSERT INTO wind_speed (wind_speed, time) VALUES (?, ?)";
    connection.query(insertQuery, [windSpeed.wind_speed, formattedTime], callback);
  },

  getWindSpeedHistory: (data, callback) => {
    let getQuery = "SELECT * FROM wind_speed";
    const queryParams = [];

    if (data.exact_time) {
      getQuery += " WHERE DATE_FORMAT(time, '%m/%d/%Y, %h:%i:%s %p') = ?";
      queryParams.push(data.exact_time);
    }

    const page = data.page || 1;
    const pageSize = data.pageSize || 10;
    const offset = (page - 1) * pageSize;

    getQuery += " ORDER BY time DESC LIMIT ? OFFSET ?";
    queryParams.push(pageSize, offset);

    console.log("Truy vấn SQL:", getQuery);
    console.log("Tham số:", queryParams);

    connection.query(getQuery, queryParams, callback);
  }
};