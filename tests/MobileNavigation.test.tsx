import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import MobileMenuIcon from '@/components/MobileMenuIcon'
import MobileNavLinks from '@/components/MobileNavLinks'

vi.mock('next/navigation', () => ({ usePathname: () => '/projects/example/' }))
vi.mock('@/hooks/useAnimatedNavigation', () => ({ useAnimatedNavigation: () => vi.fn() }))

function Navigation() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <MobileMenuIcon menuOpen={open} toggleMenu={() => setOpen((value) => !value)} />
      <MobileNavLinks open={open} setMenuOpen={setOpen} />
    </>
  )
}

it('opens by keyboard and closes with Escape, returning focus to the toggle', async () => {
  const user = userEvent.setup()
  render(<Navigation />)
  const toggle = screen.getByRole('button', { name: 'Toggle menu' })
  toggle.focus()
  await user.keyboard('{Enter}')
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  const panel = screen.getByRole('navigation', { name: 'Mobile navigation' })
  expect(panel).not.toHaveAttribute('inert')
  expect(screen.getByText('About')).toHaveFocus()
  await user.tab()
  expect(screen.getByText('Blog')).toHaveFocus()
  expect(screen.getByText('Projects')).toHaveAttribute('aria-current', 'page')
  screen.getByText('Projects').focus()
  await user.keyboard('{Escape}')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(toggle).toHaveFocus()
  expect(panel).toHaveAttribute('inert')
})
