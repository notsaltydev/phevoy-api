import { Test, TestingModule } from '@nestjs/testing';
import { ConferenceController } from './conference.controller';

describe('Conference Controller', () => {
    let controller: ConferenceController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConferenceController],
        }).compile();

        controller = module.get<ConferenceController>(ConferenceController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
