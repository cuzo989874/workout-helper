import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Stepper, Step, StepLabel, StepActions } from './Stepper';

describe('當：Stepper 元件 (Material-like)', () => {
  it('應該：只渲染 activeIndex 的步驟，並支援 Next/Back', async () => {
    const user = userEvent.setup();

    render(
      <Stepper>
        <Step>
          <StepLabel>Step 1</StepLabel>
          <StepActions>
            <button className="stepper__button stepper__button--next">
              Next
            </button>
          </StepActions>
        </Step>
        <Step>
          <StepLabel>Step 2</StepLabel>
          <StepActions>
            <button className="stepper__button stepper__button--back">
              Back
            </button>
            <button className="stepper__button stepper__button--next">
              Next
            </button>
          </StepActions>
        </Step>
        <Step>
          <StepLabel>Step 3</StepLabel>
          <StepActions>
            <button className="stepper__button stepper__button--back">
              Back
            </button>
            <button className="stepper__button stepper__button--complete">
              Complete
            </button>
          </StepActions>
        </Step>
      </Stepper>
    );

    // 只渲染 Step 1，Step 2/3 不存在
    expect(screen.getByText('Step 1').closest('li')).toHaveClass(
      'stepper__step stepper__step--active'
    );
    expect(screen.queryByText('Step 2')).toBeNull();
    expect(screen.queryByText('Step 3')).toBeNull();

    // 點擊第一步的 Next 進入第二步
    await user.click(screen.getByText('Next'));
    expect(screen.getByText('Step 2').closest('li')).toHaveClass(
      'stepper__step stepper__step--active'
    );
    expect(screen.queryByText('Step 1')).toBeNull();

    // 在第二步 Back 回到第一步
    await user.click(screen.getByText('Back'));
    expect(screen.getByText('Step 1').closest('li')).toHaveClass(
      'stepper__step stepper__step--active'
    );
  });

  it('應該：在最後一步點擊 Complete 時觸發 onComplete 回呼', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <Stepper onComplete={onComplete}>
        <Step>
          <StepLabel>Step A</StepLabel>
          <StepActions>
            <button className="stepper__button stepper__button--next">
              Next
            </button>
          </StepActions>
        </Step>
        <Step>
          <StepLabel>Step B</StepLabel>
          <StepActions>
            <button className="stepper__button stepper__button--back">
              Back
            </button>
            <button className="stepper__button stepper__button--complete">
              Complete
            </button>
          </StepActions>
        </Step>
      </Stepper>
    );

    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Complete'));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  // 非線性模式在僅渲染 activeIndex 設計下，改以 API 控制或未提供點擊跳轉
});
