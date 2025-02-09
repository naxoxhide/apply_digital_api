import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'test@test.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: '123123'
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
