import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCastMemberDto } from './create-cast-member.dto';
import { UpdateCastMemberInput } from '@core/cast-member/application/use-case/update-cast-member/update-cast-member.input';

export class UpdateCastMemberDtoWithOutId extends OmitType(UpdateCastMemberInput, [
    'id'
] as const) { }

export class UpdateCastMemberDto extends UpdateCastMemberDtoWithOutId { }
