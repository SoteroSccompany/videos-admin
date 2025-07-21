import { Chance } from "chance";
import { Uuid } from "../../../shared/domain/value-objects/uui.vo";
import { CastMemberFakeBuilder } from "../cast-member.fake.builder";
import { CastMemberType, InvalidCastMemberTypeError } from "../cast-member-type.vo";
import { CastMember } from "../cast-member.entity";

describe('CastMemberFakeBuilder Unit Test', () => {

    describe("category_id prop", () => {

        const faker = CastMemberFakeBuilder.aCastMember();

        it("should throw an error when any with method is called", () => {
            expect(() => faker.cast_member_id).toThrow(
                new Error("Property cast_member_id not have a factory, use 'with' methods")
            );
        }
        );

        it("should be undefined", () => {
            expect(faker['_cast_member_id']).toBeUndefined();
        });

        it("withUuid", () => {
            const cast_member_id = new Uuid();
            const $this = faker.withUuid(cast_member_id);
            expect($this).toBeInstanceOf(CastMemberFakeBuilder);
            expect(faker['_cast_member_id']).toBe(cast_member_id);

            faker.withUuid(() => cast_member_id);
            expect(faker.cast_member_id).toBe(cast_member_id);
        })


        it("should pass cast_member_id factory", () => {
            const mockFactory = jest.fn(() => new Uuid());
            faker.withUuid(mockFactory);
            faker.build();
            expect(mockFactory).toHaveBeenCalledTimes(1);
            const cast_member_id = new Uuid();
            mockFactory.mockReturnValue(cast_member_id);
            const fakerMany = CastMemberFakeBuilder.theCastMembers(2).withUuid(mockFactory).build();
            expect(mockFactory).toHaveBeenCalledTimes(3);
            expect(fakerMany[0].cast_member_id).toBe(cast_member_id);
            expect(fakerMany[1].cast_member_id).toBe(cast_member_id);
        });


    });

    describe("name prop", () => {

        const faker = CastMemberFakeBuilder.aCastMember();

        it("should be a function", () => {
            expect(typeof faker['_name']).toBe("function");
        }
        );

        it("should call the word method", () => {
            const chance = Chance();
            const spyWord = jest.spyOn(chance, 'word');
            faker['chance'] = chance;
            faker.build();
            expect(spyWord).toHaveBeenCalledWith();
        });

        it("withName", () => {
            const name = "CastMember Name";
            const $this = faker.withName(name);
            expect($this).toBeInstanceOf(CastMemberFakeBuilder);
            expect(faker['_name']).toBe(name);

            faker.withName(() => name);
            expect(faker.name).toBe(name);
        });

        it("should pass name factory", () => {
            const mockFactory = jest.fn(() => "CastMember Name");
            faker.withName(mockFactory);
            faker.build();
            expect(mockFactory).toHaveBeenCalledTimes(1);

            const name = "Another CastMember Name";
            mockFactory.mockReturnValue(name);
            const fakerMany = CastMemberFakeBuilder.theCastMembers(2).withName(mockFactory).build();
            expect(mockFactory).toHaveBeenCalledTimes(3);

            expect(fakerMany[0].name).toBe(name);
            expect(fakerMany[1].name).toBe(name);
        });
    });

    describe("Castmember type prop", () => {

        const faker = CastMemberFakeBuilder.aCastMember();

        it("should be a function", () => {
            expect(typeof faker['_cast_member_type']).toBe("function")
        });

        it("should call the integer method", () => {
            const chance = Chance();
            const spyParagraph = jest.spyOn(chance, 'integer');
            faker['chance'] = chance;
            faker.build();
            expect(spyParagraph).toHaveBeenCalled();
        });

        it("withCastMemberType", () => {
            const cast_member_type = 2;
            const $this = faker.withCastMemberType(cast_member_type as any);
            expect($this).toBeInstanceOf(CastMemberFakeBuilder);
            expect($this.cast_member_type).toBe(cast_member_type);
            expect(faker['_cast_member_type']).toBe(cast_member_type);
            expect($this.cast_member_type).toBe(cast_member_type)
            const fk = faker.build();
            expect(fk.cast_member_type).toBeInstanceOf(CastMemberType);
        });

        it("should pass castMemberFactory", () => {
            const castMemberType = 1;
            const mockFunction = jest.fn(() => new CastMemberType(castMemberType));
            faker.withCastMemberType(mockFunction)
            faker.build();
            expect(mockFunction).toHaveBeenCalledTimes(1)
            const fakeMany = CastMemberFakeBuilder.theCastMembers(2).withCastMemberType(mockFunction).build();
            expect(mockFunction).toHaveBeenCalledTimes(3)
            expect(fakeMany[0].cast_member_type).toBeInstanceOf(CastMemberType);
            expect(fakeMany[0].cast_member_type.cast_member_type).toBe(castMemberType)
            expect(fakeMany[1].cast_member_type.cast_member_type).toBe(castMemberType)

        });
    })

    describe("CreatedAt prop", () => {

        const faker = CastMemberFakeBuilder.aCastMember();

        it("should createdAt at normal date", () => {
            const date = new Date();
            const $this = faker.withCreatedAt(date);
            expect($this.created_at).toBe(date);
            const date1 = new Date();
            faker.withCreatedAt(() => date1)
            expect($this.created_at).toBe(date1)
        });

        it("should createAt at factory date prop", () => {
            const date = new Date();
            const mockFunctionDate = jest.fn(() => date);
            faker.withCreatedAt(mockFunctionDate).build();
            expect(mockFunctionDate).toHaveBeenCalledTimes(1);
            const fakerMany = CastMemberFakeBuilder.theCastMembers(3).withCreatedAt(mockFunctionDate).build();
            expect(mockFunctionDate).toHaveBeenCalledTimes(4)

        });


    });

    describe("With name too long", () => {
        const faker = CastMemberFakeBuilder.aCastMember();
        it("should call chance word", () => {
            const chance = Chance();
            const spyOnChance = jest.spyOn(chance, 'word')
            faker['chance'] = chance;
            faker.build();
            expect(spyOnChance).toHaveBeenCalled();
        })

        it("should generate name too long", () => {
            const $this = faker.withInvalidNameTooLong();
            expect($this).toBeInstanceOf(CastMemberFakeBuilder);
            expect($this['_name'].length).toBeGreaterThan(255)
            faker.build();
        })


    });

    describe("with inalid cast member type", () => {

        const faker = CastMemberFakeBuilder.aCastMember();

        it("should generate invalid cast member type", () => {
            const chance = Chance();
            const spyOnChance = jest.spyOn(chance, 'integer')
            faker['chance'] = chance;
            const $this = faker.withInvalidCastMemberType();
            expect($this).toBeInstanceOf(CastMemberFakeBuilder);
            expect(() => {
                faker.build();
                expect(spyOnChance).toHaveBeenCalled();
            }).toThrow(new InvalidCastMemberTypeError('Ivalid cast member type. Allowed values are 1 or 2'))


        });

    });


    //Realizar teste aqui para verificar se teve chamada do chance integer

    describe("With uuid", () => {
        const faker = CastMemberFakeBuilder.aCastMember();

        it("shuld pass uuid with text", () => {
            const uuid = new Uuid();
            const $this = faker.withUuid(uuid);
            expect($this).toBeInstanceOf(CastMemberFakeBuilder);
            expect($this.cast_member_id).toBe(uuid);
            const uuid2 = new Uuid();
            faker.withUuid(() => uuid2);
            expect($this.cast_member_id).toBe(uuid2)
        })

        it("should pass uuid with function", () => {
            const uuid = new Uuid();
            const mockFunctionUuid = jest.fn(() => uuid);
            const $this = faker.withUuid(mockFunctionUuid);
            expect($this).toBeInstanceOf(CastMemberFakeBuilder);
            expect($this.cast_member_id).toBe(uuid);
        });

    });

    describe("build function", () => {
        it("should return instanceOf category with build", () => {
            const fake = CastMemberFakeBuilder.aCastMember();
            const spyOn = jest.spyOn(fake, 'build');
            const category = fake.build();
            expect(spyOn).toHaveBeenCalled();
            expect(category).toBeInstanceOf(CastMember);
        });
    });

    describe("With categoryId", () => {
        const faker = CastMemberFakeBuilder.aCastMember();

        it("shuld pass uuid with text", () => {
            const uuid = new Uuid();
            const $this = faker.withCastMemberId(uuid);
            expect($this).toBeInstanceOf(CastMemberFakeBuilder);
            expect($this.cast_member_id).toBe(uuid);
            const uuid2 = new Uuid();
            faker.withCastMemberId(() => uuid2);
            expect($this.cast_member_id).toBe(uuid2)
        })

        it("should pass uuid with function", () => {
            const uuid = new Uuid();
            const mockFunctionUuid = jest.fn(() => uuid);
            const $this = faker.withCastMemberId(mockFunctionUuid);
            expect($this).toBeInstanceOf(CastMemberFakeBuilder);
            expect($this.cast_member_id).toBe(uuid);
        });

    });


});