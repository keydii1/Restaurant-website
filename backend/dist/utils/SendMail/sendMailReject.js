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
            background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
            padding: 35px 30px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '📋';
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
            color: #fff8e1;
            font-size: 14px;
            margin-top: 8px;
            font-weight: 500;
          }
          .content {
            padding: 35px 30px;
            line-height: 1.7;
            background-color: #fffbf5;
          }
          .notice-badge {
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
            border: 3px solid #ff9800;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 25px;
          }
          .notice-title {
            font-size: 22px;
            color: #e65100;
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
          .reason-box {
            background-color: #fff9f0;
            border-left: 4px solid #ff9800;
            padding: 20px 25px;
            margin: 25px 0;
            border-radius: 6px;
          }
          .reason-title {
            font-size: 16px;
            color: #e65100;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .reason-text {
            font-size: 15px;
            color: #424242;
            line-height: 1.7;
          }
          .alternatives {
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
            border: 2px solid #4CAF50;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
          }
          .alternatives-title {
            font-size: 18px;
            color: #2e7d32;
            font-weight: 700;
            margin-bottom: 15px;
            text-align: center;
          }
          .alternative-item {
            font-size: 15px;
            color: #424242;
            margin: 12px 0;
            padding-left: 30px;
            position: relative;
          }
          .alternative-item::before {
            content: '💡';
            position: absolute;
            left: 0;
            font-size: 18px;
          }
          .contact-box {
            background: linear-gradient(135deg, #fff5e6 0%, #ffe4cc 100%);
            border: 2px dashed #ff6b35;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
          }
          .contact-title {
            font-size: 18px;
            color: #ff6b35;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .contact-info {
            font-size: 16px;
            color: #4a4a4a;
            margin: 10px 0;
          }
          .contact-highlight {
            color: #d94d1a;
            font-weight: 700;
            font-size: 18px;
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
          .apology {
            text-align: center;
            font-style: italic;
            color: #666;
            font-size: 15px;
            margin-top: 20px;
          }

          /* Responsive design */
          @media only screen and (max-width: 480px) {
            .container { margin: 0 10px; border-radius: 8px; }
            .brand { font-size: 26px; letter-spacing: 1px; }
            .notice-title { font-size: 18px; }
            .content { padding: 25px 20px; }
            .alternatives, .contact-box { padding: 20px 15px; }
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
            <div class="notice-badge">
              <h2 class="notice-title">⚠️ Thông Báo Quan Trọng</h2>
            </div>

            <div class="greeting">Kính gửi ${customerName}! 👋</div>
            
            <div class="message">
              Trước tiên, chúng tôi xin chân thành cảm ơn Quý khách đã quan tâm và lựa chọn 
              <strong style="color: #ff6b35;">TS Restaurant</strong> cho bữa ăn của mình.
            </div>

            <div class="message">
              Rất tiếc, chúng tôi không thể xác nhận yêu cầu đặt bàn của Quý khách vào thời điểm này 
              vì những lý do sau:
            </div>

            <div class="reason-box">
              <div class="reason-title">📌 Lý Do:</div>
              <div class="reason-text">
                ${reason ||
                    "Nhà hàng đã hết chỗ trống trong khung giờ Quý khách mong muốn. Chúng tôi nhận được rất nhiều yêu cầu đặt bàn và xin lỗi vì sự bất tiện này."}
              </div>
            </div>

            <div class="alternatives">
              <div class="alternatives-title">🌟 Gợi Ý Thay Thế 🌟</div>
              <div class="alternative-item">
                <strong>Đặt bàn khung giờ khác:</strong> Chúng tôi có thể sắp xếp cho Quý khách vào các khung giờ khác trong ngày
              </div>
              <div class="alternative-item">
                <strong>Chọn ngày khác:</strong> Vui lòng xem xét đặt bàn vào ngày khác phù hợp với lịch trình
              </div>
              <div class="alternative-item">
                <strong>Đặt món mang về:</strong> Quý khách có thể đặt món ăn mang về để thưởng thức tại nhà
              </div>
              <div class="alternative-item">
                <strong>Đặt bàn sớm:</strong> Liên hệ trước để được tư vấn và đặt bàn cho các dịp đặc biệt
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
              <div class="contact-info" style="margin-top: 15px; font-size: 15px; color: #666;">
                Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ và tư vấn<br/>
                để tìm giải pháp phù hợp nhất cho Quý khách! 💝
              </div>
            </div>

            <div class="divider"></div>

            <div class="apology">
              Chúng tôi thành thật xin lỗi vì sự bất tiện này và rất mong<br/>
              được phục vụ Quý khách trong thời gian sớm nhất! 🙏
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
