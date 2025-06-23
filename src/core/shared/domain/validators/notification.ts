



export class Notification {
    errors = new Map<string, string[] | string>(); //Se pode realizar estrutura de get e set por ser um novo map

    addError(error: string, field?: string) {
        if (field) {
            const errors = (this.errors.get(field) ?? []) as string[]; //Aqui retorna a string ou o aray dos erros que estao dentro do map da classe
            errors.indexOf(error) === -1 && errors.push(error) //Caso nao tenha o erro dentro dos erros/
            this.errors.set(field, errors)//Aqui set o erro e coloca dentro da classe os erros
        } else {
            this.errors.set(error, error) //Aqui coloca cada erro dentro do error
        }
    }

    setError(error: string | string[], field?: string) {
        if (field) {
            this.errors.set(field, Array.isArray(error) ? error : [error])
        } else {
            if (Array.isArray(error)) {
                error.forEach(value => { //Se for array, ele vai gravar no error o valor como o valor de validacao tambe,. caso nao tenha o field
                    this.errors.set(value, value) //Entao se passar name-error, vai ficar assim em ambos os errors mostrando o erro de validacao
                })
                return;
            }
            this.errors.set(error, error) //Aqui, caso nao seja um array, ele grava dentro do erro, o erro sendo a chavee e o valor padrao dele
        }
    }

    hasError(): boolean {
        return this.errors.size > 0; //Forma para verificar o tamanho de um map
    }

    copyErors(notification: Notification) {
        notification.errors.forEach((value, field) => {
            this.setError(value, field)
        });
    }

    toJson() {
        const errors: Array<{ [key: string]: string[] } | string> = [];
        this.errors.forEach((value, key) => {
            if (typeof value === 'string') {
                errors.push(value)
            } else {
                errors.push({ [key]: value })
            }
        });
        return errors
    }



}