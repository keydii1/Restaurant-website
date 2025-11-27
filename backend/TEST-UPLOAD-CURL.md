# Test Upload với CURL

## Test upload ảnh với CURL command

```bash
# Thay YOUR_JWT_TOKEN bằng token thực của bạn
# Thay YOUR_CATEGORY_ID bằng category ID thực
# Thay /path/to/your/image.jpg bằng đường dẫn ảnh thực

curl -X POST http://localhost:3000/restaurant/api/v1/dishes/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Test Dish" \
  -F "price=100000" \
  -F "categoryId=YOUR_CATEGORY_ID" \
  -F "rating=4.5" \
  -F "discount=10" \
  -F "prepareTime=15" \
  -F "description=Test description" \
  -F "image=@/path/to/your/image.jpg"
```

## Ví dụ cụ thể

```bash
curl -X POST http://localhost:3000/restaurant/api/v1/dishes/create \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "name=Phở Bò Đặc Biệt" \
  -F "price=85000" \
  -F "categoryId=673e22b5fd4f1b2c8b9e4f11" \
  -F "rating=4.8" \
  -F "discount=0" \
  -F "prepareTime=20" \
  -F "description=Phở bò truyền thống với nước dùng hầm xương 12 giờ" \
  -F "image=@./test-image.jpg"
```

## Test với file lớn (10MB)

```bash
# Tạo file test 10MB
dd if=/dev/zero of=test-10mb.bin bs=1M count=10

# Upload file test
curl -X POST http://localhost:3000/restaurant/api/v1/dishes/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Test Large File" \
  -F "price=100000" \
  -F "categoryId=YOUR_CATEGORY_ID" \
  -F "rating=4.5" \
  -F "discount=10" \
  -F "prepareTime=15" \
  -F "description=Test with large file" \
  -F "image=@test-10mb.bin"
```

## Expected Success Response

```json
{
  "message": "Dish created successfully",
  "data": {
    "_id": "673e2a9d8b1c4f5e2d9a1b3c",
    "name": "Phở Bò Đặc Biệt",
    "price": 85000,
    "rating": 4.8,
    "discount": 0,
    "finalPrice": 85000,
    "prepareTime": 20,
    "categoryId": {
      "_id": "673e22b5fd4f1b2c8b9e4f11",
      "name": "Món Việt"
    },
    "description": "Phở bò truyền thống với nước dùng hầm xương 12 giờ",
    "image": "https://res.cloudinary.com/dvxaznogb/image/upload/v1732123456/dishes_images/abc123.jpg",
    "status": "inactive",
    "deleted": false,
    "createdAt": "2025-11-27T16:30:00.000Z",
    "updatedAt": "2025-11-27T16:30:00.000Z"
  }
}
```

## Common Errors

### 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

**Fix**: Kiểm tra JWT token có đúng không

### 413 Payload Too Large

```json
{
  "message": "Payload Too Large"
}
```

**Fix**:

- ✅ Đã fix trong code (limit 50MB)
- Nếu vẫn lỗi, kiểm tra Nginx hoặc reverse proxy

### 400 Bad Request

```json
{
  "message": "Category not found"
}
```

**Fix**: Kiểm tra categoryId có tồn tại trong database không

## Debug Backend Logs

Khi upload, backend sẽ log ra:

```
File received: {
  fieldname: 'image',
  originalname: 'pho-bo.jpg',
  mimetype: 'image/jpeg',
  size: 234567,
  path: 'uploads/abc123'
}
Cloudinary uploaded successfully: https://res.cloudinary.com/...
Create dish - Request body: { name: '...', price: 100000, image: 'https://...' }
Dish created successfully: { _id: '...', ... }
```

## Frontend JavaScript Code

```javascript
// Với fetch API
const formData = new FormData();
formData.append("name", "Phở Bò");
formData.append("price", "85000");
formData.append("categoryId", "your-category-id");
formData.append("rating", "4.8");
formData.append("discount", "0");
formData.append("prepareTime", "20");
formData.append("description", "Mô tả món ăn");
formData.append("image", fileInput.files[0]);

const response = await fetch(
  "http://localhost:3000/restaurant/api/v1/dishes/create",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // KHÔNG set Content-Type - để browser tự set với boundary
    },
    body: formData,
  }
);

const result = await response.json();
console.log(result);
```

## Troubleshooting

1. **Kiểm tra server đang chạy**:

   ```bash
   curl http://localhost:3000/restaurant/api/v1/dishes
   ```

2. **Kiểm tra CORS**:

   - Origin header phải match với CORS config
   - Nếu test từ browser, đảm bảo frontend chạy trên localhost

3. **Kiểm tra Cloudinary credentials**:

   ```bash
   cat .env | grep CLOUD
   ```

4. **Kiểm tra thư mục uploads tồn tại**:

   ```bash
   ls -la uploads/
   ```

5. **Xem logs chi tiết**:
   - Mở terminal đang chạy `npm run dev`
   - Xem console.log khi upload
