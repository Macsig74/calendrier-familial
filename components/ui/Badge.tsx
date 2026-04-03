import { getCategoryById } from '@/lib/constants'
import { CategoryId } from '@/lib/types'

interface Props {
  category: CategoryId
  className?: string
}

export default function CategoryBadge({ category, className = '' }: Props) {
  const cat = getCategoryById(category)
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cat.color} ${cat.textColor} ${cat.borderColor} ${className}`}>
      {cat.label}
    </span>
  )
}
