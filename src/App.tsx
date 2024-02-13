import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ScratchCard } from './ScratchCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ScratchCard />
  )
}

export default App
