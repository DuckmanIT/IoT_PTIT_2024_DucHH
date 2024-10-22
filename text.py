import cv2
import numpy as np
import matplotlib.pyplot as plt
#Đọc ảnh
image = cv2.imread(r'D:\Download_d\anhXam.png', cv2.IMREAD_GRAYSCALE)

#Hiển thị ảnh nhiễu (a)
cv2.imshow('Ảnh nhiễu (a)', image)

# Tính và vẽ histogram (b) cho ảnh a
plt.hist(image.ravel(), bins=256, range=[0, 256])
plt.xlabel('Pixel Value')
plt.ylabel('Frequency')
plt.title('Histogram of Noisy Image (b)')
plt.show()

# Tạo mask (c)
gradient_x = cv2.Sobel(image, cv2.CV_64F, 1, 0, ksize=3)
gradient_y = cv2.Sobel(image, cv2.CV_64F, 0, 1, ksize=3)
gradient_magnitude = np.sqrt(gradient_x**2 + gradient_y**2)
threshold = np.percentile(gradient_magnitude, 99.7)
mask = (gradient_magnitude >= threshold).astype(np.uint8)
cv2.imshow('Mask Image (c)', mask.astype(np.uint8) * 255)

#Tạo ảnh (d) là tích của ảnh nhiễu a và mask c
image_d = cv2.multiply(image, mask)
cv2.imshow('Image (d) formed by (a) and (c)', image_d)

#Hiển thị lược đồ xám (e) của d
nonzero_pixels = image_d[image_d != 0]
plt.hist(nonzero_pixels.ravel(), bins=256, range=[0, 256])
plt.xlabel('Pixel Value')
plt.ylabel('Frequency')
plt.title('Histogram of Nonzero Pixels in Image (d)')
plt.show()

# Ảnh (f) Phân ngưỡng Otsu
_, threshold_image = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

cv2.imshow('Segmented Image (f)', threshold_image)
cv2.waitKey(0)
cv2.destroyAllWindows()