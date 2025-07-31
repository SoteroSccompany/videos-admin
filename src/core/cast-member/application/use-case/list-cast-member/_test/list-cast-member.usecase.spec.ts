import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository";
import { ListCastMemberUsecase } from "../list-cast-member.usecase";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { CastMemberOutputMapper } from "../../common/cast-member-output";
import { CastMemberSearchParams, CastMemberSearchResult } from "@core/cast-member/domain/cast-member.repository";
import { SortDirection } from "@core/shared/domain/repository/search-params";



describe("ListCastMember Usecase Unit test", () => {


    let repository: CastMemberInMemoryRepository;
    let useCase: ListCastMemberUsecase;
    let castMembers: CastMember[];


    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
        useCase = new ListCastMemberUsecase(repository);
        const created_at = new Date();
        castMembers = [
            CastMember.fake().aCastMember().withCreatedAt((index) => new Date(created_at.getTime() + 1)).withName((i) => `CastMember1`).build(),
            CastMember.fake().aCastMember().withCreatedAt((index) => new Date(created_at.getTime() + 2)).withName((i) => `CastMember2`).build(),
            CastMember.fake().aCastMember().withCreatedAt((index) => new Date(created_at.getTime() + 3)).withName((i) => `CastMember2`).build(),
            CastMember.fake().aCastMember().withCreatedAt((index) => new Date(created_at.getTime() + 4)).withName((i) => `CastMember3`).build(),
            CastMember.fake().aCastMember().withCreatedAt((index) => new Date(created_at.getTime() + 5)).withName((i) => `CastMember4`).build(),
        ]
        repository.items = castMembers;
    });


    /*
        -Mandando apenas sem parametros => Deve vir pelo created_at asc 
        -Mandando apenas com page e per_page => Deve vir pelo created_at asc
        -Mandando apenas com sort e sort_dir => Deve vir pelo sort e sort_dir
        -Mandando apenas com filter => Deve filtrar pelo nome ou tipo do membro do elenco
        -Mandando com todos os parametros => Deve filtrar, ordenar e paginar corretamente    
    */

    it("should test toOutput method", () => {

        let result = new CastMemberSearchResult({
            items: [],
            total: 0,
            current_page: 1,
            per_page: 15
        });

        let output = useCase["toOutput"](result);
        expect(output).toStrictEqual({
            items: [],
            total: 0,
            per_page: 15,
            current_page: 1,
            last_page: 0
        })

        result = new CastMemberSearchResult({
            items: [castMembers[0]],
            total: 5,
            current_page: 1,
            per_page: 1
        })

        output = useCase["toOutput"](result);
        expect(output).toStrictEqual({
            items: [CastMemberOutputMapper.toOutput(castMembers[0])],
            total: 5,
            per_page: 1,
            current_page: 1,
            last_page: 5
        });

    });


    it("should return output sorted by created_at when input param is empty", async () => {
        let outPut = await useCase.execute({});
        expect(outPut).toStrictEqual({
            items: [...repository.items].reverse().map(CastMemberOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 5,
            last_page: 1
        });
    });

    it("should return output sorted by created_at asc, when params is not by created_at asc", async () => {
        let input = {
            sort: "created_at",
            sort_dir: "asc" as SortDirection
        };
        const params = new CastMemberSearchParams(input);
        const outPut = await useCase.execute(params);
        expect(outPut).toStrictEqual({
            items: [...repository.items].map(CastMemberOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 5,
            last_page: 1
        });
    });

    it("should return output filter by name and created_at by desc", async () => {
        let input = new CastMemberSearchParams({
            filter: "CastMember2"
        });
        const outPut = await useCase.execute(input);
        expect(outPut).toStrictEqual({
            items: [...repository.items].slice(1, 3).reverse().map(CastMemberOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 2,
            last_page: 1
        });
    });





});