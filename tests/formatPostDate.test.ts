import { formatPostDate } from '@/lib/formatPostDate'

it.each(['2026-07-21', '2026-07-21T00:00:00.000Z'])('keeps the publication date for %s', (value) => {
  expect(formatPostDate(value)).toBe('7/21/2026')
})

it.each(['2028-02-29'])('keeps the leap day publication date for %s', (value) => {
  expect(formatPostDate(value)).toBe('2/29/2028')
})

it('preserves an unparseable date without throwing', () => {
  expect(formatPostDate('Coming soon')).toBe('Coming soon')
})
