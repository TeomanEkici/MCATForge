import { cn } from '@/lib/utils'

interface Props {
  value: number
  className?: string
}

export function ProgressBar({ value, className }: Props) {
  return (
    <div className={cn('w-full h-2 bg-secondary rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
