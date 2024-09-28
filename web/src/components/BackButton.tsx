import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface BackButtonProps {
  route?: string
}

export default function BackButton({ route }: BackButtonProps) {
  const router = useRouter()

  const action = route ? () => router.push(route) : () => router.back()

  return (
    <button className="back-button flex items-center justify-center" onClick={action}>
      <ChevronLeft className="-ml-1" /> Back
    </button>
  )
}
