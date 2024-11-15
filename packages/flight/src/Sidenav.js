'use client';

import { useState, useEffect } from "react"
import { getNoteAction } from './actions/index.js'

const getNumber  = import('./getNumber.js')

const Sidenav = ({version}) => {
  const [number, setNumber] = useState(0)
  const [notes, setNotes] = useState([]);
  
  useEffect(() => {
    getNumber.then(res => {
      console.log('async funtion getNumber: ', res.default());
    })
  }, [])

  return (
    <div className="sidenav">
      <h3>Version: {version}</h3>
      <h3>Sidenav</h3>

      <p>点击次数: {number}</p>

      <div>
        <button onClick={() => {
          setNumber(number + 1)
        }}>可交互</button>
      </div>

      <h3>Server Actions</h3>
      <div>
        <button
          onClick={async () => {
            console.log(getNoteAction);
            const notes = await getNoteAction()

            setNotes(notes || [])
          }}
          >getNoteAction</button>
      </div>

      {
        notes?.map((item, index) => (
          <h6 key={index}>{item.type}</h6>
        ))
      }
    </div>
  )
}

export default Sidenav