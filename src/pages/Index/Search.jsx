import React, { useEffect, useState } from 'react'
import { SearchOutline,DownOutline,CompassOutline } from 'antd-mobile-icons'
import "./Search.scss"
import { useNavigate } from 'react-router-dom'
import { getCurrentCity } from '../../utils'
import SearchHeader from '../../components/SearchHeader/index'
const Search = () => {
    const navigate=useNavigate()
    const [label,setLabel] = useState([])
    useEffect(()=>{
      getCurCity()
      }
    ,[])

    const getCurCity=async()=>{
      const curCity = await getCurrentCity()
      setLabel(curCity.label)
    }
  return (
    <SearchHeader cityName={label}/>
  )
}

export default Search