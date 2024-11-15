'use client';

import { useState } from "react";

const KeepState = () => {
  const [number, setBumber] = useState(0);
  
  return (
    <div>
      <h3>keep state</h3>
      <input 
        value={number}
        onChange={(e) => setBumber(e.target.value)}
      />
    </div>
  )
};

export default KeepState;
