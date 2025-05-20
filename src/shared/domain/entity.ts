

export abstract class Entity {
    abstract get entity_id(): string;
    abstract toJson(): any;

}