import React, { useEffect, useState } from 'react'
import { Swiper,Image } from 'antd-mobile'
import { API } from '../../utils/api.js'
import Navmenu from '../../components/Navmenu/Navmenu.jsx'
import Groups from './Groups.jsx'
import styles from "./index.module.css"
import Newsitem from './Newsitem.jsx'
import Search from './Search.jsx'
import { BASE_URL } from '../../utils/url.js'

const index = () => {
    const[swiperImg,setSwiperImg] = useState([])//存储图片地址

    useEffect(()=>{
        getSwiper() //调用获取图片方法
    },[])

    const getSwiper =async ()=>{//获取图片
    let res = await API.get('/home/swiper')
    setSwiperImg(res.data.body)
    }


if (swiperImg.length > 0) return (
    <div className={styles.content}>
    <Swiper loop autoplay style={{ '--height': '212px' }}>
        {swiperImg.map(item => (
            <Swiper.Item key={item.id}>
                    <Image src={BASE_URL + item.imgSrc}/>
            </Swiper.Item>))}
    </Swiper>
    <Search></Search>
    <Navmenu></Navmenu>
    <Groups></Groups>
    <Newsitem></Newsitem>
    <div className={styles.bottom}></div>
    </div>
    
)

}

export default index
