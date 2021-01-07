import {ApiProperty} from "@nestjs/swagger";


export class LanguageDo {
    @ApiProperty({ description: '名称' })
    name: string;
    @ApiProperty({ description: '描述' })
    description: string;
}

export class GenerateApisBody {
    @ApiProperty({ description: '语言类型' })
    language: string;
    @ApiProperty({ description: '文件地址' })
    fileUrl: string;
}