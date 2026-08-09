import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface HeroProps {
  onOpenSignup: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSignup }) => {
  return (
    <section className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center bg-dot-grid">
      {/* Single static blurred radial background blob (pure blue gradient accent) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-primary/20 via-secondary/15 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Eyebrow Badge */}
        <div>
          <Badge>ENGINEERING REFERENCE PLATFORM</Badge>
        </div>

        {/* Main Headline with single key phrase gradient text */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight sm:leading-tight">
          All your{' '}
          <span className="bg-gradient-to-r from-[#4f7cff] to-[#60a5fa] bg-clip-text text-transparent">
            engineering notes
          </span>{' '}
          in one place.
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
          Clean, fast, and structured technical reference notes built for software engineers. Read anywhere, anytime.
        </p>

        {/* Primary CTA */}
        <div className="pt-4 flex justify-center">
          <Button
            variant="primary"
            fullWidth={false}
            onClick={onOpenSignup}
            className="text-base px-8 py-3 font-semibold shadow-glow-primary hover:shadow-glow-primary-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};
