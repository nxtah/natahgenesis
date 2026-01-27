// Placeholder SVG for chatbot icon
export default function ChatbotIcon(props) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Bubble chat head */}
      <ellipse cx="16" cy="16" rx="12" ry="11" fill="#fff"/>
      {/* Antenna */}
      <rect x="14.5" y="5" width="3" height="5" rx="1.5" fill="#fff"/>
      <circle cx="16" cy="5" r="2" fill="#fff"/>
      {/* Eyes */}
      <ellipse cx="12.5" cy="16" rx="1.2" ry="1.5" fill="#181818"/>
      <ellipse cx="19.5" cy="16" rx="1.2" ry="1.5" fill="#181818"/>
      {/* Smile */}
      <path d="M13 20c1.5 1 4.5 1 6 0" stroke="#181818" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
