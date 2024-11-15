import { useState, useEffect } from "react"

const getNumber  = import('./getNumber.js')

const Sidenav = () => {
  const [number, setNumber] = useState(0)

  useEffect(() => {
    getNumber.then(res => {
      console.log('res', res);
    })
  }, [])

  return (
    <div className="sidenav">
      <h3>Sidenav</h3>

      <p>点击次数: {number}</p>

      <button onClick={() => {
        setNumber(number + 1)
      }}>可交互</button>
    </div>
  )
}

export default Sidenav