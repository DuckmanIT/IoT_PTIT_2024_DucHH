const express = require('express');
const bodyParser = require('body-parser');

const { chart } = require('./static/chart');

const router = express.Router();

router.use(bodyParser.json());


// Khai báo client MQTT
const client = mqtt.connect("mqtt://localhost:1884", {
  username: "b21dccn240",
  password: "12345678",
});

client.on("message", (topic, payload) => {
  // Kiểm tra xem topic có phải là "iot" hay không
  if (topic === "iot") {
    // Lấy dữ liệu từ thông điệp
    const data = JSON.parse(payload);

    // Thay đổi giá trị của data1
    data1 = data.nd;

    // Thay đổi giá trị của data2
    data2 = data.da;

    // Thay đổi giá trị của data3
    data3 = data.as;

    // Gọi hàm updateChart() để cập nhật biểu đồ
    chartaddData(data1, data2, data3);

  }
});

client.on("message", (topic, payload) => {
  // Kiểm tra xem topic có phải là "iot" hay không
  if (topic === "iot") {
    // Lấy dữ liệu từ thông điệp
    const data = JSON.parse(payload);

    // Thay đổi giá trị của data1
    data1 = data.nd;

    // Thay đổi giá trị của data2
    data2 = data.da;

    // Thay đổi giá trị của data3
    data3 = data.as;

    // Gọi hàm updateChart() để cập nhật biểu đồ
    chartaddData(data1, data2, data3);

  }
});


// Xử lý yêu cầu POST
router.post('/publish_den', (req, res) => {
  // Lấy thông điệp từ frontend
  const message = req.body;
  console.log(message);

  // Xuất bản thông điệp lên MQTT broker
  client.publish("ledcontrol", String(message.data), {
    qos: 0,
  });

  // Trả về kết quả
  res.status(200).send("Thông điệp đã được publish thành công");
});


module.exports = router;