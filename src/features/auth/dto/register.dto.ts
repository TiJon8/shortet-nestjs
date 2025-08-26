import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class RequestRegister {

	@IsString()
	@IsNotEmpty()
	@Length(2, 32)
	username!: string


	@IsString()
	@IsNotEmpty()
	@IsEmail({})
	email!: string


	@IsString()
	@IsNotEmpty()
	@Length(6, 128)
	password!: string
}