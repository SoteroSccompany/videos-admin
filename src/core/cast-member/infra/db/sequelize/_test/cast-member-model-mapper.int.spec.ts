import { DataType, Sequelize } from "sequelize-typescript";
import { before } from "lodash";
import { Config } from "../../../../../shared/infra/config";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { CastMemberModel } from "../cast-member.model";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { CastMemberModelMapper } from "../cast-member-model-mapper";
import { CastMemberType, InvalidCastMemberTypeError } from "@core/cast-member/domain/cast-member-type.vo";
import { Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { EntityValidationError } from "@core/shared/domain/validators/validation.errors";


describe('CastMemberModelMapper test', () => {

    setupSequelize({ models: [CastMemberModel] });


    describe('Entity errors', () => {
        let castMember: CastMember;


        beforeEach(() => {
            castMember = null;
        });

        it("should throw an error when entity name is invalid", () => {
            expect.assertions(2);
            const model = CastMemberModel.build({
                cast_member_id: new Uuid().id,
                name: 'a'.repeat(256),
                cast_member_type: 1,
            });
            try {
                CastMemberModelMapper.toEntity(model);
                fail("The cast member is valid, but it needs throws a EntityValidationError");
            } catch (error) {
                expect(error).toBeInstanceOf(EntityValidationError);
                expect((error as EntityValidationError).errors).toMatchObject([
                    {
                        name: [
                            "name must be shorter than or equal to 255 characters",
                        ]
                    }
                ]);
            }
        });

        it("should throw an error when entity is invalid", () => {
            expect.assertions(2);
            const model = CastMemberModel.build({
                cast_member_id: new Uuid().id,
                name: 'a',
                cast_member_type: 3,
            });
            try {
                CastMemberModelMapper.toEntity(model);
                fail("The cast member is valid, but it needs throws a EntityValidationError");
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidCastMemberTypeError);
                expect((error as InvalidCastMemberTypeError).message).toBe("Ivalid cast member type. Allowed values are 1 or 2");
            }
        });




    });


    it("should convert a CastMemberModel to a CastMember entity", () => {
        const model = CastMemberModel.build({
            cast_member_id: new Uuid().id,
            name: 'Cast Member Name',
            cast_member_type: 1,
            created_at: new Date(),
        });
        const entity = CastMemberModelMapper.toEntity(model);

        expect(entity).toBeInstanceOf(CastMember);
        expect(entity.cast_member_id).toBeInstanceOf(Uuid);
        expect(entity.cast_member_id.id).toBe(model.cast_member_id);
        expect(entity.name).toBe('Cast Member Name');
        expect(entity.cast_member_type).toBeInstanceOf(CastMemberType);
        expect(entity.cast_member_type.cast_member_type).toBe(1);
        expect(entity.created_at).toBeInstanceOf(Date);
    });


    it("should convert a CastMember entity to a CastMemberModel", () => {
        const entity = new CastMember({
            cast_member_id: new Uuid(),
            name: 'Cast Member Name',
            cast_member_type: new CastMemberType(1),
        });
        const model = CastMemberModelMapper.toModel(entity);


        expect(model).toBeInstanceOf(CastMemberModel);
        expect(model.cast_member_id).toBe(entity.cast_member_id.id);
        expect(model.name).toBe('Cast Member Name');
        expect(model.cast_member_type).toBe(1);
        expect(model.created_at).toBeInstanceOf(Date);
    });





});