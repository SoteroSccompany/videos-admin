import { Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { CastMemberType, InvalidCastMemberTypeError } from "../cast-member-type.vo";
import { CastMember } from "../cast-member.entity";



describe("CastMember entity test", () => {

    describe("constructor", () => {

        let cast_member_type = new CastMemberType(1);
        let created_at = new Date();

        it("should create with default values", () => {
            //@ts-ignore
            const castMember = new CastMember({
                name: "Teste"
            })
            expect(castMember.cast_member_id).toBeDefined();
            expect(castMember.entity_id).toBeInstanceOf(Uuid);
            expect(castMember.cast_member_type).toBeUndefined();
            expect(castMember.created_at).toBeInstanceOf(Date);
        })

        it("should create with all values", () => {
            const castMember = new CastMember({
                name: "Teste",
                cast_member_type,
                created_at
            })
            expect(castMember.cast_member_type).toBeDefined();
            expect(castMember.cast_member_type).toBeInstanceOf(CastMemberType);
            expect(castMember.name).toBe("Teste");
            expect(created_at).toBeInstanceOf(Date);
            expect(created_at).toBe(created_at);
        });

    });

    describe("create command", () => {
        let cast_member_type = new CastMemberType(1);
        let name = "Teste"

        it('should create cast member', () => {
            const spyValidate = jest.spyOn(CastMember.prototype as any, "validate");
            const castMember = CastMember.create({ name, cast_member_type });
            expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
            expect(castMember.cast_member_type).toBeInstanceOf(CastMemberType);
            expect(castMember.name).toBe("Teste");
            expect(spyValidate).toHaveBeenCalled();
        });

        describe('cast_member_id', () => {
            const arrange = [
                { cast_member_id: undefined }, { cast_member_id: null }, { cast_member_id: new Uuid }
            ]
            test.each(arrange)('cast_member_id is %j', ({ cast_member_id }) => {
                const castMember = new CastMember({ cast_member_id, cast_member_type, name })
                expect(castMember.entity_id).toBeInstanceOf(Uuid);
                expect(castMember.cast_member_id).toBeInstanceOf(Uuid)
                if (cast_member_id instanceof Uuid) {
                    expect(castMember.cast_member_id).toBe(cast_member_id)
                }
            });
        })

        it("should change name", () => {
            const spyValidate = jest.spyOn(CastMember.prototype as any, "validate");
            const castMember = CastMember.create({ name, cast_member_type });
            expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
            expect(castMember.cast_member_type).toBeInstanceOf(CastMemberType);
            expect(spyValidate).toHaveBeenCalledTimes(1);
            expect(castMember.name).toBe("Teste");
            castMember.changeName("TrocaNome");
            expect(spyValidate).toHaveBeenCalledTimes(2)
            expect(castMember.name).toBe("TrocaNome")
        })

        it("should change cast_member_type", () => {
            const spyValidate = jest.spyOn(CastMember.prototype as any, "validate");
            const castMember = CastMember.create({ name, cast_member_type });
            expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
            expect(castMember.cast_member_type).toBeInstanceOf(CastMemberType);
            expect(spyValidate).toHaveBeenCalledTimes(1);
            expect(castMember.name).toBe("Teste");
            castMember.changeMemberType(2);
            expect(castMember.cast_member_type).toBeInstanceOf(CastMemberType);
            expect(castMember.cast_member_type.cast_member_type).toBe(2)
        });

        it("should throw error when change cast_member_type to invalid type", () => {
            try {
                const spyValidate = jest.spyOn(CastMember.prototype as any, "validate");
                const castMember = CastMember.create({ name, cast_member_type });
                expect(castMember.cast_member_id).toBeInstanceOf(Uuid);
                expect(castMember.cast_member_type).toBeInstanceOf(CastMemberType);
                expect(spyValidate).toHaveBeenCalledTimes(1);
                expect(castMember.name).toBe("Teste");
                castMember.changeMemberType(3);
                fail("is valid, but need should throw error")
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidCastMemberTypeError);
                expect(error.message).toBe("Ivalid cast member type. Allowed values are 1 or 2")
            }

        });

    });

    describe("CastMemberValidator", () => {

        let cast_member_type = new CastMemberType(1);
        it('should throw error when name is to loog', () => {
            const castMember = CastMember.create({ cast_member_type, name: "G".repeat(280) })
            expect(castMember.notification.hasError()).toBeTruthy();
            expect(castMember.notification).notificationContainsErrorMessage([
                {
                    name: ["name must be shorter than or equal to 255 characters"]
                }
            ])
        })

        it('should throw error when change name is to loong', () => {
            const castMember = CastMember.create({ cast_member_type, name: "G" })
            expect(castMember).toBeInstanceOf(CastMember);
            castMember.changeName('f'.repeat(300))
            expect(castMember.notification.hasError()).toBeTruthy();
            expect(castMember.notification).notificationContainsErrorMessage([
                {
                    name: ["name must be shorter than or equal to 255 characters"]
                }
            ])
        })

    });

    it("shoul return cast member in json", () => {
        let cast_member_type = new CastMemberType(1);
        const castMember = CastMember.create({ cast_member_type, name: "G" })
        expect(castMember).toBeInstanceOf(CastMember);
        const jsonCastMember = castMember.toJson();
        expect(jsonCastMember.cast_member_id).toBe(castMember.cast_member_id.id);
        expect(jsonCastMember.cast_member_type).toBe(castMember.cast_member_type.toString())
        expect(jsonCastMember.created_at).toBe(castMember.created_at)
        expect(jsonCastMember.name).toBe(castMember.name)

    })

})