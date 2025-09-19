'use client'

import Avatar from 'react-avatar'
import { useEffect, useState } from 'react'

interface AutoAvatarProps {
  name: string
  size?: number | string
  className?: string
}

export default function AutoAvatar({ name, size = 40, className = '' }: AutoAvatarProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div style={{ width: size, height: size }} className={className} />
  }

  return (
    <Avatar
      name={name}
      size={String(size)}
      round={true}
      color="#000000"
      fgColor="#ffffff"
      className={className}
    />
  )
}
