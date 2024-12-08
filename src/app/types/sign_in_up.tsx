export type SignInData = {
    email: string
    password: string
}

export type SignUpData = SignInData & {
    username: string
    confirmPassword: string
}

