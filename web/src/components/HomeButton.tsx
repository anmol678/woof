import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function HomeButton() {
  const router = useRouter()

  return (
    <button className="back-button flex items-center justify-center" onClick={() => router.push('/')}>
      <ChevronLeft className="-ml-1" /> Home
    </button>
  )
}
