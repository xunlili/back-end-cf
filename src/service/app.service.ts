import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { user } from '../entities/user';
import * as jwt  from 'jsonwebtoken';

@Injectable()
export class AppService {
  constructor(@InjectRepository(user) private readonly userRepository: Repository<user>,){}
  async getHello(data) {
    let saveObj = {
      password : user.setPassword(data.password),
      nackname : data.account
    }
    let findObj = {
      where: {}
    }

    // 判断账号是邮箱还是手机号码
    if(/^1[34578]\d{9}$/.test(data.account)) {
      saveObj['phone'] = data.account
      findObj.where['phone'] = data.account
    } else if(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$ /.test(data.account)) {
      saveObj['email'] = data.account
      findObj.where['email'] = data.account
    }
    
    // 查询账号是否已经注册
    let findResult = await this.userRepository.findOne(findObj)
    let resRgdObj = {
      status: 4010,
      error: 'This account has been registered',
    }
    if(findResult ) throw new HttpException(resRgdObj, HttpStatus.FORBIDDEN)
    let result = await this.userRepository.save(saveObj)
    return result;
  }

  async login(data) {
    let findObj = {
      where: {}
    }

    if(/^1[34578]\d{9}$/.test(data.account)) {
      findObj.where['phone'] = data.account
    } else if(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$ /.test(data.account)) {
      findObj.where['email'] = data.account
    }

    // 验证账户是否存在
    let user = await this.userRepository.findOne(findObj)
    let resRgdObj = {
      status: 4011,
      error: 'This user does not exist',
    }
    if (!user) throw new HttpException(resRgdObj, HttpStatus.FORBIDDEN)

    // 验证密码是否错误
    let resVerRgdObj = {
      status: 4012,
      error: 'password wrong',
    }
    let verify = user.verifyPassword(data.password)
    if (!verify) throw  new HttpException(resVerRgdObj, HttpStatus.FORBIDDEN)

    let signObj = {
      "key": 'text'
    }
    let token = jwt.sign(signObj, process.env.TOKENKEY)
    return {
      status: 200,
      token: token,
      messsage: 'Login successfully'
    }
  }
}
