import React, { useEffect, useState } from 'react'
import { API } from '../../utils/api'
import "./Newsitem.scss"
const Newsitem = () => {
    const [newsItem, setNewsItem] = useState([])
    useEffect(() => {
        getNewsItem()
    }, [])
    const getNewsItem = async () => {
        const res = await API.get('/home/news',
            {
                params: {
                    area: 'AREA%7C88cff55c-aaa4-e2e0'
                }
            })
        setNewsItem(res.data.body);
    }

    return (
        <div className='index-news-wrapper'>
            <span className='Latest-info'>最新资讯</span>
            {newsItem.map(item => (
                <div key={item.id}>
                <div className='index-news' >
                    <img src={`http://localhost:8080${item.imgSrc}`} alt="" width={130} />
                    <div className='news'>
                        <span>{item.title}</span>
                        <div className='from-date'>
                            <span>{item.from}</span>
                            <span>{item.date}</span>
                        </div>
                    </div>
                </div>
                <div className='index-news-line'></div>
                </div>
                
            ))}
        </div>
    )
}

export default Newsitem