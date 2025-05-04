import { ReactNode } from 'react'

interface HighlightStrokeProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function HighlightStroke({ children, className = '', style = {} }: HighlightStrokeProps) {
  return (
    <span
      className={`px-2 rounded font-semibold transition-colors duration-200 align-middle ${className}`}
      style={{
        background: 'linear-gradient(90deg, rgba(250,255,0,0.2) 0%, rgba(250,255,0,0.4) 20%, rgba(250,255,0,0.6) 50%, rgba(250,255,0,0.4) 80%, rgba(250,255,0,0.2) 100%)',
        color: '#222',
        boxShadow: '0 0 12px rgba(250,255,0,0.2)',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 2% 2%, 98% 2%, 98% 98%, 2% 98%, 2% 2%)',
        ...style,
      }}
    >
      {children}
    </span>
  )
} 