import { UpdateCastMemberUsecase } from "../update-cast-member.usecase";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { UpdateCastMemberInput } from "../update-cast-member.input";
import { NotFoundError } from "@core/shared/domain/error/not-found.error";
import { Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { EntityValidationError } from "@core/shared/domain/validators/validation.errors";
import { InvalidCastMemberTypeError } from "@core/cast-member/domain/cast-member-type.vo";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CastMemberModel } from "@core/cast-member/infra/db/sequelize/cast-member.model";
import { CastMemberSequelizeRepository } from "@core/cast-member/infra/db/sequelize/cast-member.repository";





describe("UpdateCastMemberUseCase Int Test", () => {

    setupSequelize({ models: [CastMemberModel] });

    let repository: CastMemberSequelizeRepository;
    let useCase: UpdateCastMemberUsecase;
    let castMember: CastMember;

    beforeEach(async () => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new UpdateCastMemberUsecase(repository);
        castMember = CastMember.fake().aCastMember().build();
        const findEntity = await CastMemberModel.findOne({
            where: { cast_member_id: castMember.cast_member_id.id }
        });
        if (findEntity) {
            await CastMemberModel.destroy({ where: { cast_member_id: castMember.cast_member_id.id } });
        }
        await CastMemberModel.create({ ...castMember.toJson(), cast_member_type: castMember.cast_member_type._cast_member_type });

    });


    it("should throw error when entity not found", async () => {
        const input = new UpdateCastMemberInput({ id: "fake uuid", name: "New Name" });
        await expect(() => useCase.execute(input))
            .rejects.toThrow("Invalid UUID: fake uuid");

        const uuid = new Uuid().id;
        const notFoundInput = new UpdateCastMemberInput({ id: `${uuid}`, name: "New Name" });
        await expect(() => useCase.execute(notFoundInput))
            .rejects.toThrow(new NotFoundError(uuid, repository.getEntity()));
    });

    it("shhould throw error when entity not valid", async () => {
        const input = new UpdateCastMemberInput({ id: castMember.cast_member_id.id, name: "N".repeat(256) });
        await expect(() => useCase.execute(input))
            .rejects.toThrow(EntityValidationError);
    });

    it("should throw error when cast member type is invalid", async () => {
        const input = new UpdateCastMemberInput({ id: castMember.cast_member_id.id, name: "New Name", cast_member_type: 3 });
        await expect(() => useCase.execute(input))
            .rejects.toThrow(InvalidCastMemberTypeError);
    });

    it("should update a cast member", async () => {
        const spyUpdate = jest.spyOn(repository, "update");
        const spyFindById = jest.spyOn(repository, "findById");

        type Arrange = {
            input: {
                id: string;
                name: string;
                cast_member_type?: number;
            };
            expected: {
                id: string;
                name: string;
                cast_member_type: string;
                created_at: Date;
            };
        };

        const arrange: Arrange[] = [
            {
                input: {
                    id: castMember.cast_member_id.id,
                    name: "Updated Name",
                    cast_member_type: 2
                },
                expected: {
                    id: castMember.cast_member_id.id,
                    name: "Updated Name",
                    cast_member_type: "2_Director",
                    created_at: castMember.created_at
                }
            },
            {
                input: {
                    id: castMember.cast_member_id.id,
                    name: "Another Update",
                    cast_member_type: 1
                },
                expected: {
                    id: castMember.cast_member_id.id,
                    name: "Another Update",
                    cast_member_type: "1_Actor",
                    created_at: castMember.created_at
                }
            }
        ];

        for (const i of arrange) {
            let input = new UpdateCastMemberInput(i.input);
            let output = await useCase.execute(input);
            expect(output).toStrictEqual({
                id: i.expected.id,
                name: i.expected.name,
                cast_member_type: i.expected.cast_member_type,
                created_at: i.expected.created_at,
            });
            const Model = await CastMemberModel.findOne({
                where: { cast_member_id: i.expected.id }
            });
            expect(Model.toJSON()).toStrictEqual({
                cast_member_id: i.expected.id,
                name: i.expected.name,
                cast_member_type: i.input.cast_member_type,
                created_at: i.expected.created_at
            });
        }
        expect(spyUpdate).toHaveBeenCalledTimes(arrange.length);
        expect(spyFindById).toHaveBeenCalledTimes(arrange.length);




    });

});

