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
exports.default = sendMailThankYou;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error("Missing one of required env vars: RESEND_API_KEY, RESEND_FROM_EMAIL");
}
const resend = new resend_1.Resend(RESEND_API_KEY);
function sendMailThankYou(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield resend.emails.send({
                from: `TS Restaurant <${RESEND_FROM_EMAIL}>`,
                to: email,
                subject: "Cảm Ơn Quý Khách Đã Lựa Chọn TS Restaurant",
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
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
            padding: 35px 30px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '🍽️';
            font-size: 50px;
            display: block;
            margin-bottom: 12px;
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
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
            color: #fff5e6;
            font-size: 14px;
            margin-top: 8px;
            font-weight: 500;
          }
          .content {
            padding: 35px 30px;
            line-height: 1.7;
            background-color: #fffbf5;
          }
          .title {
            font-size: 26px;
            color: #ff6b35;
            margin-bottom: 20px;
            font-weight: 700;
            text-align: center;
          }
          .message {
            font-size: 16px;
            color: #4a4a4a;
            margin-bottom: 25px;
            line-height: 1.8;
            text-align: center;
          }
          .highlight {
            color: #ff6b35;
            font-weight: 700;
          }
          .divider {
            height: 2px;
            background: linear-gradient(to right, transparent, #ff6b35, transparent);
            margin: 30px 0;
          }
          .appreciation-card {
            background: linear-gradient(135deg, #fff5e6 0%, #ffe4cc 100%);
            border: 3px solid #ff6b35;
            border-radius: 12px;
            padding: 30px 25px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15);
            position: relative;
          }
          .appreciation-card::before {
            content: '"';
            font-size: 60px;
            color: #ffb380;
            position: absolute;
            top: -10px;
            left: 20px;
            font-family: Georgia, serif;
          }
          .appreciation-text {
            font-size: 20px;
            color: #d94d1a;
            font-weight: 700;
            margin: 10px 0;
            font-style: italic;
          }
          .features-box {
            background-color: #fff9f0;
            border-left: 4px solid #ff6b35;
            padding: 20px 25px;
            margin: 25px 0;
            border-radius: 6px;
          }
          .feature-item {
            font-size: 15px;
            color: #4a4a4a;
            margin: 12px 0;
            padding-left: 25px;
            position: relative;
          }
          .feature-item::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #ff6b35;
            font-weight: 900;
            font-size: 18px;
          }
          .closing-message {
            background: linear-gradient(135deg, #ffe4cc 0%, #fff5e6 100%);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin-top: 25px;
            font-size: 15px;
            color: #4a4a4a;
            line-height: 1.8;
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
            display: block;
            margin-bottom: 10px;
          }
          .footer-info {
            margin: 8px 0;
            font-size: 13px;
            color: #999;
          }
          .social-icons {
            margin-top: 15px;
            font-size: 20px;
          }

          /* Responsive design */
          @media only screen and (max-width: 480px) {
            .container { margin: 0 10px; border-radius: 8px; }
            .brand { font-size: 26px; letter-spacing: 1px; }
            .header::before { font-size: 42px; }
            .title { font-size: 22px; }
            .message { font-size: 15px; }
            .appreciation-text { font-size: 18px; }
            .content { padding: 25px 20px; }
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
            <div class="title">Chân Thành Cảm Ơn! ❤️</div>
            <div class="message">
              Chúng tôi xin gửi lời cảm ơn chân thành đến Quý khách đã tin tưởng và lựa chọn 
              <span class="highlight">TS Restaurant</span> trong những khoảnh khắc sum vầy bên gia đình.
            </div>

            <div class="divider"></div>

            <div class="appreciation-card">
              <p class="appreciation-text">Quý khách là niềm vinh dự của chúng tôi</p>
              <div style="font-size: 30px; margin-top: 10px;">🙏 💝</div>
            </div>

            <div class="features-box">
              <div class="feature-item">
                <strong>Món ăn gia đình</strong> được chế biến từ nguyên liệu tươi ngon
              </div>
              <div class="feature-item">
                <strong>Phục vụ tận tâm</strong> với thái độ niềm nở, chu đáo
              </div>
              <div class="feature-item">
                <strong>Không gian ấm cúng</strong> như đang ở chính nhà bạn
              </div>
              <div class="feature-item">
                <strong>Hương vị đậm đà</strong> của ẩm thực Việt Nam truyền thống
              </div>
            </div>

            <div class="closing-message">
              Sự hài lòng của Quý khách là động lực lớn nhất để TS Restaurant ngày càng hoàn thiện hơn. 
              Chúng tôi rất mong được tiếp tục phục vụ Quý khách trong những lần ghé thăm tới 
              và luôn sẵn sàng lắng nghe mọi ý kiến đóng góp để cải thiện chất lượng phục vụ.
            </div>

            <div class="divider"></div>

            <div class="message" style="font-size: 15px; color: #666; font-style: italic;">
              Hẹn gặp lại Quý khách rất sớm! 🌟
            </div>
          </div>
          <div class="footer">
            <span class="footer-brand">🍜 TS RESTAURANT 🍜</span>
            <div class="footer-info">🏠 Nhà hàng gia đình - Món ăn truyền thống</div>
            <div class="footer-info">☎️ Hotline: 1900-xxxx • 📧 Email: contact@tsrestaurant.vn</div>
            <div class="footer-info">📍 Việt Nam • 🕐 Phục vụ 7 ngày/tuần</div>
            <div class="social-icons">
              📱 💬 🌐
            </div>
          </div>
        </div>
      </body>
      </html>
      `,
            });
            if (error) {
                console.error("Error sending thank you email:", error);
                throw error;
            }
            console.log("Thank you email sent successfully:", data === null || data === void 0 ? void 0 : data.id);
        }
        catch (error) {
            console.error("Error sending thank you email:", error);
            throw error;
        }
    });
}
