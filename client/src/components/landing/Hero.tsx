import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface HeroProps {
  onOpenSignup: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSignup }) => {
  return (
    <section className="relative w-full py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-dot-grid overflow-hidden">
      {/* Single static blurred radial background blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[500px] h-[180px] sm:h-[300px] bg-gradient-to-tr from-primary/20 via-secondary/15 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        {/* Left Column: Text & CTA */}
        <div className="flex-1 text-center lg:text-left space-y-5 sm:space-y-6 max-w-2xl">
          <div>
            <Badge>ENGINEERING REFERENCE PLATFORM</Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight sm:leading-tight">
            All your{' '}
            <span className="bg-gradient-to-r from-[#4f7cff] to-[#60a5fa] bg-clip-text text-transparent">
              engineering notes
            </span>{' '}
            in one place.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-text-secondary font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
            Clean, fast, and structured technical reference notes built for software engineers. Read anywhere, anytime.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Button
              variant="primary"
              fullWidth={false}
              onClick={onOpenSignup}
              className="w-full sm:w-auto text-base px-8 py-3 font-semibold shadow-glow-primary hover:shadow-glow-primary-lg"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Right Column: Dashboard UI Product Preview Screenshot Mock */}
        <div className="w-full max-w-md lg:max-w-none lg:flex-1 shrink-0">
          <div className="relative rounded-2xl bg-surface-elevated border border-primary/30 p-4 sm:p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] shadow-glow-primary/10 overflow-hidden text-left">
            
            {/* Mock App Window Header Chrome */}
            <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-2 bg-surface px-3 py-1 rounded-full border border-border/60 text-[11px] text-text-secondary font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>notes.io/dashboard</span>
              </div>
            </div>

            {/* Mini Dashboard Header Bar Mock */}
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight bg-gradient-to-r from-[#4f7cff] to-[#60a5fa] bg-clip-text text-transparent">
                  Notes.io
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary/70 bg-surface px-2 py-0.5 rounded border border-border/40">
                  Student Portal
                </span>
              </div>
              {/* Mini Mock Search Bar */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border/60 text-xs text-text-secondary/60 max-w-[140px] sm:max-w-[180px] truncate">
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="truncate text-[11px]">Search notes...</span>
              </div>
            </div>

            {/* Section Title */}
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Browse Departments
              </h4>
              <span className="text-[10px] font-mono text-primary">5 Departments</span>
            </div>

            {/* Mini Department Card Previews (Exactly 2 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Mini Department Card 1 */}
              <div className="bg-surface border border-border/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 text-primary flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7" />
                    </svg>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-elevated text-text-secondary border border-border/60 font-mono">
                    14 notes
                  </span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-text-primary">Computer Science</h5>
                  <p className="text-[10px] text-text-secondary mt-0.5">DSA, Databases, Operating Systems</p>
                </div>
              </div>

              {/* Mini Department Card 2 */}
              <div className="bg-surface border border-border/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7" />
                    </svg>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-elevated text-text-secondary border border-border/60 font-mono">
                    22 notes
                  </span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-text-primary">Mechanical Engineering</h5>
                  <p className="text-[10px] text-text-secondary mt-0.5">Thermodynamics, Heat Transfer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
