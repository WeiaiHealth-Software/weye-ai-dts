type EyeBaoProps = {
  className?: string;
};

export function EyeBao({ className = 'w-36 h-36' }: EyeBaoProps) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="30" y="40" width="140" height="130" rx="65" fill="#ffffff" stroke="#bae6fd" strokeWidth="6" />
      <rect x="45" y="60" width="110" height="85" rx="42.5" fill="#f0f9ff" />
      <circle cx="75" cy="100" r="22" fill="none" stroke="#0ea5e9" strokeWidth="5" />
      <circle cx="125" cy="100" r="22" fill="none" stroke="#0ea5e9" strokeWidth="5" />
      <line x1="97" y1="100" x2="103" y2="100" stroke="#0ea5e9" strokeWidth="5" />
      <circle cx="75" cy="100" r="12" fill="#0369a1" />
      <circle cx="125" cy="100" r="12" fill="#0369a1" />
      <circle cx="78" cy="96" r="4" fill="#ffffff" />
      <circle cx="128" cy="96" r="4" fill="#ffffff" />
      <path d="M 90 125 Q 100 135 110 125" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="40" x2="100" y2="15" stroke="#7dd3fc" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="10" r="8" fill="#38bdf8" />
      <circle cx="50" cy="115" r="7" fill="#fecaca" opacity="0.8" />
      <circle cx="150" cy="115" r="7" fill="#fecaca" opacity="0.8" />
      <path d="M 70 170 Q 60 190 80 190 Q 90 190 85 170" fill="#f59e0b" />
      <path d="M 130 170 Q 140 190 120 190 Q 110 190 115 170" fill="#f59e0b" />
    </svg>
  );
}
