import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/User.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CommonService } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
    private commonService: CommonService,
  ) {}
  getHello(): string {
    return 'Hello World! from auth microservice';
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashPassword = await this.hash(createUserDto.password);
    createUserDto.password = hashPassword;
    // generate verification code
    const verificationCode = Math.floor(Math.random() * 100000 + 1);
    createUserDto.verificationCode = `${verificationCode}`;
    const createdUser = await this.userModel.create(createUserDto);
    // send mail for email verification
    this.commonService.sendMail({
      to: createdUser.email,
      subject: 'Verifying User',
      message: `Hey ${createdUser.name}, Please verify your account by typing ${verificationCode} code`,
    });

    // emit message to the queue
    this.notificationClient.emit('user_registered', createdUser.email);
    return {
      message: 'User created successfully, Please verify your account!',
      data: null,
    };
  }

  // function for verifying account
  async verifyAccount(otp: string, request: any) {
    const userFound = await this.userModel.findById(request.user.id);
    if (!userFound) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // checking the otp
    if (userFound.verificationCode != otp) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // update user verified
    await this.userModel.findByIdAndUpdate(request.user.id, { verified: true });
    return 'user verified successfully';
  }

  // function for verifying account
  async resendVerificationCode(request: any) {
    const userFound = await this.userModel.findById(request.user.id);
    if (!userFound) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const verificationCode = Math.floor(Math.random() * 100000 + 1);
    await this.userModel.findByIdAndUpdate(request.user.id, {
      verificationCode,
    });
    this.commonService.sendMail({
      to: userFound.email,
      subject: 'Resend verification code',
      message: `Hey ${userFound.name}, Please verify your account by typing ${verificationCode} code`,
    });
    return 'resend verification code is sent';
  }

  async registerByGoogle(userRegister: any) {
    // checking user already exit or not
    const user = await this.userModel.findOne({ email: userRegister.email });
    if (user) {
      return {
        name: user.name,
        id: user._id,
      };
    }
    const createUser = await this.userModel.create(userRegister);

    return {
      id: createUser._id,
      name: createUser.name,
    };
  }

  // function for getHash Password
  async hash(key: string) {
    const hash = await bcrypt.hash(key, 10);
    return hash;
  }

  async login(loginUserDto: LoginUserDto) {
    // check user is available in the db
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // compare the password
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const payload = { id: user._id, name: user.name, role: user.role };
    // generating token for login user
    const jwtToken = await this.jwtService.signAsync(payload);
    return { data: jwtToken };
  }

  // function for forget Password
  async forgetPassword(mailId: string) {
    const user = await this.userModel.findOne({ email: mailId });
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    // creating a token
    const tokenForResetPassword = await this.jwtService.signAsync(
      {
        id: user._id,
      },
      {
        expiresIn: 60, // 60 seconds
      },
    );
    // sending link for forget password
    this.commonService.sendMail({
      to: user.email,
      subject: 'Forget Password',
      message: `Hey ${user.name}, Please use this link to add your new password http://localhost:3000/auth/reset-password/${tokenForResetPassword}`,
    });
    return 'Please check your mail';
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'hello',
      });
      // update password
      await this.userModel.findByIdAndUpdate(payload.id, {
        password: newPassword,
      });
    } catch (err) {
      return err;
    }
  }
}
