import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from './guards/isAuth.guard';
import { UserId } from '../users/decorators/user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.signIn(signInDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,       
      sameSite: 'none',   
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    });

    return { message: 'signed in successfully' };
  }

  @Post('sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'signed out' };
  }

  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@UserId() userId) {
    return this.authService.getCurrentUser(userId);
  }
}

// import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

// import { SignUpDto } from './dto/sign-up.dto';
// import { SignInDto } from './dto/sign-in.dto';
// import { IsAuthGuard } from './guards/isAuth.guard';
// import { UserId } from '../users/decorators/user.decorator';
// import { AuthService } from './auth.service';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('sign-up')
//   signUp(@Body() signUpDto: SignUpDto) {
//     return this.authService.signUp(signUpDto);
//   }

//   @Post('sign-in')
//   signIn(@Body() signInDto: SignInDto) {
//     return this.authService.signIn(signInDto);
//   }

//   @Get('current-user')
//   @UseGuards(IsAuthGuard)
//   getCurrentUser(@UserId() userId) {
//     return this.authService.getCurrentUser(userId);
//   }
// }

