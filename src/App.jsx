import React from 'react'
import { Button } from 'antd-mobile'
import SetRoutes from "./router"
import { useRoutes,Link, BrowserRouter } from 'react-router-dom'


const App = () => {
  //const outlet = useRoutes(routes)
  return (
// 5g9Uh7v70PSyAv5XTnfPI0bv4G2FsWbt百度地图密钥
    <div className='App'>
        {/* <Link to='/home' > home </Link>
        <Link to='/citylist' > citylist </Link> */}
        <SetRoutes/>
        
    </div>

    
  )
}

export default App