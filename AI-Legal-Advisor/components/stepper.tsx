'use client'

import React, { useState, Children, useRef, useLayoutEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// ─── Stepper Component (based on ReactBits, adapted to TypeScript + LAwBOTie theme) ───

interface StepperProps {
  children: ReactNode
  initialStep?: number
  onStepChange?: (step: number) => void
  onFinalStepCompleted?: () => void
  backButtonText?: string
  nextButtonText?: string
  disableStepIndicators?: boolean
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [direction, setDirection] = useState(0)
  const stepsArray = Children.toArray(children)
  const totalSteps = stepsArray.length
  const isCompleted = currentStep > totalSteps
  const isLastStep = currentStep === totalSteps

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep)
    if (newStep > totalSteps) {
      onFinalStepCompleted()
    } else {
      onStepChange(newStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1)
      updateStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1)
      updateStep(currentStep + 1)
    }
  }

  const handleComplete = () => {
    setDirection(1)
    updateStep(totalSteps + 1)
  }

  return (
    <div className="stepper-outer">
      <div className="stepper-container">
        {/* Step indicators */}
        <div className="stepper-indicator-row">
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1
            const isNotLastStep = index < totalSteps - 1
            return (
              <React.Fragment key={stepNumber}>
                <StepIndicator
                  step={stepNumber}
                  currentStep={currentStep}
                  disableStepIndicators={disableStepIndicators}
                  onClickStep={(clicked) => {
                    if (clicked < currentStep) {
                      setDirection(clicked > currentStep ? 1 : -1)
                      updateStep(clicked)
                    }
                  }}
                />
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            )
          })}
        </div>

        {/* Step content */}
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {/* Footer nav */}
        {!isCompleted && (
          <div className="stepper-footer">
            <div className={`stepper-nav ${currentStep !== 1 ? 'spread' : 'end'}`}>
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className="stepper-back-btn"
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="stepper-next-btn"
              >
                {isLastStep ? 'Complete' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function Step({ children }: { children: ReactNode }) {
  return <div className="stepper-step-content">{children}</div>
}

// ─── Internal Components ───

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
}: {
  isCompleted: boolean
  currentStep: number
  direction: number
  children: ReactNode
}) {
  const [parentHeight, setParentHeight] = useState(0)

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const stepVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '-100%' : '100%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '50%' : '-50%',
    opacity: 0,
  }),
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: {
  children: ReactNode
  direction: number
  onHeightReady: (h: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight)
  }, [children, onHeightReady])

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  )
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}: {
  step: number
  currentStep: number
  onClickStep: (step: number) => void
  disableStepIndicators: boolean
}) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete'

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step)
  }

  return (
    <motion.div
      onClick={handleClick}
      className="stepper-indicator"
      style={disableStepIndicators ? { pointerEvents: 'none', opacity: 0.5 } : {}}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: 'rgba(34, 211, 238, 0.1)', color: '#6b7280' },
          active: { scale: 1, backgroundColor: 'rgba(34, 211, 238, 0.3)', color: '#22d3ee' },
          complete: { scale: 1, backgroundColor: 'rgba(34, 211, 238, 0.5)', color: '#22d3ee' },
        }}
        transition={{ duration: 0.3 }}
        className="stepper-indicator-inner"
      >
        {status === 'complete' ? (
          <CheckIcon />
        ) : status === 'active' ? (
          <div className="stepper-active-dot" />
        ) : (
          <span className="stepper-step-number">{step}</span>
        )}
      </motion.div>
    </motion.div>
  )
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="stepper-connector">
      <motion.div
        className="stepper-connector-inner"
        initial={false}
        animate={isComplete ? { width: '100%', backgroundColor: '#22d3ee' } : { width: 0, backgroundColor: 'transparent' }}
        transition={{ duration: 0.4 }}
      />
    </div>
  )
}

function CheckIcon() {
  return (
    <svg className="stepper-check-icon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
