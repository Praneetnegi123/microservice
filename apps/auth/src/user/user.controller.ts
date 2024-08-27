import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@app/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from '@app/common/Authorization/role.decorator';
import { RolesGuard } from '@app/common/Authorization/role.guard';
import { Role } from '@app/common/Authorization/role.enum';
import { UploadService } from '@app/common/Upload/upload.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiTags('User')
  @Roles(Role.Companies)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Post('profile')
  getMyProfile(@Req() request: Request) {
    return this.userService.getMyProfile(request);
  }

  @ApiTags('User')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('updateProfile')
  updateProfile(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(updateUserDto, request);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @ApiTags('User')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         // 👈 this property
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @Post('uploadProfileImageLocal')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploadedFiles', // specify the destination folder
  //       filename: (req, file, callback) => {
  //         // Preserve the original filename
  //         const originalName = file.originalname;
  //         callback(null, originalName);
  //       },
  //     }),
  //   }),
  // )
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log('local=>', file);
  //   return file;
  // }

  @ApiTags('User')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // 👈 this property
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('uploadProfileImage')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.uploadFile(file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
