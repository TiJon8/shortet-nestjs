import { Test, TestingModule } from "@nestjs/testing"
import { LinkController } from "../link.controller"
import { LinkService } from "../link.service"

const mockLinkService = {
	create: jest.fn().mockResolvedValue({ url: 'aabbccddee' }),
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

})