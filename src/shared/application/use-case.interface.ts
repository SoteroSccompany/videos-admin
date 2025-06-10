

export interface IUseCase<Input, Output> { //Isso aqui fica como generic. 
    execute(input: Input): Promise<Output>;
}