import { ApiProperty } from '@nestjs/swagger';

/** 通用响应VO */
export class ResponseVo {
  @ApiProperty()
  readonly code: number;

  @ApiProperty({})
  readonly msg: string;

  @ApiProperty()
  readonly serverTime: number;
}

export const buildCustomResponseVo = <T>(
  data: { new (...args: any[]): T },
  isArray = false,
) => {
  class CustomResponseVo<T> {
    @ApiProperty()
    readonly code: number;

    @ApiProperty({})
    readonly msg: string;

    @ApiProperty()
    readonly serverTime: number;

    @ApiProperty({ type: data, isArray })
    readonly data;
  }
  return CustomResponseVo;
};
