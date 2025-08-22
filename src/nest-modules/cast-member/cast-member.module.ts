import { Module } from '@nestjs/common';
import { CastMemberController } from './cast-member.controller';
import { CAST_MEMBER_PROVIDERS } from './cast-member.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';

@Module({
  imports: [SequelizeModule.forFeature([CastMemberModel])],
  controllers: [CastMemberController],
  providers: [
    ...Object.values(CAST_MEMBER_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBER_PROVIDERS.USE_CASES)
  ],
  exports: [
    CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide
  ]
})
export class CastMemberModule { }
