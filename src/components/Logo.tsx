export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10L10 40V90H40V65H60V90H90V40L50 10Z"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      
      <rect
        x="42"
        y="70"
        width="16"
        height="20"
        fill="white"
        rx="1"
      />
      
      <g transform="translate(50, 80) scale(0.8)">
        <path
          d="M0 -8C-4.4 -8 -8 -4.4 -8 0C-8 4.4 0 12 0 12C0 12 8 4.4 8 0C8 -4.4 4.4 -8 0 -8Z"
          fill="hsl(var(--accent))"
        />
        <circle
          cx="0"
          cy="0"
          r="3"
          fill="white"
        />
      </g>
    </svg>
  );
}
