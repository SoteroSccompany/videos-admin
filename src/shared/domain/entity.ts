import { Notification } from "./validators/notification";
import { ValueObject } from "./value-object";


export abstract class Entity { //Lembre sempre que essa e a abstracao da entidade
    notification: Notification = new Notification();
    abstract get entity_id(): ValueObject;
    abstract toJson(): any;

}