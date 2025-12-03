"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendMailApprove;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error("Missing one of required env vars: RESEND_API_KEY, RESEND_FROM_EMAIL");
}
const resend = new resend_1.Resend(RESEND_API_KEY);
function sendMailApprove(email, customerName, bookingDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield resend.emails.send({
                from: `TS Restaurant <${RESEND_FROM_EMAIL}>`,
                to: email,
                subject: "Đặt Bàn Thành Công - TS Restaurant",
                html: `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          /* Vietnamese family restaurant style - warm and welcoming */
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #fef8f0;
            margin: 0;
            padding: 20px 0;
            color: #2d2d2d;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid #ff6b35;
            box-shadow: 0 10px 30px rgba(255, 107, 53, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
            padding: 35px 30px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '✅';
            font-size: 50px;
            display: block;
            margin-bottom: 12px;
          }
          .brand {
            font-family: 'Arial Black', 'Arial Bold', sans-serif;
            font-size: 32px;
            color: #ffffff;
            letter-spacing: 2px;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .subtitle {
            color: #e8f5e9;
            font-size: 14px;
            margin-top: 8px;
            font-weight: 500;
          }
          .content {
            padding: 35px 30px;
            line-height: 1.7;
            background-color: #fffbf5;
          }
          .success-badge {
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
            border: 3px solid #4CAF50;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 25px;
          }
          .success-title {
            font-size: 24px;
            color: #2e7d32;
            font-weight: 700;
            margin: 0;
          }
          .greeting {
            font-size: 18px;
            color: #ff6b35;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .message {
            font-size: 16px;
            color: #4a4a4a;
            margin-bottom: 25px;
            line-height: 1.8;
          }
          .booking-details {
            background-color: #fff9f0;
            border: 2px solid #ffe4cc;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
          }
          .detail-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #ffe4cc;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 700;
            color: #ff6b35;
            min-width: 140px;
            font-size: 15px;
          }
          .detail-value {
            color: #4a4a4a;
            font-size: 15px;
            flex: 1;
          }
          .info-box {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border-left: 4px solid #2196F3;
            padding: 20px;
            margin: 25px 0;
            border-radius: 6px;
          }
          .info-title {
            font-size: 16px;
            color: #1565c0;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .info-text {
            font-size: 14px;
            color: #424242;
            line-height: 1.7;
            margin: 8px 0;
          }
          .divider {
            height: 2px;
            background: linear-gradient(to right, transparent, #ff6b35, transparent);
            margin: 25px 0;
          }
          .footer {
            padding: 25px 30px;
            text-align: center;
            font-size: 14px;
            color: #666;
            border-top: 2px solid #ffe4cc;
            background-color: #fffbf5;
          }
          .footer-brand {
            color: #ff6b35;
            font-weight: 700;
            font-size: 18px;
          }
          .footer-info {
            margin-top: 10px;
            font-size: 13px;
            color: #999;
          }

          /* Responsive design */
          @media only screen and (max-width: 480px) {
            .container { margin: 0 10px; border-radius: 8px; }
            .brand { font-size: 26px; letter-spacing: 1px; }
            .success-title { font-size: 20px; }
            .content { padding: 25px 20px; }
            .booking-details { padding: 20px 15px; }
            .detail-row { flex-direction: column; }
            .detail-label { margin-bottom: 5px; }
            .footer { padding: 20px 15px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">TS RESTAURANT</h1>
            <div class="subtitle">Món Ăn Gia Đình • Hương Vị Việt Nam</div>
          </div>
          <div class="content">
            <div class="success-badge">
              <h2 class="success-title">🎉 Đặt Bàn Thành Công! 🎉</h2>
            </div>

            <div class="greeting">Kính gửi ${customerName}! 👋</div>
            
            <div class="message">
              Chúng tôi rất vui mừng thông báo rằng yêu cầu đặt bàn của Quý khách tại <strong style="color: #ff6b35;">TS Restaurant</strong> 
              đã được <strong style="color: #4CAF50;">XÁC NHẬN THÀNH CÔNG</strong>! ✨
            </div>

            <div class="booking-details">
              <div class="detail-row">
                <div class="detail-label">👤 Khách hàng:</div>
                <div class="detail-value">${customerName}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">📧 Email:</div>
                <div class="detail-value">${email}</div>
              </div>
              ${bookingDetails
                    ? `
              <div class="detail-row">
                <div class="detail-label">📅 Ngày đặt:</div>
                <div class="detail-value">${bookingDetails.date || "Đang cập nhật"}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">🕐 Giờ đến:</div>
                <div class="detail-value">${bookingDetails.time || "Đang cập nhật"}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">👥 Số người:</div>
                <div class="detail-value">${bookingDetails.guests || "Đang cập nhật"} người</div>
              </div>
              `
                    : ""}
            </div>

            <div class="info-box">
              <div class="info-title">📋 Thông Tin Quan Trọng:</div>
              <div class="info-text">
                ✓ Vui lòng đến trước giờ đặt bàn <strong>10-15 phút</strong> để được phục vụ tốt nhất
              </div>
              <div class="info-text">
                ✓ Nếu có thay đổi, vui lòng liên hệ với chúng tôi trước <strong>24 giờ</strong>
              </div>
              <div class="info-text">
                ✓ Bàn sẽ được giữ trong vòng <strong>15 phút</strong> sau giờ đặt
              </div>
              <div class="info-text">
                ✓ Hotline: <strong style="color: #ff6b35;">1900-xxxx</strong>
              </div>
            </div>

            <div class="divider"></div>

            <div class="message" style="text-align: center; font-size: 15px; color: #666;">
              Chúng tôi cam kết mang đến cho Quý khách những món ăn gia đình đậm đà, 
              không gian ấm cúng và dịch vụ tận tâm nhất! 💖
            </div>
          </div>
          <div class="footer">
            Trân trọng,<br/>
            <span class="footer-brand">TS RESTAURANT</span>
            <div class="footer-info">🏠 Nhà hàng gia đình • ☎️ Hotline: 1900-xxxx</div>
            <div class="footer-info">📍 Việt Nam • 💌 Phục vụ tận tâm</div>
          </div>
        </div>
      </body>
      </html>
      `,
            });
            if (error) {
                console.error("Error sending approval email:", error);
                throw error;
            }
            console.log("Approval email sent successfully:", data === null || data === void 0 ? void 0 : data.id);
        }
        catch (error) {
            console.error("Error sending approval email:", error);
            throw error;
        }
    });
}
