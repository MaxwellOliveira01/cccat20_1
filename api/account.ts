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

export enum SignupErrors {
    "InvalidCpf" = "InvalidCpf",
    "InvalidName" = "InvalidName",
    "InvalidEmail" = "InvalidEmail",
    "InvalidPassword" = "InvalidPassword",
    "InvalidCarPlate" = "InvalidCarPlate",
    "UserAlreadyExists" = "UserAlreadyExists",
};