import { Chance } from 'chance';
import { Uuid } from '../../shared/domain/value-objects/uui.vo';
import { CastMember } from './cast-member.entity';
import { CastMemberType } from './cast-member-type.vo';

type PropOrFactory<T> = T | ((index: number) => T);

export class CastMemberFakeBuilder<TBuild = any> {
    // auto generated in entity
    private _cast_member_id: PropOrFactory<Uuid> | undefined = undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private _name: PropOrFactory<string> = (_index) => this.chance.word();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private _cast_member_type: PropOrFactory<CastMemberType> = (_index) => new CastMemberType(this.chance.integer({ min: 1, max: 2 }));
    // auto generated in entity
    private _created_at: PropOrFactory<Date> | undefined = undefined;

    private countObjs;

    static aCastMember() {
        return new CastMemberFakeBuilder<CastMember>();
    }

    static theCastMembers(countObjs: number) {
        return new CastMemberFakeBuilder<CastMember[]>(countObjs);
    }

    static fake() {
        return CastMemberFakeBuilder; //Poderia usar o this, mas caso tenha uma subclasse, pode sobrescrever. Por isso e pela semantica, e melhor usar o nome da classe
    }

    private chance: Chance.Chance;

    private constructor(countObjs: number = 1) {
        this.countObjs = countObjs;
        this.chance = Chance();
    }

    withCastMemberId(valueOrFactory: PropOrFactory<Uuid>) {
        this._cast_member_id = valueOrFactory;
        return this;
    }

    withName(valueOrFactory: PropOrFactory<string>) {
        this._name = valueOrFactory;
        return this;
    }

    withCastMemberType(valueOrFactory: PropOrFactory<CastMemberType>) {
        this._cast_member_type = valueOrFactory;
        return this;
    }

    withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
        this._created_at = valueOrFactory;
        return this;
    }

    withInvalidNameTooLong(value?: string) {
        this._name = value ?? this.chance.word({ length: 256 });
        return this;
    }

    withInvalidCastMemberType(value?: number) {
        this._cast_member_type = value ?? this.chance.integer({ min: 3, max: 100 });
        return this;
    }

    withUuid(valueOrFactory: PropOrFactory<Uuid>) {
        this._cast_member_id = valueOrFactory;
        return this;
    }

    build(): TBuild {
        const cast_members = new Array(this.countObjs)
            .fill(undefined)
            .map((_, index) => {
                const cast_member = new CastMember({
                    cast_member_id: !this._cast_member_id ? undefined : this.callFactory(this._cast_member_id, index),
                    name: this.callFactory(this._name, index),
                    cast_member_type: this.callFactoryCastMemberType(this._cast_member_type, index),
                    ...(this._created_at && {
                        created_at: this.callFactory(this._created_at, index),
                    }),
                });
                cast_member.validate();
                return cast_member;
            });
        //@ts-ignore
        return this.countObjs === 1 ? (cast_members[0] as any) : cast_members;
    }

    get cast_member_id() {
        return this.getValue('cast_member_id');
    }

    get name() {
        return this.getValue('name');
    }

    get cast_member_type() {
        return this.getValue('cast_member_type');
    }

    get created_at() {
        return this.getValue('created_at');
    }

    private getValue(prop: any) {
        const optional = ['cast_member_id', 'created_at'];
        const privateProp = `_${prop}` as keyof this;
        if (!this[privateProp] && optional.includes(prop)) {
            throw new Error(
                `Property ${prop} not have a factory, use 'with' methods`,
            );
        }
        return this.callFactory(this[privateProp], 0);
    }

    private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
        return typeof factoryOrValue === 'function'
            ? factoryOrValue(index)
            : factoryOrValue;
    }

    private callFactoryCastMemberType(factoryOrValue: PropOrFactory<any>, index: number) {
        return typeof factoryOrValue === 'function'
            ? factoryOrValue(index)
            : new CastMemberType(factoryOrValue);

    }
}