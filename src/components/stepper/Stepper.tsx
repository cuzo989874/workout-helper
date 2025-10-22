import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface IStepperContextValue {
  activeIndex: number;
  goTo: (index: number) => void;
  next: () => void;
  back: () => void;
  isLinear: boolean;
  total: number;
  markCompleted: (index: number) => void;
  completedSet: Set<number>;
  onComplete?: () => void;
}

const StepperContext = createContext<IStepperContextValue | null>(null);
const StepItemContext = createContext<{ currentIndex: number } | null>(null);

export function useStepperContext() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error('useStepperContext must be used within Stepper');
  return ctx;
}

export interface IStepperProps {
  children: React.ReactNode;
  initialStep?: number;
  nonLinear?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function Stepper({
  children,
  initialStep = 0,
  nonLinear = false,
  onComplete,
  className = '',
}: IStepperProps) {
  const [activeIndex, setActiveIndex] = useState<number>(initialStep);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());

  const steps = React.Children.toArray(children).filter(Boolean);
  const total = steps.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(prev => {
        if (!nonLinear) {
          // Linear: only allow forward/back by one, not jumping arbitrarily
          if (index === prev + 1 || index === prev - 1 || index === prev) {
            return Math.max(0, Math.min(index, total - 1));
          }
          return prev;
        }
        return Math.max(0, Math.min(index, total - 1));
      });
    },
    [nonLinear, total]
  );

  const next = useCallback(() => {
    setActiveIndex(prev => Math.min(prev + 1, total - 1));
  }, [total]);

  const back = useCallback(() => {
    setActiveIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const markCompleted = useCallback((index: number) => {
    setCompletedSet(prev => {
      const nextSet = new Set(prev);
      nextSet.add(index);
      return nextSet;
    });
  }, []);

  const value = useMemo<IStepperContextValue>(
    () => ({
      activeIndex,
      goTo,
      next,
      back,
      isLinear: !nonLinear,
      total,
      markCompleted,
      completedSet,
      onComplete,
    }),
    [
      activeIndex,
      back,
      completedSet,
      goTo,
      markCompleted,
      next,
      nonLinear,
      onComplete,
      total,
    ]
  );

  const activeChild = steps[activeIndex] as React.ReactNode | undefined;
  return (
    <StepperContext.Provider value={value}>
      <ol className={`stepper ${className}`.trim()}>
        {activeChild != null && (
          <StepInternal index={activeIndex}>
            <StepItemContext.Provider value={{ currentIndex: activeIndex }}>
              {activeChild}
            </StepItemContext.Provider>
          </StepInternal>
        )}
      </ol>
    </StepperContext.Provider>
  );
}

interface IStepProps {
  index: number;
  children: React.ReactNode;
}

function StepInternal({ index, children }: IStepProps) {
  const { activeIndex, completedSet } = useStepperContext();
  const isActive = index === activeIndex;
  const isCompleted = completedSet.has(index);

  const classNames = ['stepper__step'];
  if (isActive) classNames.push('stepper__step--active');
  if (isCompleted) classNames.push('stepper__step--completed');

  return <li className={classNames.join(' ')}>{children}</li>;
}

export function Step({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function StepLabel({ children }: { children: React.ReactNode }) {
  const { goTo, isLinear, activeIndex } = useStepperContext();
  const item = useContext(StepItemContext);
  const handleClick = () => {
    if (isLinear) return;
    const index = item?.currentIndex ?? -1;
    if (index !== -1 && index !== activeIndex) {
      goTo(index);
    }
  };

  return (
    <div className={'stepper__label'} onClick={handleClick} role="button">
      {children}
    </div>
  );
}

export function StepActions({
  children,
  className,
  onBeforeNext,
  onBeforeBack,
  onBeforeComplete,
}: {
  children: React.ReactNode;
  className?: string;
  onBeforeNext?: () => boolean | Promise<boolean>;
  onBeforeBack?: () => boolean | Promise<boolean>;
  onBeforeComplete?: () => boolean | Promise<boolean>;
}) {
  const { next, back, activeIndex, total, markCompleted, onComplete } =
    useStepperContext();
  const item = useContext(StepItemContext);
  const isActive = (item?.currentIndex ?? -1) === activeIndex;

  const runGuard = async (
    guard?: () => boolean | Promise<boolean>
  ): Promise<boolean> => {
    if (!guard) return true;
    try {
      const result = await Promise.resolve(guard());
      return result !== false;
    } catch {
      return false;
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return; // ignore clicks on inactive steps
    const target = e.target as HTMLElement;
    if (!target) return;
    if (target.closest('.stepper__button--next')) {
      e.preventDefault();
      const ok = await runGuard(onBeforeNext);
      if (!ok) return;
      markCompleted(activeIndex);
      if (activeIndex < total - 1) {
        next();
      }
      return;
    }
    if (target.closest('.stepper__button--back')) {
      e.preventDefault();
      const ok = await runGuard(onBeforeBack);
      if (!ok) return;
      back();
      return;
    }
    if (target.closest('.stepper__button--complete')) {
      e.preventDefault();
      const ok = await runGuard(onBeforeComplete);
      if (!ok) return;
      markCompleted(activeIndex);
      onComplete?.();
      return;
    }
  };

  return (
    <div
      className={`stepper__actions ${className ?? ''}`}
      onClick={handleClick}
      aria-hidden={!isActive}
    >
      {children}
    </div>
  );
}

export default Stepper;
