export default async function MainContent() {  
  const notes = await (await fetch('http://localhost:3019/todos')).json()  

  return (
    <div className="mainContent">
      <h3>MainContent</h3>
      <p>来自服务器的数据: </p>
      <div className="mainCode">
        <pre>
          {
            notes
              ? JSON.stringify(notes, null, 2)
              : null
          }
        </pre>
      </div>
    </div>
  )
}
