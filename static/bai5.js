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