import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
  throw new Error(
    "Missing one of required env vars: RESEND_API_KEY, RESEND_FROM_EMAIL"
  );
}

const resend = new Resend(RESEND_API_KEY);

export default async function sendMailThankYou(email: string): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
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
          .title {
            font-size: 24px;
            color: #92400e;
            margin-bottom: 25px;
            font-weight: 700;
            text-align: center;
          }
          .message {
            font-size: 15px;
            color: #44403c;
            margin-bottom: 25px;
            line-height: 1.8;
            text-align: center;
          }
          .highlight {
            color: #d97706;
            font-weight: 700;
          }
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #fbbf24, transparent);
            margin: 30px 0;
          }
          .appreciation-card {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 3px solid #f59e0b;
            border-radius: 16px;
            padding: 30px 25px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.12);
          }
          .appreciation-icon {
            font-size: 50px;
            margin-bottom: 15px;
          }
          .appreciation-text {
            font-size: 18px;
            color: #92400e;
            font-weight: 700;
            font-style: italic;
            line-height: 1.6;
          }
          .features-box {
            background: #ffffff;
            border: 2px solid #fbbf24;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
          }
          .features-title {
            font-size: 14px;
            color: #92400e;
            font-weight: 700;
            margin-bottom: 18px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .feature-item {
            font-size: 14px;
            color: #44403c;
            margin: 12px 0;
            padding-left: 28px;
            position: relative;
            line-height: 1.6;
          }
          .feature-item::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #f59e0b;
            font-weight: 900;
            font-size: 16px;
          }
          .closing-message {
            background: #fafaf9;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin-top: 25px;
            font-size: 14px;
            color: #57534e;
            line-height: 1.8;
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
          .social-icons {
            margin-top: 15px;
            font-size: 18px;
            letter-spacing: 8px;
          }
          @media only screen and (max-width: 480px) {
            .container { margin: 0 10px; }
            .brand { font-size: 24px; }
            .title { font-size: 20px; }
            .appreciation-text { font-size: 16px; }
            .content { padding: 25px 20px; }
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
            <div class="title">Chân Thành Cảm Ơn! ❤️</div>
            <div class="message">
              Chúng tôi xin gửi lời cảm ơn chân thành đến Quý khách đã tin tưởng và lựa chọn 
              <span class="highlight">TS Restaurant</span> trong những khoảnh khắc sum vầy bên gia đình.
            </div>

            <div class="divider"></div>

            <div class="appreciation-card">
              <div class="appreciation-icon">🙏</div>
              <p class="appreciation-text">"Quý khách là niềm vinh dự của chúng tôi"</p>
            </div>

            <div class="features-box">
              <div class="features-title">Cam Kết Của Chúng Tôi</div>
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
              Sự hài lòng của Quý khách là động lực lớn nhất để TS Restaurant ngày càng hoàn thiện. 
              Chúng tôi rất mong được tiếp tục phục vụ Quý khách trong những lần ghé thăm tới!
            </div>

            <div class="divider"></div>

            <div class="message" style="font-size: 14px; color: #78716c;">
              Hẹn gặp lại Quý khách rất sớm! 🌟
            </div>
          </div>
          <div class="footer">
            <div class="footer-brand">TS RESTAURANT</div>
            <div class="footer-info">
              📍 Việt Nam • ☎️ 1900-xxxx<br/>
              Phục vụ tận tâm • Hương vị đậm đà
            </div>
            <div class="social-icons">📱💬🌐</div>
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

    console.log("Thank you email sent successfully:", data?.id);
  } catch (error) {
    console.error("Error sending thank you email:", error);
    throw error;
  }
}
