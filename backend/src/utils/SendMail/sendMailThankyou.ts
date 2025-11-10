import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;
if (
  !CLIENT_ID ||
  !CLIENT_SECRET ||
  !REDIRECT_URI ||
  !REFRESH_TOKEN ||
  !EMAIL_USER
) {
  // Fail fast so missing env is obvious when importing the module
  throw new Error(
    "Missing one of required env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, EMAIL_USER"
  );
}
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export default async function sendMailThankYou(email: string): Promise<void> {
  try {
    // getAccessToken() can return a string or an object depending on googleapis version
    const atResponse = await oAuth2Client.getAccessToken();
    const accessToken =
      typeof atResponse === "string" ? atResponse : atResponse?.token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const info = await transport.sendMail({
      from: `"Maison Blanche" <${EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Choosing Maison Blanche",
      text: `Thank you for using our services at Maison Blanche. We are honored to serve you.`,
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
            font-size: 18px;
            color: #6b3e26;
            margin-bottom: 18px;
            font-weight: bold;
            text-align: center;
          }
          .message {
            font-size: 15px;
            color: #5a4b42;
            margin-bottom: 22px;
            text-align: center;
            line-height: 1.8;
          }
          .highlight {
            color: #6b3e26;
            font-weight: 600;
          }
          .divider {
            height: 1px;
            background-color: rgba(107,62,38,0.12);
            margin: 24px 0;
          }
          .appreciation {
            background: linear-gradient(180deg, #fffaf6, #fff8f2);
            border: 1px solid rgba(107,62,38,0.12);
            padding: 20px;
            border-radius: 6px;
            text-align: center;
            margin-bottom: 22px;
            box-shadow: 0 4px 12px rgba(107,62,38,0.06);
          }
          .appreciation-text {
            font-family: Georgia, serif;
            font-size: 16px;
            color: #6b3e26;
            font-style: italic;
            margin: 0;
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
            .lead { font-size: 16px; }
            .message { font-size: 14px; }
            .content { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">Maison Blanche</h1>
            <div class="subtle">French Fine Dining • Authentic Experience</div>
          </div>
          <div class="content">
            <div class="lead">Thank You</div>
            <div class="message">We sincerely thank you for trusting and using the <span class="highlight">services of Maison Blanche</span>.</div>

            <div class="divider"></div>

            <div class="appreciation">
              <p class="appreciation-text">"You are our greatest honor"</p>
            </div>

            <div class="message">
              Every time you visit us, we strive to provide you with the finest culinary experiences, with exquisite dishes, attentive service, and a warm atmosphere. Your satisfaction is our greatest motivation to continuously improve our service.
            </div>

            <div class="message" style="margin-bottom: 0;">
              We look forward to continuing to serve you and hope to receive your valuable feedback to help us become even better.
            </div>
          </div>
          <div class="footer">
            Warm Regards,<br/>
            <strong>Maison Blanche</strong>
            <div style="margin-top:6px;font-size:12px;color:#a89280;">French Culinary Restaurant • Hanoi</div>
          </div>
        </div>
      </body>
      </html>
      `,
    });

    console.log("Thank you email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending thank you email:", error);
    throw error;
  }
}
