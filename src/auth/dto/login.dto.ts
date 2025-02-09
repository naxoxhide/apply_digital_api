import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'test@test.com'
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: '123123'
  })
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;
}
