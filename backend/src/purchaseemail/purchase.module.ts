import { Module } from '@nestjs/common';
import { MailService } from './purchase.service';


@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
