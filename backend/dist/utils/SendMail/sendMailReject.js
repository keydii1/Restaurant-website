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
exports.default = sendMailReject;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error("Missing one of required env vars: RESEND_API_KEY, RESEND_FROM_EMAIL");
}
const resend = new resend_1.Resend(RESEND_API_KEY);
function sendMailReject(email, customerName, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield resend.emails.send({
                from: `TS Restaurant <${RESEND_FROM_EMAIL}>`,
                to: email,
                subject: "Thông Báo Về Yêu Cầu Đặt Bàn - TS Restaurant",
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
            text-align: center;
          }
          .header-banner {
            width: 100%;
            height: 180px;
            object-fit: cover;
          }
          .header-content {
            padding: 25px 30px;
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
          .notice-badge {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #d97706;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
          }
          .notice-icon {
            font-size: 40px;
            margin-bottom: 10px;
          }
          .notice-title {
            font-size: 18px;
            color: #92400e;
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
            margin-bottom: 20px;
            line-height: 1.8;
          }
          .reason-box {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px 25px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
          }
          .reason-title {
            font-size: 14px;
            color: #dc2626;
            font-weight: 700;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .reason-text {
            font-size: 14px;
            color: #57534e;
            line-height: 1.7;
          }
          .alternatives {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .alternatives-title {
            font-size: 16px;
            color: #065f46;
            font-weight: 700;
            margin-bottom: 18px;
            text-align: center;
          }
          .alternative-item {
            font-size: 14px;
            color: #44403c;
            margin: 12px 0;
            padding-left: 28px;
            position: relative;
            line-height: 1.6;
          }
          .alternative-item::before {
            content: '💡';
            position: absolute;
            left: 0;
            font-size: 14px;
          }
          .contact-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
          }
          .contact-title {
            font-size: 16px;
            color: #92400e;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .contact-info {
            font-size: 14px;
            color: #44403c;
            margin: 8px 0;
          }
          .contact-highlight {
            color: #d97706;
            font-weight: 700;
            font-size: 16px;
          }
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #fbbf24, transparent);
            margin: 30px 0;
          }
          .apology {
            text-align: center;
            color: #78716c;
            font-size: 14px;
            line-height: 1.8;
            padding: 15px;
            background: #fafaf9;
            border-radius: 8px;
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
            .alternatives, .contact-box { padding: 20px 15px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=200&fit=crop" alt="TS Restaurant" class="header-banner"/>
            <div class="header-content">
              <h1 class="brand">TS RESTAURANT</h1>
              <div class="subtitle">Hương Vị Việt Nam</div>
            </div>
          </div>
          <div class="content">
            <div class="notice-badge">
              <div class="notice-icon">⚠️</div>
              <h2 class="notice-title">Thông Báo Quan Trọng</h2>
            </div>

            <div class="greeting">Kính chào ${customerName}!</div>
            
            <div class="message">
              Cảm ơn Quý khách đã quan tâm và lựa chọn 
              <strong style="color: #d97706;">TS Restaurant</strong> cho bữa ăn của mình.
            </div>

            <div class="message">
              Rất tiếc, chúng tôi không thể xác nhận yêu cầu đặt bàn của Quý khách vào thời điểm này:
            </div>

            <div class="reason-box">
              <div class="reason-title">📌 Lý Do</div>
              <div class="reason-text">
                ${reason ||
                    "Nhà hàng đã hết chỗ trống trong khung giờ Quý khách mong muốn. Chúng tôi nhận được rất nhiều yêu cầu đặt bàn và xin lỗi vì sự bất tiện này."}
              </div>
            </div>

            <div class="alternatives">
              <div class="alternatives-title">🌟 Gợi Ý Thay Thế</div>
              <div class="alternative-item">
                <strong>Đặt bàn khung giờ khác:</strong> Chúng tôi có thể sắp xếp cho Quý khách vào các khung giờ khác
              </div>
              <div class="alternative-item">
                <strong>Chọn ngày khác:</strong> Vui lòng xem xét đặt bàn vào ngày khác phù hợp
              </div>
              <div class="alternative-item">
                <strong>Đặt món mang về:</strong> Quý khách có thể đặt món ăn mang về để thưởng thức tại nhà
              </div>
              <div class="alternative-item">
                <strong>Đặt bàn sớm:</strong> Liên hệ trước để được tư vấn cho các dịp đặc biệt
              </div>
            </div>

            <div class="contact-box">
              <div class="contact-title">📞 Liên Hệ Với Chúng Tôi</div>
              <div class="contact-info">
                Hotline: <span class="contact-highlight">1900-xxxx</span>
              </div>
              <div class="contact-info">
                Email: <span class="contact-highlight">contact@tsrestaurant.vn</span>
              </div>
              <div class="contact-info" style="margin-top: 12px; font-size: 13px; color: #78716c;">
                Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ Quý khách!
              </div>
            </div>

            <div class="divider"></div>

            <div class="apology">
              Chúng tôi thành thật xin lỗi vì sự bất tiện này.<br/>
              Rất mong được phục vụ Quý khách trong thời gian sớm nhất! 🙏
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
                console.error("Error sending rejection email:", error);
                throw error;
            }
            console.log("Rejection email sent successfully:", data === null || data === void 0 ? void 0 : data.id);
        }
        catch (error) {
            console.error("Error sending rejection email:", error);
            throw error;
        }
    });
}
