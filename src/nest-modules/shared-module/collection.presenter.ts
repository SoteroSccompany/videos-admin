import { Exclude, Expose } from "class-transformer";
import { PaginationPresenter, PaginationPresenterProps } from "./pagination.presenter";



export abstract class CollectionPresenter {
    @Exclude() //Faz com que o objeto nao seja serializadao
    protected paginationPresenter: PaginationPresenter;

    constructor(props: PaginationPresenterProps) {
        this.paginationPresenter = new PaginationPresenter(props)
    }

    @Expose({ name: 'meta' })//Isso e para que seja combinado
    get meta() {
        return this.paginationPresenter
    }

    abstract get data();
}