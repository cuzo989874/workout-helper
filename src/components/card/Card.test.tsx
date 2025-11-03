import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Card, CardHeader, CardBody } from './Card';

describe('當：Card 組件', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('應該：使用預設 props 正確渲染 children', () => {
    render(<Card>Card Content</Card>);

    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('當：提供 className 時，應該：正確套用自定義樣式類別', () => {
    render(<Card className="custom-card">Content</Card>);

    const card = screen.getByText('Content');
    expect(card).toHaveClass('card');
    expect(card).toHaveClass('custom-card');
  });

  it('當：className 為 undefined 時，應該：只套用預設樣式類別', () => {
    render(<Card>Content</Card>);

    const card = screen.getByText('Content');
    expect(card).toHaveClass('card');
    expect(card.className).toBe('card ');
  });

  it('當：children 為空字串時，應該：渲染空的 div 元素', () => {
    const { container } = render(<Card>{''}</Card>);

    const card = container.querySelector('.card');
    expect(card).toBeInTheDocument();
    expect(card?.tagName).toBe('DIV');
  });

  it('當：children 為 ReactNode 時，應該：正確渲染複雜內容', () => {
    const complexContent = (
      <div data-testid="complex-content">
        <span>Nested Content</span>
      </div>
    );

    render(<Card>{complexContent}</Card>);

    expect(screen.getByTestId('complex-content')).toBeInTheDocument();
    expect(screen.getByText('Nested Content')).toBeInTheDocument();
  });
});

describe('當：CardHeader 組件', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('應該：使用預設 props 正確渲染 children', () => {
    render(<CardHeader>Header Content</CardHeader>);

    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('當：提供 className 時，應該：正確套用自定義樣式類別', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);

    const header = screen.getByText('Header');
    expect(header).toHaveClass('card__header');
    expect(header).toHaveClass('custom-header');
  });

  it('當：className 為 undefined 時，應該：只套用預設樣式類別', () => {
    render(<CardHeader>Header</CardHeader>);

    const header = screen.getByText('Header');
    expect(header).toHaveClass('card__header');
    expect(header.className).toBe('card__header ');
  });

  it('當：children 為空字串時，應該：渲染空的 div 元素', () => {
    const { container } = render(<CardHeader>{''}</CardHeader>);

    const header = container.querySelector('.card__header');
    expect(header).toBeInTheDocument();
    expect(header?.tagName).toBe('DIV');
  });
});

describe('當：CardBody 組件', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('應該：使用預設 props 正確渲染 children', () => {
    render(<CardBody>Body Content</CardBody>);

    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('當：提供 className 時，應該：正確套用自定義樣式類別', () => {
    render(<CardBody className="custom-body">Body</CardBody>);

    const body = screen.getByText('Body');
    expect(body).toHaveClass('card__body');
    expect(body).toHaveClass('custom-body');
  });

  it('當：className 為 undefined 時，應該：只套用預設樣式類別', () => {
    render(<CardBody>Body</CardBody>);

    const body = screen.getByText('Body');
    expect(body).toHaveClass('card__body');
    expect(body.className).toBe('card__body ');
  });

  it('當：children 為空字串時，應該：渲染空的 div 元素', () => {
    const { container } = render(<CardBody>{''}</CardBody>);

    const body = container.querySelector('.card__body');
    expect(body).toBeInTheDocument();
    expect(body?.tagName).toBe('DIV');
  });
});
