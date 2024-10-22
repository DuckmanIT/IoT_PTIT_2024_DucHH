from PyQt5.QtCore import QThread, QMutex

# Biến toàn cục
x = 10

# Luồng QThread
class MyThread(QThread):
    def run(self):
        # Thay đổi giá trị của biến toàn cục
        global x
        x = 20

# Khởi tạo luồng QThread
thread = MyThread()
thread.start()

# In giá trị của biến toàn cục
print(x)