import React, { useState } from 'react'
import { Badge, TabBar } from 'antd-mobile'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import "./index.css"
import styles from "./index.module.css"
import { HomeOutlined,SearchOutlined} from '@ant-design/icons'
import {
    AppOutline,
    MessageOutline,
    MessageFill,
    UnorderedListOutline,
    UserOutline,
} from 'antd-mobile-icons'
const home = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location

    const setRouteActive = (value) => {
        navigate(value)//value是key
    }

    const tabs = [//定义tapbar属性
        {
            key: '/home',
            title: '首页',
            icon: <HomeOutlined />,
        },
        {
            key: '/home/list',
            title: '找房',
            icon: <SearchOutlined />,
        },
        {
            key: '/home/news',
            title: '资讯',
            icon: (active) =>
                active ? <MessageFill /> : <MessageOutline />,
        },
        {
            key: '/home/profile',
            title: '我的',
            icon: <UserOutline />,
        },
    ]
    return (
        <>
            <div className={styles.app}>
                <div className={styles.body}>
                    <Outlet></Outlet>
                </div>
               <div className={styles.bottomwrapper}>
                    <div className={styles.bottom}>
                     
                    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
                        {tabs.map(item => (
                            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                        ))}
                    </TabBar>
                    </div>
                </div>
                
                
            </div>

        </>
    )
}

export default home