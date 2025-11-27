# Frontend Upload Fix Checklist

## ✅ Các điểm cần kiểm tra bên Frontend

### 1. **Đảm bảo KHÔNG gửi Content-Type header**

❌ SAI:

```javascript
fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data", // ❌ KHÔNG SET CÁI NÀY!
  },
  body: formData,
});
```

✅ ĐÚNG:

```javascript
fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    // KHÔNG có Content-Type - browser sẽ tự động set với boundary
  },
  body: formData,
});
```

### 2. **FormData phải được tạo đúng cách**

✅ ĐÚNG:

```javascript
const formData = new FormData();
formData.append("name", dishName);
formData.append("price", price.toString());
formData.append("categoryId", categoryId);
formData.append("rating", rating.toString());
formData.append("discount", discount.toString());
formData.append("prepareTime", prepareTime.toString());
formData.append("description", description);
formData.append("image", fileInput.files[0]); // File object, không phải base64!
```

### 3. **Kiểm tra file input HTML**

✅ ĐÚNG:

```html
<input
  type="file"
  name="image"
  accept="image/*"
  onChange="{handleFileChange}"
/>
```

```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Kiểm tra kích thước file (< 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("File quá lớn! Tối đa 50MB");
      return;
    }
    setSelectedFile(file);
  }
};
```

### 4. **URL endpoint phải chính xác**

✅ ĐÚNG:

```javascript
const API_URL = "http://localhost:3000/restaurant/api/v1/dishes/create";
```

❌ SAI:

- `http://localhost:3000/dishes/create` (thiếu prefix)
- `https://localhost:3000/...` (dùng https cho localhost)
- `http://localhost:8080/...` (sai port)

### 5. **JWT Token phải hợp lệ**

```javascript
// Kiểm tra token trước khi gửi
const token = localStorage.getItem("token");
if (!token) {
  alert("Bạn chưa đăng nhập!");
  return;
}

// Log token để debug (chỉ trong dev)
console.log("Token:", token.substring(0, 20) + "...");
```

### 6. **Xử lý lỗi đúng cách**

```javascript
try {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  // Kiểm tra status code
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error:", response.status, errorText);

    if (response.status === 413) {
      throw new Error("File quá lớn! Backend chỉ cho phép tối đa 50MB");
    } else if (response.status === 401) {
      throw new Error("Không có quyền truy cập. Vui lòng đăng nhập lại");
    } else {
      throw new Error(`Lỗi ${response.status}: ${errorText}`);
    }
  }

  const result = await response.json();
  console.log("Upload thành công:", result);
  return result;
} catch (error) {
  console.error("Upload failed:", error);
  alert(error.message);
  throw error;
}
```

### 7. **Với Axios**

```javascript
import axios from "axios";

const uploadDish = async (formData, token) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/restaurant/api/v1/dishes/create",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Axios tự động set Content-Type cho FormData
        },
        maxContentLength: 50 * 1024 * 1024, // 50MB
        maxBodyLength: 50 * 1024 * 1024, // 50MB
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error(
        "Server error:",
        error.response.status,
        error.response.data
      );
      throw new Error(error.response.data.message || "Upload failed");
    } else if (error.request) {
      // Request was made but no response
      console.error("Network error:", error.request);
      throw new Error("Không thể kết nối đến server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
      throw error;
    }
  }
};
```

### 8. **React Example (Complete)**

```javascript
import React, { useState } from "react";

function CreateDish() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    rating: 4.5,
    discount: 0,
    prepareTime: 15,
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert("File quá lớn! Tối đa 50MB");
        e.target.value = ""; // Clear input
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!");
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Vui lòng chọn ảnh!");
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập!");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("categoryId", formData.categoryId);
    data.append("rating", formData.rating.toString());
    data.append("discount", formData.discount.toString());
    data.append("prepareTime", formData.prepareTime.toString());
    data.append("description", formData.description);
    data.append("image", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:3000/restaurant/api/v1/dishes/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Tạo món ăn thành công!");

      // Reset form
      setFormData({
        name: "",
        price: "",
        categoryId: "",
        rating: 4.5,
        discount: 0,
        prepareTime: 15,
        description: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Tên món ăn"
        required
      />

      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        placeholder="Giá"
        required
      />

      <input
        type="text"
        name="categoryId"
        value={formData.categoryId}
        onChange={handleInputChange}
        placeholder="Category ID"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />

      {selectedFile && (
        <p>
          File đã chọn: {selectedFile.name} (
          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Đang upload..." : "Tạo món ăn"}
      </button>
    </form>
  );
}

export default CreateDish;
```

### 9. **Debug với Browser DevTools**

1. Mở Developer Tools (F12)
2. Tab **Network**
3. Filter: XHR/Fetch
4. Upload file
5. Xem request:
   - Request URL: phải đúng endpoint
   - Request Method: POST
   - Request Headers:
     - Authorization: Bearer ...
     - Content-Type: multipart/form-data; boundary=...
   - Request Payload: xem FormData
6. Xem response:
   - Status: 200 (success) hoặc 413 (too large), 401 (unauthorized)
   - Response body: JSON result

### 10. **Kiểm tra CORS từ browser**

Nếu thấy lỗi CORS:

```
Access to fetch at 'http://localhost:3000/...' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

Backend đã config CORS với `origin: "*"`, nhưng nếu vẫn lỗi:

- Đảm bảo backend đang chạy
- Kiểm tra port đúng
- Restart backend server

## 📋 Quick Checklist

- [ ] KHÔNG set Content-Type header
- [ ] FormData chứa file object (không phải base64)
- [ ] URL đúng: http://localhost:3000/restaurant/api/v1/dishes/create
- [ ] JWT token hợp lệ trong Authorization header
- [ ] File size < 50MB
- [ ] Backend server đang chạy
- [ ] Xử lý lỗi response đúng cách
- [ ] Test với DevTools Network tab

## 🚨 Nếu vẫn gặp lỗi 413

1. **Kiểm tra backend logs** - xem có log "File received" không?
2. **Test với CURL** - nếu CURL work thì vấn đề ở frontend
3. **Kiểm tra file size** - console.log(file.size)
4. **Kiểm tra Nginx/Proxy** - nếu có reverse proxy
5. **Test với file nhỏ** - thử với file < 100KB trước

## 📞 Cần hỗ trợ thêm?

Nếu vẫn gặp vấn đề, cung cấp:

1. Browser console errors
2. Network tab screenshot (request/response)
3. Backend console logs
4. Frontend code snippet
