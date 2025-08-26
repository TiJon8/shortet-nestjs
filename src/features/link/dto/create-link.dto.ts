import { IsString, IsUrl } from "class-validator";

export class RequestCreateLink {
	@IsString()
	@IsUrl({})
	original: string
}