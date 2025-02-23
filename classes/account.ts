export interface AccountData {
    name: string;
    password: string;
    email: string;
    cpf: string;
    carPlate: string;
    isPassenger: boolean;
    isDriver: boolean;
}

export interface Account extends AccountData {
    accountId: string;
}

export function createAccount(id: string, data: AccountData): Account {
    return {
        accountId: id,
        ...data
    };
}