import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from 'src/helper/config.service';

const configService = new ConfigService(`${process.env.NODE_ENV || ''}.env`);

const isAuth = configService.get('AUTH') === 'TRUE';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    // const authorization = headers.authorization;

    //do something to check auth

    //

    if (isAuth) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
