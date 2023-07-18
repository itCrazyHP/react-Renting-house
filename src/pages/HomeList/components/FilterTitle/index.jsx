import React from 'react'
import { DownFill } from 'antd-mobile-icons'
import styles from './index.module.css'

const titleList = [
    {title:'区域',type:'area'},
    {title:'方式',type:'mode'},
    {title:'租金',type:'price'},
    {title:'筛选',type:'more'},
]

const index = ({titleSelectedStatus,onTitleClick}) => {
    //titleSelectedStatus:{area: false, mode: false, price: false, more: false}
    return (
    <div className={styles.root}>
        {titleList.map(item=>{
            const isSelected = titleSelectedStatus[item.type] //获取到Boolean值
            return (
                
                <div key={item.type} onClick={()=>{onTitleClick(item.type)}}>    {/* 传递被点名字 */}   
                  <span className={[styles.dropdown,isSelected?styles.selected:''].join(' ')}>
                    <span className={styles.title}>{item.title}</span>
                    <DownFill color='#999' className={isSelected?styles.selected:''}  fontSize='10px'/>
                    </span>  
                </div>
            )
        })}
    </div>
  )
}

export default index