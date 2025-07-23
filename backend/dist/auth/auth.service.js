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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    userModel;
    jwtService;
    mailService;
    constructor(userModel, jwtService, mailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async signUp({ name, email, lastname, password }) {
        const existUser = await this.userModel.findOne({ email });
        if (existUser) {
            throw new common_1.BadRequestException('Account with that email already exists');
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = await this.userModel.create({
            name,
            email,
            lastname,
            password: hashedPass,
            role: 'user',
        });
        await this.mailService.sendWelcomeEmail(email, name);
        return {
            message: 'created successfully',
            data: {
                name,
                email,
                lastname,
                _id: newUser._id,
            },
        };
    }
    async signIn({ email, password }) {
        const existUser = await this.userModel
            .findOne({ email })
            .select('password');
        if (!existUser) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        const isPassEqual = await bcrypt.compare(password, existUser.password);
        if (!isPassEqual) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        const payload = {
            id: existUser._id,
        };
        const token = this.jwtService.sign(payload, { expiresIn: '1h' });
        return { token };
    }
    async getCurrentUser(userId) {
        const user = await this.userModel.findById(userId);
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map