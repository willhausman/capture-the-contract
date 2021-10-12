import { render } from '@testing-library/react';
import { Menu } from './Menu';

test('renders', () => {
  const { getByText } = render(<Menu>Hi</Menu>);
  expect(getByText('Hi')).toBeVisible();
});
