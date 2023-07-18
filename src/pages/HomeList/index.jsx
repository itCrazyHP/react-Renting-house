import React, { useEffect, useState } from 'react'
import SearchHeader from '../../components/SearchHeader/index'
import { LeftOutline } from 'antd-mobile-icons'
import styles from '/./src/pages/HomeList/index.module.css'
import { useNavigate } from 'react-router-dom'
import Filter from './components/Filter/index'
import { API } from '../../utils/api'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import HouseItem from '../../components/HouseItem'
import { BASE_URL } from '../../utils/url'
import Sticky from '../../components/Sticky'
import { Toast,SpinLoading } from 'antd-mobile'
import Loading from '../../components/Loading/index'
import NoHouse from '../../components/NoHouse/index'

const index = () => {
  const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [count, setCount] = useState(0)
  const [filters, setFilters] = useState({})
  const [isShow,setIsShow] = useState(false)
  const [isLoading,setIsLoading] = useState(false)

  useEffect(() => {
    
    const searchHouseList = async () => {
     setIsShow(pre=>!pre)
     setIsLoading(true)
      const res = await API.get('/houses', {
        params: {
          cityId: value,
          ...filters,
          start: 1,
          end: 20
        }
      })
      const { list, count } = res.data.body
      setList(list)
      setCount(count)
      setIsShow(pre=>!pre)
      setIsLoading(false)
      }

    searchHouseList()
  }, [filters])

  
  

  const onFilter = (filter) => {
    window.scrollTo(0,0)
    setFilters(filter)
  }

  const renderHouseList = ({
    key, // Unique key within array of rows
    index, // 索引号
    style, // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
  }) => {
    const house = list[index]
    if (!house) {
      return <div key={key} style={style}>
        <p className={styles.loading}></p>
      </div>
    }
    return (
      <HouseItem
        key={key}
        onClick = {()=>{navigate(`/detail/${house.houseCode}`)}}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        tags={house.tags}
        price={house.price}
        desc={house.desc}
      />
    )
  }

  const isRowLoaded = ({ index }) => {
    return !!list[index]
  }

  const loadMoreRows = ({ startIndex, stopIndex = 20 }) => {
    return new Promise(resolve => {
      API.get('/houses', {
        params: {
          cityId: value,
          ...filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        setList([...list, ...res.data.body.list])
        resolve()
      })
    })
  }

  const renderList = () =>{
    if(count === 0 && !isLoading){
      return <NoHouse>暂无房源</NoHouse>
    }
    
    return (<InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={count}>
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller>
          {({ height, isScrolling, scrollTop }) => (
            <AutoSizer>
              {({ width }) => (
                <List
                  autoHeight
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  width={width}
                  height={height}
                  rowCount={count}
                  rowHeight={120}
                  rowRenderer={renderHouseList}
                  isScrolling={isScrolling}
                  scrollTop={scrollTop}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>)
  }

  return (
    <div className={styles.homeList}>
      <div className={styles.header}>
        <LeftOutline fontSize={19} color='#999' className='op' onClick={() => { navigate(-1) }} />
        <SearchHeader className={styles.searchHeader} cityName={label} iconColor={'#00ae66'} />
      </div>
      
      <Sticky height={40}>
        <Filter onFilter={onFilter} />
      </Sticky>
      {isShow?<Loading color='#fff'/>:null}
      
      <div className={styles.houseItems}>{renderList()}</div>
    </div>
  )
}

export default index