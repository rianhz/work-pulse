export interface IRegisterPayload {
    email: string;
    password: string;
    companyName: string;
    slug: string;
    fullName: string;
}

export interface ILoginPayload {
    email: string;
    password: string;
}