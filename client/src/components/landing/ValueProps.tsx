import React from 'react';

interface ValuePropItem {
  id: string;
  title: string;
  description: string;
  isElevated?: boolean;
  icon: React.ReactNode;
}

const VALUE_PROPS: ValuePropItem[] = [
  {
    id: 'curated',
    title: 'Curated Notes',
    description: 'Well-structured, concise notes organized and ready for focused reading.',
    icon: (
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    id: 'everywhere',
    title: 'Read Anywhere',
    description: 'Access your engineering reference materials seamlessly across all your devices.',
    isElevated: true,
    icon: (
      <svg
        className="w-6 h-6 text-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: 'updated',
    title: 'Always Up to Date',
    description: 'Technical notes updated regularly so your reference knowledge stays accurate.',
    icon: (
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
];

export const ValueProps: React.FC = () => {
  return (
    <section className="w-full bg-background-alt border-t border-b border-border py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {VALUE_PROPS.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col items-start p-6 sm:p-7 rounded-xl border transition-all duration-150 ${
                item.isElevated
                  ? 'bg-surface-elevated border-primary/30 shadow-xl hover:border-primary hover:shadow-glow-primary'
                  : 'bg-surface border-border shadow-md hover:border-primary/60 hover:shadow-glow-primary'
              }`}
            >
              <div className="p-2.5 rounded-lg bg-background border border-border mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
