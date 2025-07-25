import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator"


export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}