import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { NavBar, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { API } from '../../utils/api'
import Loading from '../../components/Loading'
import NoHouse from '../../components/NoHouse'
import HouseItem from '../../components/HouseItem'
import { BASE_URL } from '../../utils/url'

const index = () => {
    const navigate = useNavigate()
    const [have,setHave] = useState(false)
    const [data,setData] = useState([])
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=>{
        getHouseList()
    }
    ,[])
    
    const getHouseList = async () =>{
        const res =await API.get('/user/houses')
        console.log(res);
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
        <NavBar onBack={()=>navigate('/home/profile')}>我的出租</NavBar>
        {isLoading  ?  <Loading/>  :  (have?renderHouseList():<NoHouse>暂未发布房源，<span className={styles.add} onClick={()=>navigate('/rent/add')}>点击此处发布房源</span></NoHouse>)}
        <div className={styles.bottom}>
                <div className={styles.confirm} onClick={()=>navigate('/rent/add')}>
                    去出租
                </div>
            </div>
    </div>

  )
}

export default index