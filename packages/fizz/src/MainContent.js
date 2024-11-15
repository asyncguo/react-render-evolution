import { useState } from "react"

const MainContent = ({data}) => {
  const [number, setNumber] = useState(100)
  return (
    <div className="mainContent">
      <h3>MainContent</h3>
      <p>来自服务器的数据: </p>
      <div className="mainCode">
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      <p>可交互区域: {number}</p>
      <button onClick={() => {
        setNumber(number + 1)
      }}>add</button>
    </div>
  )
}

export default MainContent