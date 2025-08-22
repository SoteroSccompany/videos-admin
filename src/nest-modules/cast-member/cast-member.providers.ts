import { CreateCastMemberUsecase } from "@core/cast-member/application/use-case/create-cast-member/create-cast-member.usecase";
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository";
import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository";
import { CastMemberModel } from "@core/cast-member/infra/db/sequelize/cast-member.model";
import { CastMemberSequelizeRepository } from "@core/cast-member/infra/db/sequelize/cast-member.repository";
import { getModelToken } from "@nestjs/sequelize";
import { UpdateCastMemberUsecase } from "@core/cast-member/application/use-case/update-cast-member/update-cast-member.usecase";
import { DeleteCastMemberUsecase } from "@core/cast-member/application/use-case/delete-cast-member/delete-cast-member.usecase";
import { GetCastMemberUsecase } from "@core/cast-member/application/use-case/get-cast-member/get-cast-member.usecase";
import { ListCastMemberUsecase } from "@core/cast-member/application/use-case/list-cast-member/list-cast-member.usecase";




export const REPOSITORIES = {
    CAST_MEMBER_REPOSITORY: {
        provide: 'CasMemberRepository', //Esse aqui sempre edeixa como o sequelize, caso queira no teste trocar, se utiliza o comentario acima de exemplo
        useExisting: CastMemberSequelizeRepository
    },
    CAST_MEMBER_IN_MEMORY_REPOSITORIY: {
        provide: CastMemberInMemoryRepository,
        useClass: CastMemberInMemoryRepository //Nao precisa de ter dependencia externa, apenas instanciar a classe
    },
    CAST_MEMBER_SEQUELIZE_REPOSITORY: {
        provide: CastMemberSequelizeRepository,
        useFactory: (castMemberModel: typeof CastMemberModel) => {
            return new CastMemberSequelizeRepository(castMemberModel)
        },
        inject: [getModelToken(CastMemberModel)]
    }
}


export const USE_CASES = {
    CREATE_CAST_MEMBER: {
        provide: CreateCastMemberUsecase,
        useFactory: (castMemberRepository: ICastMemberRepository) => {
            return new CreateCastMemberUsecase(castMemberRepository)
        },
        inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide]
    },
    UPDATE_CAST_MEMBER: {
        provide: UpdateCastMemberUsecase,
        useFactory: (castMemberRepository: ICastMemberRepository) => {
            return new UpdateCastMemberUsecase(castMemberRepository)
        },
        inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide]
    },
    DELETE_CAST_MEMBER: {
        provide: DeleteCastMemberUsecase,
        useFactory: (castMemberRepository: ICastMemberRepository) => {
            return new DeleteCastMemberUsecase(castMemberRepository)
        },
        inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide]
    },
    GET_CAST_MEMBER: {
        provide: GetCastMemberUsecase,
        useFactory: (castMemberRepository: ICastMemberRepository) => {
            return new GetCastMemberUsecase(castMemberRepository)
        },
        inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
    },
    LIST_CAST_MEMBER: {
        provide: ListCastMemberUsecase,
        useFactory: (castMemberRepository: ICastMemberRepository) => {
            return new ListCastMemberUsecase(castMemberRepository)
        },
        inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide]
    }

}

export const CAST_MEMBER_PROVIDERS = {
    REPOSITORIES,
    USE_CASES
}