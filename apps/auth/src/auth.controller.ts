import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard as inbuildAuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@app/common';
import { ForgetPasswordDto } from './dto/ForgetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  // login with gooele
  @ApiTags('Auth')
  @Get('googleLogin')
  @UseGuards(inbuildAuthGuard('google'))
  googleAuth() {
    console.log('// Initiates the Google OAuth2 login process');
  }

  @Get('/google/callback')
  @UseGuards(inbuildAuthGuard('google'))
  async callBack(@Req() req) {
    // checking user register or not
    const userDetails: any = await this.authService.registerByGoogle({
      email: req.user.email,
      name: req.user.firstName + ' ' + req.user.lastName,
      registerBy: 'google',
      verified: true,
    });
    const jwtToken = await this.jwtService.signAsync(userDetails);
    return jwtToken;
  }

  @ApiTags('Auth')
  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @ApiTags('Auth')
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiTags('Auth')
  @Post('verifyAccount')
  verifyUser(@Body() body: { otp: string }, @Req() req: Request) {
    return this.authService.verifyAccount(body.otp, req);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiTags('Auth')
  @Post('resendVerificationCode')
  resendVerificationCode(@Req() req: Request) {
    return this.authService.resendVerificationCode(req);
  }

  @ApiTags('Auth')
  @Post('forgetPassword')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto.email);
  }

  @ApiTags('Auth')
  @Get('reset-password/:tokenForResetPassword')
  resetPassword(
    @Param() token: { tokenForResetPassword: string },
    @Body() body: { password: string },
  ) {
    return this.authService.resetPassword(
      token.tokenForResetPassword,
      body.password,
    );
  }
}
