import { Module } from '@nestjs/common';
import { DemoModule } from './modules/demo/demo.module';
import { ConfigModule } from '@nestjs/config';
import {MainModule} from "./modules/main/main.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV || ''}.env`,
      isGlobal: true,
    }),
    DemoModule,
    MainModule
  ],
})
export class AppModule {}
