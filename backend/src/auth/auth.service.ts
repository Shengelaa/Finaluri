import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService, 
  ) {}

  async signUp({ name, email, lastname, password }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('Account with that email already exists');
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

  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel
      .findOne({ email })
      .select('password');

    if (!existUser) {
      throw new BadRequestException('invalid credentials');
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual) {
      throw new BadRequestException('invalid credentials');
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
}
