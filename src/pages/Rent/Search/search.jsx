import React, { useEffect, useState } from 'react'
import { SearchBar, List } from 'antd-mobile'
import { API } from '../../../utils/api'
import { getCity } from '../../../utils/city'
import NoHouse from '../../../components/NoHouse'
import styles from './search.module.css'
import { useLocation, useNavigate } from 'react-router-dom'


let timer = null

const search = () => {
    const [value, setValue] = useState('')
    const [tipsList, setTipsList] = useState([])
    const [haveInput,setHaveInput] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const cityId = getCity().value

    useEffect(()=>{
     return () => {
            clearTimeout(timer)
            timer = null
        }
    },[])
    

    const handleSeachTxt = async (value) => {
        setValue(value)
        if (!value) {
            setHaveInput(false)
            setTipsList([])
            clearTimeout(timer)
            return
        }
        clearTimeout(timer)
         timer = setTimeout(async () => {
           const res = await API.get('area/community',
                {
                    params: {
                        name: value,
                        id: cityId
                    }
                })
            if (res.data.status === 200) {
                setTipsList(res.data.body)
            }
        }, 500)
        setHaveInput(true)
         
    }

    const onTipsClick = (item) =>{
        const navTo = location.state ? location.state.from.pathname : '/rent/add'
        navigate(navTo, {
            replace: true,
            state: {
                name: item.communityName,
                id: item.community
            }
        })
    }


    return (
        <div className={styles.root}>
            <SearchBar placeholder='请输入内容' value={value.trim()} onChange={handleSeachTxt}  showCancelButton={() => true} cancelText='返回' onCancel={()=>navigate('/rent/add')}/>
            {tipsList.length === 0 ? 
            (haveInput?<NoHouse>查找不到该区域, 请换个地址~</NoHouse>:null)
            :
            <List style={{'--border-bottom':'none','--border-top':'none'}}>
                {tipsList.map(item=>
                    <List.Item key={item.community} onClick={()=>onTipsClick(item)}>{item.communityName}</List.Item>
                )}
            </List>}
        </div>
    )
}

export default search