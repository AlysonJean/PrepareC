import { render, screen } from '@testing-library/react';
import { PremiumCard } from './premium-card';
import { Users } from 'lucide-react';
import { expect, test, describe, vi } from 'vitest';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('PremiumCard', () => {
  test('renders title and value correctly', () => {
    render(
      <PremiumCard
        title="Total Users"
        value="1,234"
        icon={<Users data-testid="users-icon" />}
      />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    render(
      <PremiumCard
        title="Total Users"
        value="1,234"
        description="Active this month"
        icon={<Users />}
      />
    );

    expect(screen.getByText('Active this month')).toBeInTheDocument();
  });
});
