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
          .greeting {
            font-size: 18px;
            color: #92400e;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .instruction {
            font-size: 15px;
            color: #44403c;
            margin-bottom: 28px;
            line-height: 1.8;
          }
          .otp-container {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 3px solid #f59e0b;
            border-radius: 16px;
            padding: 30px 20px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
          }
          .otp-label {
            font-size: 12px;
            color: #92400e;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 15px;
          }
          .otp-icon {
            font-size: 32px;
            margin-bottom: 10px;
          }
          .otp {
            font-family: 'Courier New', Courier, monospace;
            font-size: 42px;
            color: #92400e;
            letter-spacing: 10px;
            font-weight: 900;
            margin: 15px 0;
            background: #ffffff;
            padding: 15px 25px;
            border-radius: 10px;
            display: inline-block;
            border: 2px dashed #fbbf24;
          }
          .warning-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #d97706;
            padding: 18px 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
          }
          .warning-text {
            font-size: 14px;
            color: #78716c;
            margin: 0;
            line-height: 1.6;
          }
          .note {
            font-size: 13px;
            color: #a8a29e;
            text-align: center;
            margin-top: 25px;
            padding: 15px;
            background: #fafaf9;
            border-radius: 8px;
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
            .otp { font-size: 32px; letter-spacing: 6px; }
            .content { padding: 25px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-icon">🔐</div>
            <h1 class="brand">TS RESTAURANT</h1>
            <div class="subtitle">Hương Vị Việt Nam</div>
          </div>
          <div class="content">
            <div class="greeting">Xin chào Quý khách!</div>
            <div class="instruction">
              Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại 
              <strong style="color: #d97706;">TS Restaurant</strong>. 
              Vui lòng sử dụng mã xác thực bên dưới để tiếp tục:
            </div>

            <div class="otp-container">
              <div class="otp-icon">🔑</div>
              <div class="otp-label">Mã Xác Thực Của Bạn</div>
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
              Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.
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
