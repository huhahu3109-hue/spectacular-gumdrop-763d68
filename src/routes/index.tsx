import { createFileRoute } from '@tanstack/react-router'
import ZufaanGame from '../components/ZufaanGame'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center py-6">
      <ZufaanGame />
    </div>
  )
}
