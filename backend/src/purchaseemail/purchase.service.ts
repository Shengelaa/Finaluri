import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendThankYou(to: string, summary: number) {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject: 'Thank you for your purchase!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><title>Your Purchase Has been confirmed!</title>
        <style>
          body {
            margin: 0; padding: 0;
            background-color: #fafafa;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          .wrapper {
            padding: 40px 0;
            text-align: center;
          }
          .card {
            display: inline-block;
            background-color: #fff;
            max-width: 600px;
            width: 90%;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
            text-align: left;
          }
          .header {
            background-color: #000;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            color: #fff;
            font-size: 24px;
          }
          .content {
            padding: 30px 20px;
            color: #333;
            line-height: 1.5;
          }
          .content h2 {
            margin-top: 0;
            font-size: 22px;
          }
          .btn {
            display: inline-block;
            margin: 25px 0;
            background-color: #000;
            color: #FFFFFF;
            padding: 12px 22px;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-weight: 600;
          }
          .footer {
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          /* Responsive tweaks */
          @media screen and (max-width: 600px) {
            .content, .header {
              padding-left: 15px;
              padding-right: 15px;
            }
          }
        </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <div class="header">
                <h1>🤍Purchase Confirmed🤍</h1>
              </div>
              <div class="content">
                <h2>Hello Again!</h2>
                <p>Thank you for the purchase you made! Total Spent: $${summary}</p>
                <p><a href="https://yourapp.com/start" class="btn">Our Shop</a></p>
                <p>Don't forget this is demo app :)</p>
                <p><a href="mailto:support@yourapp.com">support@yourapp.com</a></p>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} Your App. All rights reserved.
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
