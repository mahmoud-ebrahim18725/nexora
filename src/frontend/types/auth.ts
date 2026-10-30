export type CurrentUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    companyId: number;
}

export type logInInput = {
    email: string;
    password: string;
}

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
    companyName: string;
}