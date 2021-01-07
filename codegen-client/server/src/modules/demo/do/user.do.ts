import { ApiProperty } from '@nestjs/swagger';

export class UserDo {
  @ApiProperty({ description: '姓名' })
  name: string;
  @ApiProperty({ description: '年级' })
  age: number;
  @ApiProperty({ description: '性别，0：女，1：男' })
  sexy: number;
}
