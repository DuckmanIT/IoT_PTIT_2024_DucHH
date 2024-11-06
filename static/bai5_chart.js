var ctx = document.getElementById('windChart').getContext('2d');

var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Danh sách thời gian
        datasets: [{
            label: 'Tốc độ gió',
            data: [], // Danh sách giá trị tốc độ gió
            borderColor: 'green',
            fill: false
        }]
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

// Hàm để thêm dữ liệu mới vào biểu đồ với thời gian thực hệ thống
function addData(windSpeed, time) {
    console.log(windSpeed, time);
    
    var label = time;

    // Giới hạn số lượng giá trị trên biểu đồ thành 10
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(windSpeed);

    chart.update();
}

const socket = new WebSocket('ws://localhost:2210'); // Thay đổi URL kết nối tới địa chỉ máy chủ của bạn

socket.onopen = (event) => {
    console.log('Connected to server');
};

socket.onmessage = (event) => {
    try {
        // Phân tích chuỗi JSON thành một đối tượng
        console.log(event.data);
        const data = JSON.parse(event.data.replace(/'/g, '"'));
  
        // Truy cập thông số tốc độ gió
        const windSpeed = data.wind_speed;
        
        const current_time = Date.now();
        const gmtNow = new Date(current_time);
        const haNoiNow = new Date(gmtNow.getTime());
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(haNoiNow);

        addData(windSpeed, formattedTime);
  
        console.log(`Received data - Wind Speed: ${windSpeed}`);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
};

socket.onclose = (event) => {
    console.log('Connection closed');
};

function init() {
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/get-wind-speed-data';
    var data = { 'start': 0, 'end': 10 };
    var jsonData = JSON.stringify(data);

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Xử lý dữ liệu trả về tại đây
            var responseData = JSON.parse(xhr.responseText);
            for(var i = 0; i < responseData.length; i++) {
                var item = responseData[i];
                const windSpeed = item.wind_speed;
                const time = item.time;

                const date = new Date(time);

                // Định dạng lại thời gian
                const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

                addData(windSpeed, formattedTime);
            }
        }
    };

    xhr.send(jsonData);
}

init();
