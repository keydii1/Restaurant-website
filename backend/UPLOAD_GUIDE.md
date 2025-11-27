# Hướng dẫn Upload Ảnh cho Frontend

## Endpoint Upload

```
POST /restaurant/api/v1/dishes/create
PATCH /restaurant/api/v1/dishes/edit/:id
```

## Headers Required

```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

## FormData Structure

### Tạo mới dish (POST)

```javascript
const formData = new FormData();
formData.append("name", "Tên món ăn");
formData.append("price", "100000");
formData.append("rating", "4.5");
formData.append("discount", "10");
formData.append("prepareTime", "15");
formData.append("categoryId", "category_id_here");
formData.append("description", "Mô tả món ăn");
formData.append("image", fileInput.files[0]); // File object from input type="file"
```

### Cập nhật dish (PATCH)

```javascript
const formData = new FormData();
formData.append("name", "Tên món ăn mới");
formData.append("price", "120000");
formData.append("image", fileInput.files[0]); // Optional - only if changing image
```

## Example Frontend Code

### React/Next.js Example

```javascript
const handleUpload = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", dishName);
  formData.append("price", price);
  formData.append("rating", rating);
  formData.append("discount", discount);
  formData.append("prepareTime", prepareTime);
  formData.append("categoryId", categoryId);
  formData.append("description", description);
  formData.append("image", imageFile); // File from input

  try {
    const response = await fetch(
      "http://localhost:3000/restaurant/api/v1/dishes/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DON'T set Content-Type header - browser will set it automatically with boundary
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log("Success:", result);
    } else {
      console.error("Error:", result);
    }
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Axios Example

```javascript
import axios from "axios";

const handleUpload = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/restaurant/api/v1/dishes/create",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Success:", response.data);
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
  }
};
```

## Common Issues & Solutions

### 1. CORS Error

**Lỗi:** `Access-Control-Allow-Origin header is not present`

**Giải pháp:** Backend đã được cấu hình CORS. Đảm bảo frontend gửi request đúng URL: `http://localhost:3000`

### 2. 401 Unauthorized

**Lỗi:** `Unauthorized` hoặc `No token provided`

**Giải pháp:** Đảm bảo gửi JWT token trong header:

```javascript
headers: {
  'Authorization': `Bearer ${your_token_here}`
}
```

### 3. File không được upload

**Lỗi:** Backend không nhận được file

**Giải pháp:**

- Đảm bảo input có `name="image"`
- Kiểm tra `enctype="multipart/form-data"` cho form HTML
- Với fetch API, KHÔNG set Content-Type header (để browser tự động set)

### 4. 500 Internal Server Error

**Lỗi:** `Upload failed`

**Kiểm tra:**

- Cloudinary credentials trong file `.env`
- File có đúng định dạng ảnh không (jpg, png, etc.)
- Xem console log trên backend để biết lỗi chi tiết

### 5. Body data bị mất

**Lỗi:** Các field khác image không được lưu

**Giải pháp:** Đã fix trong `uploadCloud.middleware.ts` - không còn ghi đè `req.body`

## Response Format

### Success Response

```json
{
  "message": "Dish created successfully",
  "data": {
    "_id": "dish_id",
    "name": "Tên món ăn",
    "price": 100000,
    "rating": 4.5,
    "discount": 10,
    "finalPrice": 90000,
    "prepareTime": 15,
    "categoryId": {
      "_id": "category_id",
      "name": "Tên category"
    },
    "description": "Mô tả món ăn",
    "image": "https://res.cloudinary.com/xxx/image/upload/xxx.jpg",
    "status": "active",
    "deleted": false
  }
}
```

### Error Response

```json
{
  "message": "Upload failed",
  "error": "Error message here",
  "details": "Additional error details"
}
```

## Testing với Postman

1. Chọn method `POST`
2. URL: `http://localhost:3000/restaurant/api/v1/dishes/create`
3. Headers:
   - `Authorization`: `Bearer <your_token>`
4. Body:
   - Chọn `form-data`
   - Thêm các key-value pairs
   - Với key `image`, chọn type là `File` và upload file

## Debug Tips

Backend hiện đã có console.log để debug:

- Check terminal/console backend để xem:
  - File có được nhận không
  - Request body có đầy đủ data không
  - Cloudinary upload có thành công không
  - Lỗi cụ thể là gì

Ví dụ log sẽ hiện:

```
File received: { fieldname: 'image', originalname: 'dish.jpg', ... }
Cloudinary uploaded successfully: https://res.cloudinary.com/...
Create dish - Request body: { name: '...', price: '...', image: 'https://...' }
Dish created successfully: { _id: '...', ... }
```
