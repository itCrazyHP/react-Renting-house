import React from 'react'
import { SearchOutline,DownOutline,CompassOutline } from 'antd-mobile-icons'
import './index.scss'
import { useNavigate } from 'react-router-dom'

const index = ({cityName,iconColor,className}) => {
  const navigate = useNavigate()
  return (
    <div className={['index-search-wrapper' ,className||''].join(' ')}>
        <div className='search'>
            <div className='location' onClick={()=>{navigate('/citylist')}}><span>{cityName}</span><DownOutline fontSize={12} color='#7f7f80'/></div>
            <div className='form' onClick={()=>{navigate('/search')}}><SearchOutline fontSize={15} color='#9c9fa1'/><span>请输入小区或地址</span></div>
        </div>
        <div className='map' onClick={()=>{navigate('/map')}}><CompassOutline fontSize={25} color={iconColor||'#fff'}/></div>
    </div>
  )
}

export default index