import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpCode, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreateCastMemberDto } from './dto/create-cast-member.dto';
import { UpdateCastMemberDto } from './dto/update-cast-member.dto';
import { CreateCastMemberUsecase } from '@core/cast-member/application/use-case/create-cast-member/create-cast-member.usecase';
import { UpdateCastMemberUsecase } from '@core/cast-member/application/use-case/update-cast-member/update-cast-member.usecase';
import { GetCastMemberUsecase } from '@core/cast-member/application/use-case/get-cast-member/get-cast-member.usecase';
import { ListCastMemberUsecase } from '@core/cast-member/application/use-case/list-cast-member/list-cast-member.usecase';
import { DeleteCastMemberUsecase } from '@core/cast-member/application/use-case/delete-cast-member/delete-cast-member.usecase';
import { SearchCastMemberDto } from './dto/search-cast-member.dto';

@Controller('cast-member')
export class CastMemberController {
  constructor(private readonly castMemberService: any) { }

  @Inject(CreateCastMemberUsecase)
  private createUseCase: CreateCastMemberUsecase;

  @Inject(UpdateCastMemberUsecase)
  private updateUseCase: UpdateCastMemberUsecase;

  @Inject(GetCastMemberUsecase)
  private getUseCase: GetCastMemberUsecase;

  @Inject(ListCastMemberUsecase)
  private listUseCase: ListCastMemberUsecase;

  @Inject(DeleteCastMemberUsecase)
  private deleteUseCase: DeleteCastMemberUsecase;

  @Post()
  async create(@Body() createCastMemberDto: CreateCastMemberDto) {
    return await this.createUseCase.execute(createCastMemberDto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    return await this.getUseCase.execute({ id });
  }

  @Get()
  async search(
    @Query() searchParamsDto: SearchCastMemberDto
  ) {
    return await this.listUseCase.execute(searchParamsDto);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string, @Body() updateCastMemberDto: UpdateCastMemberDto) {
    return await this.updateUseCase.execute({
      ...updateCastMemberDto,
      id
    });
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    return await this.deleteUseCase.execute({ id });
  }
}
