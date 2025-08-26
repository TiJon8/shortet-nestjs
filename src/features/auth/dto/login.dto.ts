import { PickType } from "@nestjs/mapped-types";
import { RequestRegister } from "./register.dto";

export class LoginRequest extends PickType(RequestRegister, ['email', 'password']) { }