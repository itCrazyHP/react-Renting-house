import React, { useEffect, useState } from 'react'
import { NavBar,Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../../utils/url.js'
import {API} from '../../utils/api.js'
import HouseItem from '../../components/HouseItem'

const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255,0,0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255,255,255)',
  textAlign: 'center'
}


const index = () => {
  const navigate = useNavigate()
  const [houseList,setHouseList] = useState([])
  const [isShow,setIsShow] = useState(false)

  const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"))

  useEffect(() => {
    handleInitMap()
  }, [])

  const renderOverlays = async (value, map) => {
    try {
       Toast.show({//添加loading
      icon: 'loading',
      content: '加载中…',
      duration:0
    })
    const res = await API.get(`/area/map?id=${value}`)//获取房源数据
    const data = res.data.body
    const { nextZoom, type } = getTypeAndZoom(map)
    data.forEach(item => {
      createOverlays(item, nextZoom, type, map)
    });
    } catch (error) {
      Toast.clear()
    }
   
  }

  const getTypeAndZoom = (map) => {
    const zoom = map.getZoom()
    let nextZoom, type

    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15
      type = 'circle'
    }
    else if (zoom >= 14 && zoom < 16) {
      type = 'rect'
    }

    return { nextZoom, type }
  }

  const createOverlays = (data, zoom, type, map) => {
    const { coord: { latitude, longitude }, label: areaName, count, value } = data
    const areaPoint = new BMapGL.Point(longitude, latitude)
    if (type === 'circle') {
      createCircle(areaPoint, areaName, count, value, zoom, map)
    } else {
      createRect(areaPoint, areaName, count, value, map)
    }
  }

  const createCircle = (areaPoint, areaName, count, value, zoom, map) => {
    const label = new BMapGL.Label('', {       // 创建文本标注
      position: areaPoint,                          // 设置标注的地理位置
      offset: new BMapGL.Size(-35, -35)           // 设置标注的偏移量
    })

    label.id = value

    label.setContent(`<div class="${styles.bubble}">
        <p class="${styles.name}">${areaName}</p>
        <p>${count}套</p>
      </div>`)

    label.addEventListener('click', () => {
      renderOverlays(value, map)

      map.centerAndZoom(areaPoint, zoom);

      map.clearOverlays()
    })

    map.addOverlay(label);

    Toast.clear()//清除loading

    label.setStyle(labelStyle)
  }

  const createRect = (areaPoint, areaName, count, value,map) => {
    const label = new BMapGL.Label('', {       // 创建文本标注
      position: areaPoint,                          // 设置标注的地理位置
      offset: new BMapGL.Size(-50, -28)           // 设置标注的偏移量
    })

    label.id = value

    label.setContent(
      `<div class="${styles.rect}">
    <span class="${styles.housename}">${areaName}</span>
    <span>${count}套</span>
  </div>`)

    label.addEventListener('click', (e) => {
      Toast.show({//添加loading
        icon: 'loading',
        content: '加载中…',
        duration:0
      })
      const target = e.currentTarget
      map.panBy(window.innerWidth/2 - target.domElement.offsetLeft,(window.innerHeight - 330)/2 - target.domElement.offsetTop) //点击标签后，标签置于中间，window.innerHeight 视口高度
      getHouseList(value)
    })

    map.addOverlay(label);
    
    Toast.clear()
    
    label.setStyle(labelStyle)
  }

  const getHouseList = async(value)=>{
    try {
      const res = await API.get(`/houses?cityId=${value}`)
    setHouseList(res.data.body.list)
    setIsShow(true)
    } catch (error) {
      Toast.clear()
    }
    
  }

  const handleInitMap = () => {
    const map = new BMapGL.Map("container");
    const myGeo = new BMapGL.Geocoder();

    myGeo.getPoint(label, function (point) {
      if (point) {
        map.centerAndZoom(point, 11);
        //map.addOverlay(new BMapGL.Marker(point, { title: label }))
        map.addControl(new BMapGL.ScaleControl())
        map.addControl(new BMapGL.ZoomControl())
        renderOverlays(value, map)

        map.addEventListener('movestart',()=>{
          if(isShow){
            setIsShow(false)
          }
        })


      } else {
        alert('您选择的地址没有解析到结果！');
      }
    }, label)
  }

  const renderHouseList = ()=>{
    Toast.clear()
    return houseList.map(item=>(
     <HouseItem
     key={item.housCode}
     src={BASE_URL + item.houseImg}
     title={item.title}
     desc={item.desc}
     tags={item.tags}
     price={item.price}
     />
    )
    )
      
    
  }

  return (
    <div className={styles.map}>
      <NavBar className={styles.navbar} onBack={() => { navigate(-1);Toast.clear() }}>地图找房</NavBar>
      <div id='container' className={styles.container}></div>
      
      <div
          className={[
            styles.houseList,
            isShow?styles.show:''
            
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
          
          {renderHouseList()}
          
            
            
          </div>
        </div>
    </div>
  )
}

export default index