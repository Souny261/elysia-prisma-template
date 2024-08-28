
export type LoginEntity = {
    email: string;
    password: string;
};

export type UserEntity = {
    id: number;
    name: string;
    email: string;
    password?: string;
    createdAt: Date;
}

export type TokenEntity = {
    access_token: string;
    refresh_token: string;
}

export type LoginResponse = {
    user: UserEntity
    token: TokenEntity
}