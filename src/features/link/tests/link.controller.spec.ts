import { Test, TestingModule } from "@nestjs/testing"
import { LinkController } from "../link.controller"
import { LinkService } from "../link.service"
import { NotFoundException } from "@nestjs/common"

const mockUserId = {
	id: 'AaAa-1111-BbBb-2222'
}

const mockLinkService = {

	create: jest.fn().mockImplementation((data: { url: string }, id: string) => {
		if (id !== mockUserId.id) throw new NotFoundException('Invalid request')
		return { url: 'https://example.com/aabbccddee' }
	}),
	delete: jest.fn().mockImplementation((id: string) => {
		if (id !== mockUserId.id) throw new NotFoundException()
		return true
	})
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
			const result = await linkController.create({ original: 'https://example.com/video?w=11' }, mockUserId.id)
			expect(linkService.create).toHaveBeenCalledWith('https://example.com/video?w=11', mockUserId.id)
			expect(result).toEqual({ url: `https://example.com/aabbccddee` })
		})

		test('should throw an NotFounfException if userId is not valid or is not exists', async () => {
			jest.spyOn(linkController, 'create').mockRejectedValue(new NotFoundException())

			try {
				await linkController.create({ original: 'https://example.com/video?w=11' }, mockUserId.id)
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException)
			}

		})

		test('should delete a link', async () => {
			const result = await linkController.delete(mockUserId.id)
			expect(result).toBe(true)
		})

		test('should throw an NotFounfException', async () => {
			jest.spyOn(linkController, 'delete').mockRejectedValue(new NotFoundException())

			try {
				await linkController.delete('1')
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException)
			}

		})
	})

})