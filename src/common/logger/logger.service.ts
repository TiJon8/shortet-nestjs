import { ConsoleLogger, ConsoleLoggerOptions, Injectable, LogLevel } from "@nestjs/common";
import { appendFileSync, existsSync, mkdir, mkdirSync } from "fs";
import { dirname, join } from "path";



@Injectable()
export class CustomLogger extends ConsoleLogger {
	private readonly logFile = join(__dirname, '../../../logs/core.log')

	constructor(options: ConsoleLoggerOptions) {
		super(options)
	}

	log(msg: string, context: string) {
		this.logToFile('log', msg, context)
		super.log(msg, context)
	}

	error(message: any, context?: string, trace?: string) {
		this.logToFile('error', message, context, trace)
		super.error(message, context, trace)
	}

	private logToFile(level: LogLevel, msg: string, context?: string, trace?: string) {
		const log = `[${level}] ${context ? `[${context}]` : ''} ${msg}${trace ? `\nTRACE: ${trace}` : ''}\n`

		const logDir = dirname(this.logFile)
		if (!existsSync(logDir)) {
			mkdirSync(logDir, { recursive: true })
		}

		appendFileSync(this.logFile, log)
	}
}