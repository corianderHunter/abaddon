import {
    Controller,
    Get,
    HttpException,
    UseGuards,
    Query, Post, Param, Body, Logger, Response,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiOkResponse,
    ApiQuery, ApiBody, ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { buildCustomResponseVo } from '../common/do/reponse.do';
import {MainService} from "./main.service";
import {LanguageDo} from "./do/main.do";
import {GenerateApisBody} from "./do/main.do";
import {createReadStream} from "fs";

@Controller('main')
@ApiTags('Main')
@UseGuards(new AuthGuard())
export class MainController {
    private logger = new Logger('MainService');

    constructor(private readonly mainService: MainService) {}

    @Get('languages')
    @ApiOperation({
        summary: 'get languages',
        operationId: 'getLanguages',
    })
    @ApiOkResponse({
        type: buildCustomResponseVo(LanguageDo,true),
    })
    async getLanguage(){
        const languages:LanguageDo[] = await this.mainService.getLanguages();
        return languages;
    }

    @Post('generateApis')
    @ApiOperation({
        summary: '生成 fetch apis',
        operationId: 'generateApis',
    })
    @ApiOkResponse({
        type: buildCustomResponseVo(String),
    })
    @ApiBody({
        type:GenerateApisBody
    })
   async generateApis(@Body('language') language,@Body('fileUrl') fileUrl,@Response() response) {
        fileUrl = encodeURI(fileUrl)
        const outputPath =  await this.mainService.getClientZip(language,fileUrl).catch(e=> {
            throw  new HttpException(e,400)
        });
        response.send('/static/'+outputPath);
    }
}
