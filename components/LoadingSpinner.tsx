'use client'

interface LoadingSpinnerProps {
  className?: string
}

export default function LoadingSpinner({ className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex justify-center items-center py-8 ${className}`}>
      <svg 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-gray-900 dark:text-gray-50"
      >
        <circle cx="4" cy="12" r="3" opacity="1">
          <animate id="spinner_qYjJ" begin="0;spinner_t4KZ.end-0.25s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/>
        </circle>
        <circle cx="12" cy="12" r="3" opacity=".4">
          <animate begin="spinner_qYjJ.begin+0.15s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/>
        </circle>
        <circle cx="20" cy="12" r="3" opacity=".3">
          <animate id="spinner_t4KZ" begin="spinner_qYjJ.begin+0.3s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/>
        </circle>
      </svg>
    </div>
  )
} 