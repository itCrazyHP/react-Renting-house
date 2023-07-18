import { NavBar,Toast} from 'antd-mobile'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HouseItem from '../../components/HouseItem'
import { API } from '../../utils/api'
import styles from './index.module.css'
import { BASE_URL } from '../../utils/url'
import NoHouse from '../../components/NoHouse'
import Loading from '../../components/Loading'

const index = () => {
    const navigate = useNavigate()
    const [have,setHave] = useState(false)
    const [data,setData] = useState([])
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=>{
        getFavourite()
    },[])

    const getFavourite = async()=>{
        const res =await API.get('/user/favorites')
        setIsLoading(false)
        if(res.data.status === 200){
            if(res.data.body.length === 0){
            setHave(false)
        }else{
            setData(res.data.body)
            setHave(true)
        }
        }else{
            Toast.show({
                content:'登陆异常，请重新登陆'
            })
        }
    }

    const renderHouseList = () =>{
        return data.map(item=>(
        <HouseItem
        key={item.houseCode}
        onClick = {()=>{navigate(`/detail/${item.houseCode}`)}}
        src={BASE_URL + item.houseImg}
        title={item.title}
        tags={item.tags}
        price={item.price}
        desc={item.desc}
      />
            ))
        
    }
  return (
    <div className={styles.root}>
        <NavBar onBack={()=>navigate(-1)}>喜爱</NavBar>
        {isLoading  ?  <Loading/>  :  (have?renderHouseList():<NoHouse>暂无收藏，快去收藏中意房屋吧~</NoHouse>)}
    </div>
  )
}

export default index