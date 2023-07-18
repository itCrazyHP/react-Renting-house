import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List,AutoSizer } from 'react-virtualized'
import { Toast } from 'antd-mobile'
import { getCurrentCity } from '../../utils'
import styles from "./index.module.scss"

const HOUSE_LIST = ['北京', '广州', '上海', '深圳']

const Citylist = () => {
    const [cityList,setCityList] = useState({})
    const [cityIndex,setCityIndex] = useState([])
    const [activeIndex,setActiveIndex] = useState(0)//指定高亮

    const cityRef = useRef()

    const navigate = useNavigate()

    useEffect(() => {
        const initData = async () => {
            await getCityList()
            setTimeout(() => {
              cityRef.current.measureAllRows()
            })
          }
          initData()
    }, [cityList,cityIndex])

    const formatCityIndex = (letter)=>{
        switch(letter){
            case '#':
                return '当前定位'
            case 'hot':
                return '热门城市'
            default:
                return letter.toUpperCase()
        }
    }

    const formatCityList = (list) => {
        const cityList = {}

        list.forEach(item => {
            const first = item.short.substr(0, 1)
            if (cityList[first]) {
                cityList[first].push(item)
            } else {
                cityList[first] = [item]
            }
        })

        const cityIndex = Object.keys(cityList).sort()

        return { cityList, cityIndex }
    }

    const getRowHeight = ({index})=>{
        const length = cityList[cityIndex[index]].length*50 + 34; 
        return length
    }

    const rowRenderer =({
        key, // Unique key within array of rows
        index, // 索引号
        isScrolling, // 当前项是否正在滚动中
        isVisible, // 当前项在 List 中是可见的
        style, // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
    }) => {
        const letter = cityIndex[index]
        return (
            <div key={key} style={style}>
                <div className={styles.title}>{formatCityIndex(letter)}</div>
                {
                    cityList[letter].map(item=><div className={styles.name} key={item.value} onClick={()=>changeCity(item)}>{item.label}</div>)
                }
            </div>
        )
    }
    

    const getCityList = async () => {
        const result = await axios.get('http://localhost:8080/area/city?level=1')
        const { cityList, cityIndex } = formatCityList(result.data.body)
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        cityList['hot'] = hotRes.data.body
        cityIndex.unshift('hot')

        const curCity = await getCurrentCity()//没await返回的是Promise，所以await处理得到resolve
        cityList['#'] = [curCity]
        cityIndex.unshift('#')

        setCityIndex(cityIndex)
        setCityList(cityList)
    }

    const renderCityIndex = ()=>{
        return cityIndex.map((item,index)=>
        <li className={styles.cityindex_item} key={item} 
        onClick={() => {
            cityRef.current.scrollToRow(index)
          }}>
            <span className={activeIndex===index?styles.index_active:''}>{ item==='hot'?'热':item.toUpperCase() }</span>
        </li>)
    }

    const onRowsRendered=({startIndex})=>{
        if(startIndex !== activeIndex)
        setActiveIndex(startIndex)
    }

    const changeCity = ({label,value})=>{
        if(HOUSE_LIST.indexOf(label)>-1){
            localStorage.setItem('hkzf_city',JSON.stringify({label,value}))
            navigate(-1)
        }else{
            Toast.show({
                content:'该城市暂无房源信息'
            })
        }
    }

    return (
        <>
        <AutoSizer>
                {({ height, width }) => (<List
                    ref={cityRef}
                    width={width}
                    height={height}
                    rowCount={cityIndex.length}
                    rowHeight={getRowHeight}
                    rowRenderer={rowRenderer}
                    onRowsRendered={onRowsRendered}
                    scrollToAlignment='start'
                />)}
        </AutoSizer> 
        <ul className={styles.cityindex}>
            {
                renderCityIndex()
            }
        </ul>

        </>
               
            
            
        
    )
}

export default Citylist