import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DBConfig } from './config/dg.config';
import { UsersModule } from './users/users.module';
import { LoggingMiddleware } from './logger';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DBConfig, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
