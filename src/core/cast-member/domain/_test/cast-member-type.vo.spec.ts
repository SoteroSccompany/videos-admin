import { CastMemberType, InvalidCastMemberTypeError } from "../cast-member-type.vo"






describe("CastMemberType", () => {

    it("should throw error when cast member type is invalid", () => {
        try {
            new CastMemberType(3)
            fail("this cast member is valid, but it should throw IvalidCastMembertypeError")
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidCastMemberTypeError)
            expect(error.message).toBe("Ivalid cast member type. Allowed values are 1 or 2")
        }
    })

    it("should return a valid cast member type", () => {
        const spyValidate = jest.spyOn(CastMemberType.prototype as any, "validate")
        const castMemberType = new CastMemberType(2)
        expect(castMemberType).toBeInstanceOf(CastMemberType);
        expect(spyValidate).toHaveBeenCalled();
    });

    it("should return a string on toString method", () => {
        const spyValidate = jest.spyOn(CastMemberType.prototype as any, "validate")
        const castMemberType = new CastMemberType(2)
        expect(castMemberType).toBeInstanceOf(CastMemberType);
        expect(spyValidate).toHaveBeenCalled();
        const string = castMemberType.toString();
        expect(string).toEqual('2_Director')
    });

})