import { useState, useEffect } from 'react'

const messages = ['Searching thousands of recipes...', 'Matching your ingredients...', 'Finding the best combinations...', 'Almost there...']

function Loader() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setIdx((prev) => (prev + 1) % messages.length), 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p className="loader-text">{messages[idx]}</p>
    </div>
  )
}

export default Loader
