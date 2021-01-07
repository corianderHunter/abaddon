import {
  Controller,
  Get,
  HttpException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DemoService } from './demo.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserDo } from './do/user.do';
import { buildCustomResponseVo } from '../common/do/reponse.do';

@Controller('demo')
@ApiTags('Demo')
@UseGuards(new AuthGuard())
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('user')
  @ApiOperation({
    summary: 'get user',
    operationId: 'getUser',
  })
  @ApiOkResponse({
    type: buildCustomResponseVo(UserDo),
  })
  @ApiQuery({ name: 'name', description: '姓名', required: true })
  getUser(@Query('name') name: string) {
    const user = {
      name: name || 'sven',
      age: 27,
      sexy: 0,
    };
    return user;
  }

  @Get()
  @ApiOperation({
    summary: 'hello world get',
    operationId: 'getHello',
  })
  getHello(): string {
    return this.demoService.getHello();
  }

  @Get('/config')
  @ApiOperation({
    summary: 'get config',
    operationId: 'getConfig',
  })
  getConfig(): Record<string, any> {
    return this.demoService.getConfig();
  }

  @Get('/error')
  @ApiOperation({
    summary: 'get error',
    operationId: 'getError',
  })
  getError(): Record<string, any> {
    throw new HttpException('test error', 400);
  }
}
