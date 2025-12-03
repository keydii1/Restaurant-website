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
exports.default = sendMailForgotPassword;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error("Missing one of required env vars: RESEND_API_KEY, RESEND_FROM_EMAIL");
}
const resend = new resend_1.Resend(RESEND_API_KEY);
function sendMailForgotPassword(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield resend.emails.send({
                from: `TS Restaurant <${RESEND_FROM_EMAIL}>`,
                to: email,
                subject: "Yêu Cầu Đặt Lại Mật Khẩu - TS Restaurant",
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
            background-color: #fef8f0; /* soft peachy cream */
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
            content: '🍜';
            font-size: 42px;
            display: block;
            margin-bottom: 10px;
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
          .greeting {
            font-size: 18px;
            color: #ff6b35;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .instruction {
            font-size: 15px;
            color: #4a4a4a;
            margin-bottom: 28px;
            line-height: 1.8;
          }
          .otp-container {
            background: linear-gradient(135deg, #fff5e6 0%, #ffe4cc 100%);
            border: 3px dashed #ff6b35;
            border-radius: 10px;
            padding: 25px 20px;
            text-align: center;
            margin: 25px 0;
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.12);
          }
          .otp-label {
            font-size: 13px;
            color: #ff6b35;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
          }
          .otp {
            font-family: 'Courier New', Courier, monospace;
            font-size: 36px;
            color: #d94d1a;
            letter-spacing: 8px;
            font-weight: 900;
            margin: 10px 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          }
          .warning-box {
            background-color: #fff9f0;
            border-left: 4px solid #ffa500;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 6px;
          }
          .warning-text {
            font-size: 14px;
            color: #666;
            margin: 0;
            line-height: 1.6;
          }
          .note {
            font-size: 13px;
            color: #888;
            text-align: center;
            margin-top: 20px;
            font-style: italic;
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
            font-size: 16px;
          }
          .footer-info {
            margin-top: 10px;
            font-size: 13px;
            color: #999;
          }
          .divider {
            height: 2px;
            background: linear-gradient(to right, transparent, #ff6b35, transparent);
            margin: 25px 0;
          }

          /* Responsive design */
          @media only screen and (max-width: 480px) {
            .container { margin: 0 10px; border-radius: 8px; }
            .brand { font-size: 26px; letter-spacing: 1px; }
            .header::before { font-size: 36px; }
            .otp { font-size: 28px; letter-spacing: 6px; }
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
            <div class="greeting">Xin chào Quý khách! 👋</div>
            <div class="instruction">
              Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>TS Restaurant</strong>. 
              Vui lòng sử dụng mã xác thực bên dưới để tiếp tục:
            </div>

            <div class="otp-container">
              <div class="otp-label">🔐 Mã Xác Thực</div>
              <div class="otp">${otp}</div>
            </div>

            <div class="warning-box">
              <p class="warning-text">
                ⏱️ <strong>Lưu ý:</strong> Mã xác thực này chỉ có hiệu lực trong thời gian ngắn. 
                Vui lòng sử dụng ngay để đảm bảo tính bảo mật.
              </p>
            </div>

            <div class="divider"></div>

            <div class="note">
              Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với chúng tôi để được hỗ trợ.
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
                console.error("Error sending forgot password email:", error);
                throw error;
            }
            console.log("Forgot password email sent successfully:", data === null || data === void 0 ? void 0 : data.id);
        }
        catch (error) {
            console.error("Error sending forgot password email:", error);
            throw error;
        }
    });
}
