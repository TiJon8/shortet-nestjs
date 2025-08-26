import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

const IS_DEV_ENV = process.env['NODE_ENV'] === 'DEVELOPMENT'

console.log(process.env)

export const UserAgent = createParamDecorator(
	(_: string, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest() as Request

		return req.headers['user-agent']
	}
)

export const IpProperty = createParamDecorator(
	(_: string, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest() as Request

		return IS_DEV_ENV ? '209.85.233.94' : Array.isArray(req.headers['cf-conncting-api'])
			? req.headers['cf-conncting-api'][0]
			: (req.headers['cf-conncting-api'] ?? (typeof req.headers['x-forwarded-for'] === 'string'
				? req.headers['x-forwarded-for'].split(',')[0] : req.ip))

	}
)


