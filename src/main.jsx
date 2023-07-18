import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'react-virtualized/styles.css'
import "./main.css"
import 'reset-css'
import './assets/fonts/iconfont.css'
import { BrowserRouter,HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <App />
    </BrowserRouter>
  
)
