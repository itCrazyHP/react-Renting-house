import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../utils/url'
import { Button, Grid, Image, Dialog } from 'antd-mobile'
import styles from './index.module.css'
import { useNavigate } from 'react-router-dom'
import { isAuth, getToken, removeToken } from '../../utils/auth'
import { API } from '../../utils/api'

const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favourite' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  { id: 4, name: '成为房主', iconfont: 'icon-identity' },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'
const index = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(isAuth)
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    if (isLogin) {
      const res = await API.get('/user')
      if (res.data.status === 200) {
        setUserInfo(res.data.body)
      }else{
        setIsLogin(false)
      }
    }

    return
  }

  const renderIsLogin = () => {
    return isLogin ? (<>
      <div className={styles.auth}>
        <span onClick={logout}>退出</span>
      </div>
      <div className={styles.edit}>
        编辑个人资料
        <span className={styles.arrow}>
          <i className="iconfont icon-arrow" />
        </span>
      </div>
    </>) : (
      <>
        <div className={styles.edit}>
          <Button size='small' color='success' onClick={() => navigate('/login')}>去登录</Button>
        </div>
      </>
    )
  }

  const logout = async () => {
    const result = await Dialog.confirm({
      content: '确认退出吗'
    })
    if (result) {
      const res = await API.post('/user/logout', null, {
        headers: {
          authorization: getToken()
        }
      })
      removeToken()
      setIsLogin(false)
      setUserInfo({})
    } else {
      return
    }
  }

  return (
    <div className={styles.root}>

      <div className={styles.title}>
        <Image src={BASE_URL + '/img/profile/bg.png'} />
        <div className={styles.info}>
          <div className={styles.myIcon}>
            <Image className={styles.avatar} src={isLogin ? BASE_URL + userInfo.avatar : DEFAULT_AVATAR} />
          </div>
          <div className={styles.user}>
            <div className={styles.name}>{userInfo.nickname || '游客'}</div>
            {renderIsLogin()}
          </div>
        </div>
      </div>

      <Grid columns={3}>
        {menus.map(item => {
          return item.to ? (
            <Grid.Item key={item.id}>
              <div className={styles.menuItem} onClick={() => navigate(item.to)}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            </Grid.Item>
          ) : (
            <Grid.Item key={item.id}>
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            </Grid.Item>
          )
        })}
      </Grid>

      <div className={styles.ad}>
        <Image src={BASE_URL + '/img/profile/join.png'} />
      </div>
    </div>
  )
}

export default index