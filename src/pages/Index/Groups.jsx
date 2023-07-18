import React, { useEffect, useState } from 'react'
import { API } from '../../utils/api'
import './Groups.scss'
import { Grid } from 'antd-mobile'
const Groups = () => {
    const [list, setList] = useState([])
    useEffect(() => {
        getGroups()
    }, [])

    const getGroups = async () => {
        let res = await API.get('/home/groups',
            {
                params: {
                    area: 'AREA%7C88cff55c-aaa4-e2e0'
                }
            })
        setList(res.data.body);
    }
    return (
        <div className='grops-wrapper'>
            <div className='groups'>
                <span>租房小组</span> <span>更多</span>
            </div>
            <div className='list_box'>
                <Grid columns={2} gap={8}>
                    {list.map(item => (
                        <Grid.Item key={item.id} >
                            <div className='list_box_h2'>
                                <h2>{item.title}</h2>
                                <h2>{item.desc}</h2>
                            </div>
                            <img src={`http://localhost:8080${item.imgSrc}`} alt="" width={56} />
                        </Grid.Item>
                    ))}
                </Grid>
            </div>

        </div>
    )
}

export default Groups