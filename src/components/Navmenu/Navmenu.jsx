import React from 'react'
import { Grid, Image } from 'antd-mobile'
import Nav1 from '@/assets/images/nav-1.png'
import Nav2 from '@/assets/images/nav-2.png'
import Nav3 from '@/assets/images/nav-3.png'
import Nav4 from '@/assets/images/nav-4.png'
import './Navmenu.css'
import { useNavigate } from 'react-router-dom'

const Navmenu = () =>{
  const navs = [
    {
      id:1,
      img:Nav1,
      title:'整租',
      path:'/home/list'
    },
    {
      id:2,
      img:Nav2,
      title:'合租',
      path:'/home/list'
    },
    {
      id:3,
      img:Nav3,
      title:'地图找房',
      path:'/map'
    },
    {
      id:4,
      img:Nav4,
      title:'去出租',
      path:'/rent/add'
    },
  ]
  const navigate = useNavigate()//糙了司马的，浪费半小时，不这样用不了useNavigate方法
  return (
    <div className='navmenu'>
      <Grid columns={4} gap={8}>
      {navs.map(item=>(
      <Grid.Item key={item.id} >
        <img src={item.img} alt="" width={48} onClick={()=>{navigate(item.path)}}/>
        <h2>{item.title}</h2>
      </Grid.Item>
    ))}
    </Grid>
    </div>
  )
}

export default Navmenu
