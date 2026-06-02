import { BirthdayWishService } from '../birthday-wish.service';

const TEST_DATA = {
  Friend: ['Happy birthday, {{name}}!', 'Cheers {{name}}!'],
  Brother: ['Happy birthday bro {{name}}!'],
} as const;

describe('BirthdayWishService', () => {
  const service = new BirthdayWishService(TEST_DATA as never);

  it('returns wishes for known relationships', () => {
    const wish = service.getWishByRelationship('friend', 'Alex');
    expect(wish).toContain('Alex');
    expect(wish.length).toBeGreaterThan(0);
  });

  it('resolves relationship aliases', () => {
    const wish = service.getWishByRelationship('bro', 'Sam');
    expect(wish).toContain('Sam');
  });

  it('returns multiple unique wishes up to the requested count', () => {
    const wishes = service.getMultipleWishes('friend', 2, 'Jamie');
    expect(wishes).toHaveLength(2);
    wishes.forEach((wish) => expect(wish).toContain('Jamie'));
  });

  it('falls back to Friend category for unknown relationships', () => {
    const wish = service.getWishByRelationship('unknown-relation', 'Taylor');
    expect(wish).toContain('Taylor');
  });

  it('uses Friend placeholder when name is missing', () => {
    const wish = service.getRandomWish('friend');
    expect(wish).toContain('Friend');
  });
});
