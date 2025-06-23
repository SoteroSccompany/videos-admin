


import { EntityValidationError } from "./validation.errors";



describe("Validation error teste", () => {

    it("should be instance of error", () => {
        const errorMessage = "Erro de validacao teste";
        const changeMessage = "Menssagem padrao alterada"
        const errorCategoryNotFound = new EntityValidationError([{ field: [errorMessage] }], changeMessage)
        expect(errorCategoryNotFound).toBeInstanceOf(EntityValidationError);
        expect(errorCategoryNotFound.message).toBe(changeMessage);
        // expect(errorCategoryNotFound.errors.field).toHaveLength(1)
        // expect(errorCategoryNotFound.errors.field[0]).toBe(errorMessage)

    });

    it("teste count errors", () => {
        const errorMessage = "Erro de validacao teste";
        const changeMessage = "Menssagem padrao alterada"
        const errorCategoryNotFound = new EntityValidationError([{ field: [errorMessage] }], changeMessage)
        const spyOnCount = jest.spyOn(errorCategoryNotFound, "count")
        const errorsCount = errorCategoryNotFound.count();
        expect(errorsCount).toBe(1);
        expect(spyOnCount).toHaveBeenCalled();

    });

});