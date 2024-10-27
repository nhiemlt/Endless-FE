const convertImageToBase64 = {

    // Hàm chuyển đổi ảnh thành chuỗi base64
    convertImageToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async () => {
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    // Tạo canvas và thiết lập kích thước
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Thiết lập chiều rộng và chiều cao của canvas
                    const maxWidth = 600; // Giới hạn chiều rộng
                    const maxHeight = 600; // Giới hạn chiều cao
                    let width = img.width;
                    let height = img.height;

                    // Tính tỷ lệ để giữ nguyên tỉ lệ khung hình
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Chuyển đổi canvas thành chuỗi Base64
                    let base64String = canvas.toDataURL('image/jpeg', 0.5); // Giảm chất lượng xuống 50%

                    // Kiểm tra độ dài chuỗi Base64 và nén nếu cần
                    const maxLength = 2000000; // Độ dài tối đa cho chuỗi Base64 (ví dụ: 2MB)
                    while (base64String.length > maxLength) {
                        // Giảm chất lượng thêm nữa nếu chuỗi vẫn quá dài
                        base64String = canvas.toDataURL('image/jpeg', 0.3); // Giảm chất lượng còn 30%
                    }

                    resolve(base64String); // Trả về chuỗi Base64
                };
            };

            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file); // Đọc tệp dưới dạng Data URL
        });
    },
}

export default convertImageToBase64;
