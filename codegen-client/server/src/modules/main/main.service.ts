import {HttpException, Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { exec }  from 'child_process'
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as archiver from 'archiver';
import * as rimraf from 'rimraf'
import {LanguageDo} from "./do/main.do";

@Injectable()
export class MainService {

    private logger = new Logger('MainService');

    private runPath = path.join(process.cwd(),'../..')

    private outPath = path.join(process.cwd(),'../../output')

    constructor(private configService: ConfigService) {
    }

    getLanguages():Promise<LanguageDo[]>{
        const folder = path.join(this.runPath, this.configService.get('CLIENTS_FOLDER'))
        return new Promise((resolve, reject) => {
            fs.readdir(folder,{withFileTypes:true},(err,files)=>{
                if(err){
                    this.logger.error(err)
                    reject(err);
                    return;
                }
                const languages = files.filter(v=>v.isDirectory()).map(v=>{
                    return  {
                        name:v.name, description:v.name
                    }
                })
                resolve(languages)
            })
        })
    }

    generateApis(language:string,fileUrl:string):Promise<string>{
        const uuid = uuidv4();
        const cmd = `java -cp "custom/${language}/target/${language}-swagger-codegen-1.0.0.jar;modules/swagger-codegen-cli/target/swagger-codegen-cli.jar"   io.swagger.codegen.SwaggerCodegen generate -l ${language} -i ${fileUrl} -o output/${uuid}`
        return new Promise((resolve,reject)=>exec(cmd,{
            encoding: 'binary',
            cwd:this.runPath
        }, (err, stdout, stderr) => {
            if (err) {
                this.logger.error(`生成client code报错: ${err}`);
                reject(err);
            }
            this.logger.log(`swagger文档【${decodeURI(fileUrl)}】 client code生成成功，目录--【${uuid}】`)
            resolve(uuid);
        }));
    }

    zipOutputApis(uuid:string,fileUrl:string):Promise<string>{
        const archive = archiver('zip');
        const outputZipPath = path.join(this.outPath,`${uuid}.zip`);
        const output = fs.createWriteStream(outputZipPath);
        this.logger.log(`开始压缩目录【${uuid}】`);
        return new Promise((resolve, reject) => {
            archive.pipe(output);
            archive.directory(path.join(this.outPath,uuid), uuid);
            archive.on('error', (err)=>{
                this.logger.error('压缩client code报错：'+err);
                reject(err);
            });
            output.on('close', () => {
                this.logger.log('目标['+decodeURI(fileUrl)+']已生成client code,总共'+archive.pointer() + 'bytes');
                this.logger.log('目标['+decodeURI(fileUrl)+']client code,一分钟后将被清除！');
                setTimeout(()=>{
                    rimraf(path.join(this.outPath,uuid),(err)=>{
                        if(err) this.logger.log('清除文件失败：'+err);
                    })
                    rimraf(path.join(this.outPath,`${uuid}.zip`),(err)=>{
                        if(err) this.logger.log('清除文件失败：'+err);
                    })
                },60*1000)
                resolve(`${uuid}.zip`);

            });
            archive.finalize();
        });
    }

    async getClientZip(language:string,fileUrl:string):Promise<string>{
        const uuid = await this.generateApis(language,fileUrl);
        return await this.zipOutputApis(uuid,fileUrl);
    }

}
