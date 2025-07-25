import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../users/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forFeature([{ schema: userSchema, name: 'user' }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
