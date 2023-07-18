import React, { useEffect, useState } from 'react'
import { NavBar, Swiper, Image, Grid, Dialog, Toast } from 'antd-mobile'
import { SendOutline } from 'antd-mobile-icons'
import styles from './index.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { API } from '../../utils/api'
import { isAuth } from '../../utils/auth'
import { BASE_URL } from '../../utils/url'
import HousePackage from '../../components/HousePacket/index'

const labelStyle = {
    position: 'absolute',
    zIndex: -7982820,
    backgroundColor: 'rgb(238, 93, 91)',
    color: 'rgb(255, 255, 255)',
    height: 25,
    padding: '5px 10px',
    lineHeight: '14px',
    borderRadius: 3,
    boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
    whiteSpace: 'nowrap',
    fontSize: 12,
    userSelect: 'none'
}

const index = () => {
    const swiperImg = [1, 2, 3, 4, 5]
    const { id } = useParams()
    const [data, setData] = useState({})
    const [houseImg, setHouseImg] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [tags, setTags] = useState([])
    const [oriented, setOriented] = useState([])
    const [supporting, setSupporting] = useState([])
    const [isFavorite,setIsFavorite] =useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getHouseDetail()
    }, [])
    const getHouseDetail = async () => {
        const res = await API.get(`/houses/${id}`)
        setData(res.data.body)
        setHouseImg(res.data.body.houseImg)
        setTags(res.data.body.tags)
        setIsLoading(false)
        setOriented(res.data.body.oriented)
        setSupporting(res.data.body.supporting)

        checkFavorite()

        const { community, coord } = res.data.body
        renderMap(community, coord)
    }

    const checkFavorite =async () =>{
        const isLogin = isAuth()

        if(!isLogin){
            return
        }

        const res = await API.get(`/user/favorites/${id}`)
        console.log(res);
        const {status,body} = res.data
        if(status === 200){
            setIsFavorite(body.isFavorite)
        }
    }

    const renderSwiper = () => {
        return <Swiper loop autoplay style={{ '--height': '211px' }}>
            {houseImg.map(item => (
                <Swiper.Item key={item}>
                    <Image src={BASE_URL + item} />
                </Swiper.Item>))}
        </Swiper>
    }

    const renderTags = () => {
        return tags.map((item, index) => {
            let tagClass = ''
            if (index > 2) {
                tagClass = 'tag3'
            } else {
                tagClass = 'tag' + (index + 1)
            }

            return (
                <span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
                    {item}
                </span>
            )

        })
    }


    const renderMap = (community, coord) => {
        const { latitude, longitude } = coord

        const map = new BMapGL.Map('mapDetail')
        const point = new BMapGL.Point(longitude, latitude)
        map.centerAndZoom(point, 17)

        const label = new BMapGL.Label('', {
            position: point,
            offset: new BMapGL.Size(0, -36)
        })

        label.setStyle(labelStyle)
        label.setContent(`
          <span>${community}</span>
          <div class="${styles.mapArrow}"></div>
        `)
        map.addOverlay(label)
    }

    const handleFavourite = async()=>{
        const isLogin = isAuth()

        if(!isLogin){
            const result = await Dialog.confirm({
                content: '登陆后才能收藏房源，是否去登陆'
              })
              if(result){
                navigate('/login')
              }else{
                return
              }

              
        }else{
            if(isFavorite){
                const res = await API.delete(`/user/favorites/${id}`)
                const {status} = res.data
                if(status === 200){
                    Toast.show({
                        content:'取消收藏成功'
                    })
                    setIsFavorite(false)
                }else{
                    Toast.show({
                        content:'登陆已超时，请重新登陆'
                    })
                    setIsFavorite(false)
                }
              }
            else{
                const res = await API.post(`/user/favorites/${id}`)
                const {status} = res.data
                if(status === 200){
                    Toast.show({
                        content:'收藏成功'
                    })
                    setIsFavorite(true)
                }else{
                    Toast.show({
                        content:'登陆已超时，请重新登陆'
                    })
                }
            }  
        }


    }

    return (
        <div className={styles.root}>
            <div className={styles.navbar}>
                <NavBar onBack={() => { navigate(-1) }} right={<SendOutline />}>{data.community}</NavBar>
            </div>
            {renderSwiper()}
            <div>
                <div className={styles.info}>
                    <h3 className={styles.infoTitle}>
                        {data.title}
                    </h3>
                    <div className={styles.tags}>
                        {renderTags()}
                    </div>
                </div>

                <div className={styles.infoPrice}>
                    <div className={styles.infoPriceItem}>
                        <div>
                            {data.price}
                            <span className={styles.month}>/月</span>
                        </div>
                        <div>租金</div>
                    </div>
                    <div className={styles.infoPriceItem}>
                        <div>{data.roomType}</div>
                        <div>房型</div>
                    </div>
                    <div className={styles.infoPriceItem}>
                        <div>{data.size}平米</div>
                        <div>面积</div>
                    </div>
                </div>

                <div className={styles.infoBasic} align="start">
                    <div>
                        <div>
                            <span className={styles.title}>装修：</span>
                            精装
                        </div>
                        <div>
                            <span className={styles.title}>楼层：</span>
                            {data.floor}
                        </div>
                    </div>
                    <div>
                        <div>
                            <span className={styles.title}>朝向：</span>
                            {oriented.join('、')}
                        </div>
                        <div>
                            <span className={styles.title}>类型：</span>普通住宅
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.map}>
                <div className={styles.mapTitle}>
                    小区：
                    <span>{data.community}</span>
                </div>
                <div id='mapDetail' className={styles.mapContainer} >

                </div>
            </div>

            <div className={styles.about}>
                <div className={styles.houseTitle}>房屋配套</div>
                {supporting.length === 0 ? (
                    <div className={styles.titleEmpty}>暂无数据</div>
                ) : (
                    <HousePackage list={supporting} />
                )}
            </div>

            <div className={styles.set}>
                <div className={styles.houseTitle}>房源概况</div>
                <div>
                    <div className={styles.contact}>
                        <div className={styles.user}>
                            <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                            <div className={styles.useInfo}>
                                <div>王女士</div>
                                <div className={styles.userAuth}>
                                    <i className="iconfont icon-auth" />
                                    已认证房主
                                </div>
                            </div>
                        </div>
                        <span className={styles.userMsg}>发消息</span>
                    </div>
                    <div className={styles.descText}>
                        {data.description || '暂无房屋描述'}
                    </div>
                </div>
            </div>

            <div className={styles.fixedBottom}>
                <Grid columns={3}>
                    <Grid.Item>
                        <div onClick={handleFavourite}>
                            <img
                                src={
                                    BASE_URL + (isFavorite?'/img/star.png':'/img/unstar.png')
                                }
                                className={styles.favoriteImg}
                                alt="收藏"
                            />
                            <span className={styles.favorite}>
                                {isFavorite?'已收藏':'收藏'}
                            </span>
                        </div>
                    </Grid.Item>
                    <Grid.Item>
                        <div>在线咨询</div>
                    </Grid.Item>
                    <Grid.Item>
                        <div className={styles.tel}>
                            <a href="tel:400-618-4000" className={styles.telephone}>
                                电话预约
                            </a>
                        </div>
                    </Grid.Item>
                </Grid>



            </div>

        </div>


    )
}

export default index