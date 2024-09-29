import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

interface BackButtonProps {
  route?: string
}

export default function BackButton({ route }: BackButtonProps) {
  const router = useRouter()

  const action = route ? () => router.push(route) : () => router.back()

  return (
    <button className="back-button flex items-center justify-center" onClick={action}>
      <ChevronLeftIcon className="-ml-1 h-6 w-6 stroke-2" /> Back
    </button>
  )
}
