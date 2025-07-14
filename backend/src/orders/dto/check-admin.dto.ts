import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CheckRoleDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
