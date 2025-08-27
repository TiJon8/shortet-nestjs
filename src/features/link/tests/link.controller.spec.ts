import { Test, TestingModule } from "@nestjs/testing"
import { LinkController } from "../link.controller"
import { LinkService } from "../link.service"

const mockLinkService = {
	create: jest.fn().mockResolvedValue({ url: 'https://example.com/aabbccddee' }),
	delete: jest.fn().mockResolvedValue(true)
}

describe('LinkController', () => {
	let linkController: LinkController
	let linkService: LinkService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LinkController],
			providers: [
				{
					provide: LinkService,
					useValue: mockLinkService
				}
			]
		}).compile()

		linkController = module.get(LinkController)
		linkService = module.get(LinkService)
	})

	test('LinkController should be defined', () => {
		expect(linkController).toBeDefined()
	})

	describe('api controller testing', () => {
		test('should create a shorter link', async () => {
			const result = await linkController.create({ original: 'https://example.com/video?w=11' }, '1')
			expect(linkService.create).toHaveBeenCalledWith('https://example.com/video?w=11', '1')
			expect(result).toEqual({ url: `https://example.com/aabbccddee` })
		})
	})

})