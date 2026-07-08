import { Toaster } from '@/components/ui/toaster'
import Router from './routes'

function App() {
    return (
        <div className='m-auto'>
            <Router />
            <Toaster />
        </div>
    )
}

export default App
