import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button className="back-button flex items-center justify-center" onClick={() => router.back()}>
      <ChevronLeft className="-ml-1" /> Back
    </button>
  )
}
