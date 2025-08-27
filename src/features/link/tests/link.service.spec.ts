import { Test } from "@nestjs/testing";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { LinkService } from "../link.service"
import { ConfigService } from "@nestjs/config";

const mockShorterLink = {
	url: 'https://example.com/aabbccddee'
}

const mockUserId = {
	id: 'AaAa-1111-BbBb-2222'
}

const mockLink = {
	id: 'AaAa-1111-BbBb-2222',
	originalLink: 'https://example.com/video?w=source',
	shortCode: 'aabbccddee',
	userId: 'CcCc-3333-DdDd-4444',
}

const mockPrismaService = {
	link: {
		create: jest.fn().mockImplementation(() => {
			return mockLink
		}),
		findUnique: jest.fn().mockResolvedValue(mockLink),
		delete: jest.fn().mockResolvedValue(mockLink)
	}
}

const mockEnv = {
	BASE_URL: 'https://example.com'
}

const mockCongigService = {
	getOrThrow: jest.fn().mockImplementation(<T>(key: string) => {
		console.log(expect(key).toBe<string>('BASE_URL'))
		if (key in mockEnv) {
			return mockEnv[key]
		}
	})
}

describe('LinkService', () => {
	let linkService: LinkService;
	let prisma: PrismaService

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				LinkService,
				{
					provide: PrismaService,
					useValue: mockPrismaService
				},
				{
					provide: ConfigService,
					useValue: mockCongigService
				}
			]
		}).compile()

		linkService = module.get(LinkService)
		prisma = module.get(PrismaService)
	})

	describe('api provider testing', () => {
		test('should create link', async () => {
			const result = await linkService.create('https://example.com/video?w=source', mockUserId.id)
			expect(result).toEqual(mockShorterLink)
		})

		test('should findUnique link', async () => {
			const result = await linkService.getLinkByCode(mockShorterLink.url)
			expect(result).toEqual(mockLink)
		})

		test('should delete link and return true', async () => {
			const result = await linkService.delete(mockLink.id)
			expect(result).toBe(true)
		})
	})
})