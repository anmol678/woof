import { cn } from '@/utils/styles'

export default function Loader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="loader h-5 w-5 rounded-full border-2 border-t-2 border-gray-200 ease-linear"></div>
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
