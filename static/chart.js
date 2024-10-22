

var ctx = document.getElementById('myChart').getContext('2d');
var ten_o = ["o_nd", "o_da", "o_as"]
var ten_anh = ["nd_img", "da_img", "as_img"]
var thong_tin = ["nd", "da", "as"]
var thong_bao = ["tb_nd", "tb_da", "tb_as"]
var nd_thong_bao = [
    ["Lạnh", "Mát mẻ", "Nóng"],
    ["Khô hạn", "Thoáng mát", "Ẩm ướt"],
    ["Tối", "Vừa phải", "Chói mắt"]
]

var moc_anh = [
    ["lanh.png", "am.png", "nong.png"],
    ["kho.png", "am_vua_phai.png", "am_uot.png"],
    ["mat-troi.png", "mat-troi.png", "mat-troi.png"]
]

var moc_mau = [
    ["#FF3366", "#BB0000", "#770000"],
    ["#0000EE", "#0000DD", "#003399"],
    ["#FFCC66", "#FFCC33", "#FFCC00"]
]

var moc = [
    [20, 40],
    [30, 60],
    [30, 60]
]
        
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Danh sách thời gian
        datasets: [{
            label: 'Nhiệt độ',
            data: [], // Danh sách giá trị dữ liệu
            borderColor: 'red',
            fill: false
        },
        {
            label: 'Độ ẩm',
            data: [], // Danh sách giá trị dữ liệu
            borderColor: 'blue',
            fill: false
        },
        {
            label: 'Ánh sáng',
            data: [], // Danh sách giá trị dữ liệu
            borderColor: 'yellow',
            fill: false
        }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});

function thayDoi(i, value) {
    var loai;
    if(value < moc[i][0]) {
        loai = 0;
    }
    else {
        if (value < moc[i][1]) {
            loai = 1;
        }
        else {
            loai = 2;
        }
    }

    var anh = document.getElementById(ten_anh[i]);
    anh.src = moc_anh[i][loai];
    var tb = document.getElementById(thong_bao[i]);
    tb.innerHTML = nd_thong_bao[i][loai];
    var tt = document.getElementById(thong_tin[i]);
    tt.innerHTML = value;
    var o = document.getElementById(ten_o[i]);
    o.style.backgroundColor = moc_mau[i][loai];
}

// Hàm để thêm dữ liệu mới vào biểu đồ với thời gian thực hệ thống
function addData(d1, d2, d3, time) {
    var label = time;
    var data1 = d1;// Dữ liệu ngẫu nhiên cho Đường 1
    var data2 = d2; // Dữ liệu ngẫu nhiên cho Đường 2
    var data3 = d3; // Dữ liệu ngẫu nhiên cho Đường 3

    // Giới hạn số lượng giá trị trên biểu đồ thành 10
    if (this.chart.data.labels.length > 10) {
        this.chart.data.labels.shift();
        this.chart.data.datasets[0].data.shift();
        this.chart.data.datasets[1].data.shift();
        this.chart.data.datasets[2].data.shift();
    }

    this.chart.data.labels.push(label);
    this.chart.data.datasets[0].data.push(data1);
    this.chart.data.datasets[1].data.push(data2);
    this.chart.data.datasets[2].data.push(data3);

    thayDoi(0, data1);
    thayDoi(1, data2);
    thayDoi(2, data3);

    this.chart.update();
}
 
const socket = new WebSocket('ws://localhost:2209'); // Thay đổi URL kết nối tới địa chỉ máy chủ của bạn

socket.onopen = (event) => {
    console.log('Connected to server');
};

socket.onmessage = (event) => {
    try {
        // Phân tích chuỗi JSON thành một đối tượng
        console.log(event.data);
        const data = JSON.parse(event.data.replace(/'/g, '"'));
  
        // Truy cập từng thông số
        const temperature = data.temperature;
        const humidity = data.humidity;
        const light = data.light;
        
        const current_time = Date.now();
        const gmtNow = new Date(current_time);
        const haNoiNow = new Date(gmtNow.getTime());
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const formattedTime = new Intl.DateTimeFormat('en-US', options).format(haNoiNow);

        addData(temperature, humidity, light/100, formattedTime);
  
        console.log(`Received data - Temperature: ${temperature}, Humidity: ${humidity}, Light: ${light}`);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }

};

socket.onclose = (event) => {
    console.log('Connection closed');
};

function sendMessage() {
    const message = 'Hello, Server!';
    socket.send(message);
}

function init() {
        
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/get-data';
    var data = { 'start': 0, 'end': 10 };
    var jsonData = JSON.stringify(data);

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Xử lý dữ liệu trả về tại đây
            var responseData = JSON.parse(xhr.responseText);
            for(var i = 0; i < responseData.length; i++) {
                var item = responseData[i]
                const temperature = item.temperature;
                const humidity = item.humidity;
                const light = item.light;
                const time = item.time;

                const date = new Date(time);

                // Định dạng lại thời gian
                const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

                addData(temperature, humidity, light/100,formattedTime);
            }
        }
    };

    xhr.send(jsonData);
}

// function makeElementsBlinkRed() {
//     // Lấy tất cả các phần tử có lớp "o_as", "o_nd", và "o_da"
//     var elements = document.querySelectorAll("#o_as, #o_nd, #o_da");

//     // Đặt lặp qua từng phần tử và áp dụng lớp CSS để nhấp nháy màu đỏ
//     elements.forEach(function (element) {
//         element.classList.add("blink-red");
//     });
// }

// // Gọi hàm để làm cho các phần tử nhấp nháy màu đỏ
// makeElementsBlinkRed();

init()

