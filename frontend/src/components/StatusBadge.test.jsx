import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';
import { describe, test, expect } from 'vitest';

describe('StatusBadge Component Testing', () => {
  test('แสดงข้อความ อนุมัติแล้ว เมื่อสถานะคือ approved', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('อนุมัติแล้ว')).toBeInTheDocument();
  });

  test('แสดงข้อความ รอการอนุมัติ เมื่อสถานะคือ pending', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('รอการอนุมัติ')).toBeInTheDocument();
  });
});
