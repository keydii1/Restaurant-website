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
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #fef3c7;
            margin: 0;
            padding: 20px 0;
            color: #1c1917;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(217, 119, 6, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo-icon {
            font-size: 48px;
            margin-bottom: 12px;
          }
          .brand {
            font-family: 'Georgia', serif;
            font-size: 28px;
            color: #ffffff;
            letter-spacing: 3px;
            margin: 0;
            font-weight: 700;
          }
          .subtitle {
            color: #fef3c7;
            font-size: 13px;
            margin-top: 8px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .content {
            padding: 40px 35px;
            background-color: #fffbeb;
          }
          .success-badge {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
          }
          .success-icon {
            font-size: 40px;
            margin-bottom: 10px;
          }
          .success-title {
            font-size: 20px;
            color: #065f46;
            font-weight: 700;
            margin: 0;
          }
          .greeting {
            font-size: 18px;
            color: #92400e;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .message {
            font-size: 15px;
            color: #44403c;
            margin-bottom: 25px;
            line-height: 1.8;
          }
          .booking-card {
            background: #ffffff;
            border: 2px solid #fbbf24;
            border-radius: 12px;
            overflow: hidden;
            margin: 25px 0;
          }
          .booking-header {
            background: #fef3c7;
            padding: 15px 20px;
            border-bottom: 2px solid #fbbf24;
          }
          .booking-header-title {
            font-size: 14px;
            color: #92400e;
            font-weight: 700;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .booking-body {
            padding: 20px;
          }
          .detail-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #fef3c7;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-icon {
            font-size: 18px;
            margin-right: 12px;
          }
          .detail-label {
            font-weight: 600;
            color: #78716c;
            min-width: 100px;
            font-size: 14px;
          }
          .detail-value {
            color: #1c1917;
            font-size: 14px;
            font-weight: 500;
          }
          .info-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
          }
          .info-title {
            font-size: 14px;
            color: #92400e;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .info-item {
            font-size: 14px;
            color: #44403c;
            line-height: 1.7;
            margin: 10px 0;
            padding-left: 20px;
            position: relative;
          }
          .info-item::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #f59e0b;
            font-weight: 900;
          }
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #fbbf24, transparent);
            margin: 30px 0;
          }
          .footer {
            background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
            padding: 30px;
            text-align: center;
          }
          .footer-brand {
            color: #fbbf24;
            font-weight: 700;
            font-size: 18px;
            font-family: 'Georgia', serif;
            letter-spacing: 2px;
          }
          .footer-info {
            margin-top: 12px;
            font-size: 12px;
            color: #fef3c7;
            line-height: 1.8;
          }
          @media only screen and (max-width: 480px) {
            .container { margin: 0 10px; }
            .brand { font-size: 24px; }
            .content { padding: 25px 20px; }
            .detail-row { flex-direction: column; }
            .detail-label { margin-bottom: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-icon">🍜</div>
            <h1 class="brand">TS RESTAURANT</h1>
            <div class="subtitle">Hương Vị Việt Nam</div>
          </div>
          <div class="content">
            <div class="success-badge">
              <div class="success-icon">✅</div>
              <h2 class="success-title">Đặt Bàn Thành Công!</h2>
            </div>

            <div class="greeting">Kính chào ${customerName}!</div>
            
            <div class="message">
              Chúng tôi vui mừng thông báo yêu cầu đặt bàn của Quý khách tại 
              <strong style="color: #d97706;">TS Restaurant</strong> đã được 
              <strong style="color: #059669;">xác nhận thành công</strong>.
            </div>

            <div class="booking-card">
              <div class="booking-header">
                <h3 class="booking-header-title">📋 Thông Tin Đặt Bàn</h3>
              </div>
              <div class="booking-body">
                <div class="detail-row">
                  <span class="detail-icon">👤</span>
                  <span class="detail-label">Khách hàng:</span>
                  <span class="detail-value">${customerName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-icon">📧</span>
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${email}</span>
                </div>
                ${bookingDetails
                    ? `
                <div class="detail-row">
                  <span class="detail-icon">📅</span>
                  <span class="detail-label">Ngày đặt:</span>
                  <span class="detail-value">${bookingDetails.date || "Đang cập nhật"}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-icon">🕐</span>
                  <span class="detail-label">Giờ đến:</span>
                  <span class="detail-value">${bookingDetails.time || "Đang cập nhật"}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-icon">👥</span>
                  <span class="detail-label">Số người:</span>
                  <span class="detail-value">${bookingDetails.guests || "Đang cập nhật"} người</span>
                </div>
                `
                    : ""}
              </div>
            </div>

            <div class="info-box">
              <div class="info-title">� Lưu Ý Quan Trọng</div>
              <div class="info-item">Vui lòng đến trước giờ đặt bàn <strong>10-15 phút</strong></div>
              <div class="info-item">Nếu có thay đổi, liên hệ trước <strong>24 giờ</strong></div>
              <div class="info-item">Bàn được giữ trong vòng <strong>15 phút</strong> sau giờ đặt</div>
              <div class="info-item">Hotline: <strong style="color: #d97706;">1900-xxxx</strong></div>
            </div>

            <div class="divider"></div>

            <div class="message" style="text-align: center; font-size: 14px; color: #78716c;">
              Cảm ơn Quý khách đã tin tưởng TS Restaurant. Chúng tôi mong được phục vụ Quý khách!
            </div>
          </div>
          <div class="footer">
            <div class="footer-brand">TS RESTAURANT</div>
            <div class="footer-info">
              📍 Việt Nam • ☎️ 1900-xxxx<br/>
              Phục vụ tận tâm • Hương vị đậm đà
            </div>
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
