import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  @ApiOperation({ summary: 'Login to create a jwt' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  @ApiResponse({ status: 400, description: 'Unauthorized' })
  @ApiBody({ 
    type: LoginDto,
    description: 'Json structure for login',})
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
