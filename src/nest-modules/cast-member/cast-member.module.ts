import { Module } from '@nestjs/common';
import { CastMemberController } from './cast-member.controller';

@Module({
  controllers: [CastMemberController],
  // providers: [CastMemberService],
})
export class CastMemberModule { }
