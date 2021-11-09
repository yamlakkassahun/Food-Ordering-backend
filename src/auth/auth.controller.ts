import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDto, AuthCredentialSignInDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() authCredentialDto: AuthCredentialDto) {
    return await this.authService.SignUp(authCredentialDto);
  }

  @Post('/signin')
  async signin(@Body() authCredentialSignInDto: AuthCredentialSignInDto) {
    return await this.authService.SignIn(authCredentialSignInDto);
  }

  @Get('/user')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    return req.user;
  }
}
