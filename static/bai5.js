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

// Hàm cập nhật thông tin Wind Speed và Warning
function updateWindSpeedAndWarning(windSpeed) {
  const windSpeedBox = document.getElementById('windSpeedBox');
  const alertBox = document.getElementById('alertBox');

  // Cập nhật Wind Speed
  windSpeedBox.textContent = `Wind Speed: ${windSpeed} m/s`;

  // Cập nhật cảnh báo
  if (windSpeed >= 60) {
      alertBox.textContent = 'Warning: High Wind Speed!';
      alertBox.classList.add('blink');
  } else {
      alertBox.textContent = 'Warning: No Warning';
      alertBox.classList.remove('blink');
  }
}

// Thêm hiệu ứng nhấp nháy cho cảnh báo
const css = `
.alert-box.blink {
  background-color: red;
  color: white;
  animation: blink 1s infinite;
}
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}`;
const style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);
