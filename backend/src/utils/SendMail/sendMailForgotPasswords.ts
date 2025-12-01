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

export default async function sendMailForgotPassword(
  email: string,
  otp: string
): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: `Maison Blanche <${RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          /* Email-safe, elegant French restaurant style */
          body {
            font-family: Georgia, 'Times New Roman', serif;
            background-color: #f7f4ef; /* warm cream */
            margin: 0;
            padding: 20px 0;
            color: #2b2b2b;
          }
          .container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.06);
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          }
          .header {
            background-color: #faf6f2;
            padding: 28px 30px;
            text-align: center;
            border-bottom: 1px solid rgba(0,0,0,0.04);
          }
          .brand {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 26px;
            color: #6b3e26; /* deep chocolate/gold tone */
            letter-spacing: 1px;
            margin: 0;
          }
          .subtle {
            color: #8b7b6b;
            font-size: 13px;
            margin-top: 6px;
          }
          .content {
            padding: 30px;
            line-height: 1.6;
          }
          .lead {
            font-family: Georgia, serif;
            font-size: 16px;
            color: #3a3a3a;
            margin-bottom: 18px;
          }
          .instruction {
            font-size: 15px;
            color: #5a4b42;
            margin-bottom: 22px;
          }
          .otp-card {
            display: block;
            max-width: 360px;
            margin: 0 auto 22px auto;
            background: linear-gradient(180deg, #fffaf6, #fff8f2);
            border: 1px solid rgba(107,62,38,0.12);
            padding: 18px 20px;
            border-radius: 6px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(107,62,38,0.06);
          }
          .otp {
            font-family: 'Courier New', Courier, monospace;
            font-size: 28px;
            color: #6b3e26;
            letter-spacing: 6px;
            font-weight: 700;
            margin: 6px 0 0 0;
          }
          .note {
            font-size: 13px;
            color: #8b7b6b;
            text-align: center;
            margin-top: 12px;
          }
          .footer {
            padding: 18px 30px;
            text-align: center;
            font-size: 13px;
            color: #7a6b60;
            border-top: 1px solid rgba(0,0,0,0.04);
            background-color: #fffaf8;
          }
          .footer strong { color: #6b3e26; }

          /* Responsive tweaks */
          @media only screen and (max-width: 480px) {
            .container { margin: 0 12px; }
            .brand { font-size: 20px; }
            .otp { font-size: 22px; letter-spacing: 4px; }
            .content { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">Maison Blanche</h1>
            <div class="subtle">Fine French Dining • Authentic flavours</div>
          </div>
          <div class="content">
            <div class="lead">Hello,</div>
            <div class="instruction">We have received a request to reset the password for the account associated with this email address. Please use the code below to verify and reset your password.</div>

            <span class="otp-card">
              <div style="font-size:12px;color:#b79a7a;text-transform:uppercase;">Verification Code</div>
              <div class="otp">${otp}</div>
            </span>

            <div class="note">The code is only valid for a short period. If you did not request this, please ignore this email or contact us if you need assistance.</div>
          </div>
          <div class="footer">
            Regards,<br/>
            <strong>Maison Blanche</strong>
            <div style="margin-top:6px;font-size:12px;color:#a89280;">Rue de la Table • Paris</div>
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

    console.log("Forgot password email sent successfully:", data?.id);
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    throw error;
  }
}
