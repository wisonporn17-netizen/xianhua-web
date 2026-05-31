export function PromptPayIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#1A56A0"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">พร้อมเพย์</text>
    </svg>
  )
}

export function VisaIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 50 30" fill="none">
      <rect width="50" height="30" rx="3" fill="#1A1F71"/>
      <text x="25" y="21" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial" fontStyle="italic">VISA</text>
    </svg>
  )
}

export function MastercardIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="9" cy="12" r="7" fill="#EB001B"/>
      <circle cx="15" cy="12" r="7" fill="#F79E1B"/>
      <path d="M12 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 12 6.8z" fill="#FF5F00"/>
    </svg>
  )
}

export function TrueMoneyIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 18 L8 4 L12 14 L16 4 L20 18" fill="none" stroke="#E31E24" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M6 18 L10 6 L12 14 L14 6 L18 18" fill="#F7A600" opacity="0.7"/>
    </svg>
  )
}
