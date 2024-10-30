const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 2209 });
const database = require('./database');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
// Lưu trữ danh sách các kết nối WebSocket
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Thêm kết nối mới vào danh sách
  clients.add(ws);

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });
  
  ws.on('close', () => {
    // Xóa kết nối đó khỏi danh sách khi nó đóng
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// Hàm gửi thông điệp đến tất cả các kết nối WebSocket
function broadcast(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}


const mqtt = require('mqtt');
// Thông tin kết nối MQTT
const brokerUrl = 'mqtt://localhost:1884';
const options = {
  username: 'b21dccn240',
  password: '12345678',
};

// Tạo kết nối MQTT
const mqttClient = mqtt.connect(brokerUrl, options);

// Lắng nghe chủ đề MQTT
mqttClient.on('connect', () => {
  mqttClient.subscribe('iot');
});

// Xử lý thông điệp từ MQTT và gửi đến WebSocket
mqttClient.on('message', (topic, message) => {
  const messageText = message.toString();

  try {
    // Phân tích chuỗi JSON thành một đối tượng
    const data = JSON.parse(messageText.replace(/'/g, '"'));

    // Truy cập từng thông số
    const temperature_data = data.temperature;
    const humidity_data = data.humidity;
    const light_data = data.light;

    const dataToInsert = {
      temperature: temperature_data,
      humidity: humidity_data,
      light: light_data,
    };
    console.log(dataToInsert);
    
    database.insertData(dataToInsert, (err, results) => {
      if (err) throw err;
      console.log('Inserted ' + results.affectedRows + ' rows');
    });

  }catch (error) {
  }
  // Gửi thông điệp đến tất cả kết nối WebSocket
  broadcast(messageText);
});

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'static')));

// Sử dụng middleware express.static để cung cấp tài nguyên tĩnh từ thư mục 'static'
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'trang_chu.html'));
});

// Tạo tuyến đường API
app.post('/api/add-data', (req, res) => {
  // Thực hiện xử lý logic API ở đây
  const humidity = req.body.humidity;
  const temperature = req.body.temperature;
  const light = req.body.light;

  const dataToInsert = {
    humidity : humidity,
    temperature : temperature, 
    light : light
  };

  database.insertData(dataToInsert, (err, results) => {
    if (err) throw err;
    console.log('Inserted ' + results.affectedRows + ' rows');
  });

  const data = {'meassage' : "Insert success"};

  res.json(data);

});

app.post('/api/light', (req, res) => {

  const time = req.body.time;
  const client_name = req.body.client_name;
  const action_name = req.body.action_name;

  var state = "Success";

  if (action_name == "tắt đèn") {
    try {
      mqttClient.publish("led_control", "0");
    }catch (err) {
      state = "Error";
    }
  }
  else {
    try {
      mqttClient.publish("led_control", "1");
    }catch (err) {
      state = "Error";
    }
  }

  const dataToInsert = {
    time : time,
    client_name : client_name,
    action_name : action_name,
    state : state
  }

  database.insertHistory(dataToInsert, (err, results) => {
    if (err) throw err;
    console.log('Inserted ' + results.affectedRows + ' rows');
  });

  res.json({'state' : state});
})

app.post('/api/fan', (req, res) => {

  const time = req.body.time;
  const client_name = req.body.client_name;
  const action_name = req.body.action_name;

  var state = "Success";

  if (action_name == "tắt quạt") {
    try {
      mqttClient.publish("fan_control", "0");
    }catch (err) {
      state = "Error";
    }
  }
  else {
    try {
      mqttClient.publish("fan_control", "1");
    }catch (err) {
      state = "Error";
    }
  }

  const dataToInsert = {
    time : time,
    client_name : client_name,
    action_name : action_name,
    state : state
  }

  database.insertHistory(dataToInsert, (err, results) => {
    if (err) throw err;
    console.log('Inserted ' + results.affectedRows + ' rows');
  });

  res.json({'state' : state});

})

app.post('/api/airconditioner', (req, res) => {

  const time = req.body.time;
  const client_name = req.body.client_name;
  const action_name = req.body.action_name;

  var state = "Success";

  if (action_name == "tắt điều hòa") {
    try {
      mqttClient.publish("led2_control", "0");
    }catch (err) {
      state = "Error";
    }
  }
  else {
    try {
      mqttClient.publish("led2_control", "1");
    }catch (err) {
      state = "Error";
    }
  }

  const dataToInsert = {
    time : time,
    client_name : client_name,
    action_name : action_name,
    state : state
  }

  database.insertHistory(dataToInsert, (err, results) => {
    if (err) throw err;
    console.log('Inserted ' + results.affectedRows + ' rows');
  });

  res.json({'state' : state});

})

app.post('/api/get-data', (req, res) => {
  // Thực hiện xử lý logic API ở đây

  start = req.body.start
  end = req.body.end
  const dataToGet = {
    start : start,
    end : end
  }

  database.getData(dataToGet, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.json(results);
  })
  // Gửi dữ liệu trả lời cho client

});

app.post('/api/so-lan-den', (req, res) => {
    data = {};
    database.getSoLanDen( data, (err, results) => {
      if (err) throw err;
      console.log(results);
      const so_lan = results[0]['COUNT(*)'];
      console.log(so_lan);
      res.json({'lan_den':so_lan});
    })
});

app.post('/api/so-lan-quat', (req, res) => {
  data = {};
  database.getSoLanQuat( data, (err, results) => {
    if (err) throw err;
    console.log(results);
    const so_lan = results[0]['COUNT(*)'];
    console.log(so_lan);
    res.json({'lan_quat':so_lan});
  })
});

app.post('/api/so-lan-dieu-hoa', (req, res) => {
  data = {};
  database.getSoLanDieuHoa( data, (err, results) => {
    if (err) throw err;
    console.log(results);
    const so_lan = results[0]['COUNT(*)'];
    console.log(so_lan);
    res.json({'lan_dieu_hoa':so_lan});
  })
});

app.post('/api/get-history', (req, res) => {
  // Thực hiện xử lý logic API ở đây

  start = req.body.start
  end = req.body.end
  const dataToGet = {
    start : start,
    end : end
  }

  database.getHistory(dataToGet, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.json(results);
  })
  // Gửi dữ liệu trả lời cho client

});

app.delete('/api/delete-data', (req, res) => {
  // Thực hiện xử lý logic API ở đây
  const id = req.body.id

  const dataToDelete = {
    id : id
  }

  database.deleteData(dataToDelete, (err, results) => {
    if (err) throw err;
    res.json({'message' : "Delete success"});
})


});

app.put('/api/update-data', (req, res) => {
  // Thực hiện xử lý logic API ở đây
  const humidity = req.body.humidity;
  const temperature = req.body.temperature;
  const light = req.body.light;
  const id = req.body.id

  const dataToUpdate = {
    humidity : humidity,
    temperature : temperature, 
    light : light,
    id : id
  };

  database.updateData(dataToUpdate, (err, results) => {
    if (err) throw err;
    res.json({'message' : "Update success"});
  })

});

app.post('/api/search-data', (req, res) => {
  const condition = req.body.condition;
  const orderby = req.body.orderby;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const dataToSearch = {
      condition: condition,
      orderby: orderby,
      startDate: startDate,
      endDate: endDate
  };

  database.searchData(dataToSearch, (err, results) => {
      if (err) throw err;
      res.json(results);
  });
});




// Rest of your WebSocket code

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});