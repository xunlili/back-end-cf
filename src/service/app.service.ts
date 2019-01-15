import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { user } from '../entities/user';

@Injectable()
export class AppService {
  constructor(@InjectRepository(user) private readonly userRepository: Repository<user>,){}
  async getHello(data) {
    let saveObj = {
      password : data.password,
      nackname : data.account
    }
    let findObj = {
      where: {}
    }
    if(/^1[34578]\d{9}$/.test(data.account)) {
      saveObj['phone'] = data.account
      findObj.where['phone'] = data.account
    } else if(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$ /.test(data.account)) {
      saveObj['email'] = data.account
      findObj.where['email'] = data.account
    }
    
    let findResult = await this.userRepository.findOne(findObj)
    let resRgdObj = {
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }
    if(findResult ) throw new HttpException(resRgdObj, 403)
    let result = await this.userRepository.save(saveObj)
    return result;
  }
}
