"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = class MailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }
    async sendWelcomeEmail(to, name) {
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to,
            subject: 'Welcome to Our App!',
            html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><title>Welcome!</title>
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
                <h1>🤍 Welcome to Our App 🤍</h1>
              </div>
              <div class="content">
                <h2>Hello, ${name}!</h2>
                <p>Thank you for signing up! We’re thrilled to have you join us.</p>
                <p><a href="https://yourapp.com/start" class="btn">Get Started</a></p>
                <p>If you have any questions, feel free to reach out:</p>
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
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map