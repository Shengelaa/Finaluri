import { SignUpDto } from './dto/sign-up.dto';
import { Model } from 'mongoose';
import { User } from '../users/schema/user.schema';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private userModel;
    private jwtService;
    private mailService;
    constructor(userModel: Model<User>, jwtService: JwtService, mailService: MailService);
    signUp({ name, email, lastname, password }: SignUpDto): Promise<{
        message: string;
        data: {
            name: string;
            email: string;
            lastname: string;
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    signIn({ email, password }: SignInDto): Promise<{
        token: string;
    }>;
    getCurrentUser(userId: any): Promise<(import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
