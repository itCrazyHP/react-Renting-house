import React from 'react'
import { SpinLoading } from 'antd-mobile'
import styles from './index.module.css'
const index = ({color,size=40,fontSize=16}) => {
  return (
    <div className={styles.Loading}>
        <SpinLoading  style={{ '--size': `${size}px`,'--color':color}}/>
        <span className={styles.content} style={{fontSize:`${fontSize}px`}}>加载中...</span>
    </div>
    
  )
}

export default index