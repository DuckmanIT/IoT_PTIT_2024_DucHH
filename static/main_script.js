function changeStatus(active) {
    let stt = document.getElementById("light_image");
    let lt = document.getElementById("light_control");
    data = {};
    const current_time = Date.now();
    const gmtNow = new Date(current_time);
    const haNoiNow = new Date(gmtNow.getTime() + (7 * 3600 * 1000));
    const formattedTime = haNoiNow.toISOString().slice(0, 19).replace('T', ' ');
    if (active == "turn_off") {
        data = {'time' : formattedTime, 'client_name' : 'Duc HH', 'action_name' : 'tắt đèn'};
    }
    else {
        data = {'time' : formattedTime, 'client_name' : 'Duc HH', 'action_name' : 'bật đèn'};
    }

    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/light';
    var jsonData = JSON.stringify(data);

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            if (responseData.state == "Success") {
                if(active == "turn_on") {
                    stt.src = "den_sang.png"
                    stt.value = "on"
                    lt.src = "on.png";
                    lt.onclick = function () {
                        changeStatus('turn_off');
                    };
                    
                }
                else {
                    stt.src = "den_toi.png"
                    stt.value = "off"
                    lt.src = "off.png";
                    lt.onclick = function () {
                        changeStatus('turn_on');
                    };
                }
            }
            else {
                alert("Thay đổi trạng thái đèn thất bại");
            }
            
        }
    };

    xhr.send(jsonData);

    capNhatSoLanDen();
    capNhatSoLanQuat();
    capNhatSoLanDieuHoa();
}

function changeStatusFan(active) {
    let lt = document.getElementById("fan_control");

    data = {};
    const current_time = Date.now();
    const gmtNow = new Date(current_time);
    const haNoiNow = new Date(gmtNow.getTime() + (7 * 3600 * 1000));
    const formattedTime = haNoiNow.toISOString().slice(0, 19).replace('T', ' ');
    if (active == "turn_off") {
        data = {'time' : formattedTime, 'client_name' : 'Duc HH', 'action_name' : 'tắt quạt'};
    }
    else {
        data = {'time' : formattedTime, 'client_name' : 'Duc HH', 'action_name' : 'bật quạt'};
    }

    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/fan';
    var jsonData = JSON.stringify(data);

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            if (responseData.state == "Success") {
                if(active == "turn_on") {
                    document.getElementById("fan_img").style.animation = "spin 1.5s linear infinite";
                    lt.src = "on.png";
                    lt.onclick = function () {
                        changeStatusFan('turn_off');
                    };;
                }
                else {
                    document.getElementById("fan_img").style.animation = "none";
                    lt.src = "off.png";
                    lt.onclick = function () {
                        changeStatusFan('turn_on');
                    };
                }
                
            }
            else {
                alert("Thay đổi trạng thái đèn thất bại");
            }
            
        }
    };

    xhr.send(jsonData);

    capNhatSoLanDen();
    capNhatSoLanQuat();
    capNhatSoLanDieuHoa();
}

function changeStatusAirConditioner(active) {
    let lt = document.getElementById("led2_control");

    data = {};
    const current_time = Date.now();
    const gmtNow = new Date(current_time);
    const haNoiNow = new Date(gmtNow.getTime() + (7 * 3600 * 1000));
    const formattedTime = haNoiNow.toISOString().slice(0, 19).replace('T', ' ');
    if (active == "turn_off") {
        data = {'time' : formattedTime, 'client_name' : 'Duc HH', 'action_name' : 'tắt điều hòa'};
    }
    else {
        data = {'time' : formattedTime, 'client_name' : 'Duc HH', 'action_name' : 'bật điều hòa'};
    }

    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/airconditioner';
    var jsonData = JSON.stringify(data);

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            if (responseData.state == "Success") {
                if(active == "turn_on") {
                    document.getElementById("air_conditioner_img").style.animation = "spin 1.5s linear infinite";
                    lt.src = "on.png";
                    lt.onclick = function () {
                        changeStatusAirConditioner('turn_off');
                    };;
                }
                else {
                    document.getElementById("air_conditioner_img").style.animation = "none";
                    lt.src = "off.png";
                    lt.onclick = function () {
                        changeStatusAirConditioner('turn_on');
                    };
                }
                
            }
            else {
                alert("Thay đổi trạng thái đèn thất bại");
            }
            
        }
    };

    xhr.send(jsonData);

    capNhatSoLanDen();
    capNhatSoLanQuat();
    capNhatSoLanDieuHoa();
}

const toggleButton = document.getElementById('toggleButton');
const sidebar = document.querySelector('.sidebar');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Ẩn sidebar khi nhấp vào bên ngoài
document.addEventListener('click', (event) => {
  // Kiểm tra xem click có nằm trong sidebar hoặc toggleButton không
  if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
    sidebar.classList.remove('active');
  }
});

const text_lan_den = document.getElementById("lan_den");
const text_lan_quat = document.getElementById("lan_quat");
const text_lan_dieu_hoa = document.getElementById("lan_dieu_hoa");
function capNhatSoLanDen() {

    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/so-lan-den';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            console.log(responseData);
            var lan_den = responseData.lan_den;
            console.log(lan_den);
            text_lan_den.innerHTML = lan_den;
        }
    };

    xhr.send();
}

function capNhatSoLanQuat() {

    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/so-lan-quat';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);

            console.log(responseData);
            var lan_quat = responseData.lan_quat;
            console.log(lan_quat);
            text_lan_quat.innerHTML = lan_quat;
        }
    };

    xhr.send();
}

function capNhatSoLanDieuHoa() {

    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/so-lan-dieu-hoa';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);

            console.log(responseData);
            var lan_dieu_hoa = responseData.lan_dieu_hoa;
            console.log(lan_dieu_hoa);
            text_lan_dieu_hoa.innerHTML = lan_dieu_hoa;
        }
    };

    xhr.send();
}

capNhatSoLanDen()
capNhatSoLanQuat()
capNhatSoLanDieuHoa()
