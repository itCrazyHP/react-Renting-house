import { NavBar } from 'antd-mobile'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import Citylist from './Citylist'
const index = () => {
  const navigate = useNavigate()//返回上一级
  return (
    <div className={styles.citylist}>
      <NavBar className={styles.navbar} onBack={()=>{navigate(-1)}}>标题</NavBar>
      <Citylist></Citylist>
    </div>
  )
}

export default index