import { Test } from "@nestjs/testing"
import { Response } from "express";
import { AppController } from "../app.controller";
import { LinkService } from "../features/link/link.service";
import { AppService } from "../app.service";


const mockLinkByCodeFn = {
	originalLink: 'https://example.com',
	shortCode: 'abc'
}

const response = {
	redirect: jest.fn()
} as unknown as Response


const mockLinkService = {
	getLinkByCode: jest.fn().mockResolvedValue(mockLinkByCodeFn),
	trackClick: jest.fn(),
}

describe('AppController', () => {
	let appController: AppController;
	let linkService: LinkService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [AppController],
			providers: [
				{
					provide: LinkService,
					useValue: mockLinkService
				},
				AppService // bottled
			],
		}).compile();

		linkService = moduleRef.get(LinkService);
		appController = moduleRef.get(AppController);
	});

	test('app controller should be defined', () => {
		expect(appController).toBeDefined()
	})

	describe('api controller testing', () => {
		test('should return undefined (redirect)', async () => {
			const result = await appController.getLink('abc', response, '127.0.0.1', 'Chrome')

			expect(linkService.getLinkByCode).toHaveBeenCalledWith('abc');
			expect(linkService.trackClick).toHaveBeenCalledWith('abc', '127.0.0.1', 'Chrome');
			expect(response.redirect).toHaveBeenCalledWith('https://example.com');
			expect(result).toBe(undefined)
		});
	});
});