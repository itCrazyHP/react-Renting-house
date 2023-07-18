import { List, NavBar, Input, Picker, CascadePicker, ImageUploader, TextArea, Toast } from 'antd-mobile';
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './add.module.css'
import HousePackage from '../../../components/HousePacket'
import { roomTypeData, floorData, orientedData } from './addcolumns';
import { API } from '../../../utils/api'


const add = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const [isSend,setIsSend] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [visible3, setVisible3] = useState(false)
    const [fileList, setFileList] = useState([])
    const [houseInfo, setHouseInfo] = useState({
        // 临时图片地址
        tempSlides: [],
        // 小区的名称和id
        community: { name: '', id: '' },
        // 价格
        price: '',
        // 面积
        size: '',
        // 房屋类型
        roomType: '',
        // 楼层
        floor: '',
        // 朝向：
        oriented: '',
        // 房屋标题
        title: '',
        // 房屋图片
        houseImg: '',
        // 房屋配套：
        supporting: '',
        // 房屋描述
        description: ''
    })


    useEffect(() => {
        // 有小区信息数据，存储到状态中
        if (location.state) {
            // 有小区信息数据，存储到状态中
            setHouseInfo({
                ...houseInfo,
                community: {
                    name: location.state.name,
                    id: location.state.id
                }
            })
        }
    }, [])

    const handleSelect = (selected) => {
        setHouseInfo({ ...houseInfo, supporting: selected.join('|') })
    }

    const handleHouseImg = async (items) => {
        setFileList(items)
        if (houseInfo.tempSlides.length > 0) {
            const form = new FormData()
            houseInfo.tempSlides.forEach((item) => form.append('file', item))
            const res = await API.post('/houses/image', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setHouseInfo({ ...houseInfo, houseImg: res.data.body.join('|') })
        }
    }

    const handleUpload = async (file) => {
        const newTempSlides = [...houseInfo.tempSlides]
        newTempSlides.push(file)
        setHouseInfo({ ...houseInfo, tempSlides: newTempSlides })
        return {
            url: URL.createObjectURL(file),
        }
    }

    const handleDelete = (item) => {
        let index = fileList.indexOf(item)
        const newTempSlides = [...houseInfo.tempSlides]
        newTempSlides.splice(index, 1)
        setHouseInfo({ ...houseInfo, tempSlides: newTempSlides })
        return true
    }

    const addHouse = async () => {
        
        
        const {title, description, oriented, supporting, price, roomType, size, floor, houseImg} = houseInfo
        if(size&&price&&houseInfo.community&&isSend===false){
            setIsSend(true)
            const newHouseInfo = {
            title,
            description,
            oriented,
            supporting,
            price,
            roomType,
            size,
            floor,
            houseImg,
            community: houseInfo.community.id
        }
        const res = await API.post('/user/houses',newHouseInfo)
        if(res.data.status === 200){
            setIsSend(false)
            Toast.show({
                content:'发布成功'
            })
            navigate('/rent')
        }else{
            setIsSend(false)
            Toast.show({
                content:"服务器偷懒了,请稍后再试~"
            })
        }
        }else if(isSend === true){
            Toast.show({
                content:'正在发送请求...,请等待'
            })
        }else{
            Toast.show({
                content:'至少填写小区名称，租金，建筑面积'
            })
        }
        
        
    }

    return (
        <div className={styles.root}>
            <NavBar onBack={() => navigate(-1)}>发布房源</NavBar>
            <List header='房源信息' className={styles.header}>
                <List.Item extra={houseInfo.community.name || '请输入小区名称'} onClick={() => navigate('/rent/search')}>
                    小区名称
                </List.Item>
                <List.Item extra={
                    <div className={styles.price}><Input
                        type='number'
                        placeholder='请输入租金/月'
                        value={houseInfo.price}
                        onChange={(val) => setHouseInfo({ ...houseInfo, price: val })}
                    >
                    </Input>
                        <div>￥/月</div>
                    </div>
                }>
                    <span>租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金</span>
                </List.Item>
                <List.Item extra={
                    <div className={styles.square}>
                        <Input
                            type='number'
                            placeholder='请输入建筑面积'
                            value={houseInfo.size}
                            onChange={(val) => setHouseInfo({ ...houseInfo, size: val })}
                        />
                        ㎡
                    </div>

                }>
                    <span>建筑面积</span>

                </List.Item>
                <List.Item
                    extra={roomTypeData.find((item) => item.value === houseInfo.roomType)?.label || '请选择'}
                    onClick={() => setVisible1(true)}
                    arrow
                >
                    <span>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型</span>
                    <CascadePicker
                        options={roomTypeData}
                        visible={visible1}
                        onClose={() => {
                            setVisible1(false)
                        }}
                        onConfirm={(val) => {
                            setHouseInfo({ ...houseInfo, roomType: val[0] })
                        }}
                    />
                </List.Item>
                <List.Item
                    extra={floorData.find((item) => item.value === houseInfo.floor)?.label || '请选择'}
                    onClick={() => setVisible2(true)}
                    arrow
                >
                    <span>所在楼层</span>
                    <CascadePicker
                        options={floorData}
                        visible={visible2}
                        onClose={() => {
                            setVisible2(false)
                        }}
                        onConfirm={(val) => {
                            setHouseInfo({ ...houseInfo, floor: val[0] })
                        }}
                    />
                </List.Item>
                <List.Item
                    extra={orientedData.find((item) => item.value === houseInfo.oriented)?.label || '请选择'}
                    onClick={() => setVisible3(true)}
                    arrow
                >
                    <span>朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向</span>
                    <CascadePicker
                        options={orientedData}
                        visible={visible3}
                        onClose={() => {
                            setVisible3(false)
                        }}
                        onConfirm={(val) => {
                            setHouseInfo({ ...houseInfo, oriented: val[0] })
                        }}
                    />
                </List.Item>
            </List>

            <List header='房屋标题'>
                <List.Item>
                    <Input
                        placeholder='请输入标题（例如：整租 小区名 2室 5000元）'
                        value={houseInfo.title}
                        onChange={(val) => setHouseInfo({ ...houseInfo, title: val })}
                    />
                </List.Item>
            </List>

            <List header='房屋图像'>
                <List.Item>
                    <ImageUploader
                        value={fileList}
                        onChange={handleHouseImg}
                        upload={handleUpload}
                        onDelete={handleDelete}
                    />
                </List.Item>
            </List>

            <List header='房屋配置'>
                <List.Item>
                    <HousePackage select onSelect={handleSelect} />
                </List.Item>
            </List>

            <List header='房屋描述'>
                <List.Item>
                    <TextArea
                        placeholder='请输入房屋描述信息'
                        value={houseInfo.description}
                        onChange={(val) => setHouseInfo({ ...houseInfo, description: val })}
                        rows={5}
                        showCount
                        maxLength={30}
                    />
                </List.Item>
            </List>

            <div className={styles.bottom}>
                <div className={styles.cancel}>
                    取消
                </div>
                <div className={styles.confirm} onClick={addHouse}>
                    提交
                </div>
            </div>

        </div>
    )
}

export default add