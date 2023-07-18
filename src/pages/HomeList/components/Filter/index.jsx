import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import FilterMore from '../FilterMore'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import { API } from '../../../../utils/api'
import { useSpring, animated, Spring, useSpringRef, useTransition } from 'react-spring'
import { Mask } from 'antd-mobile'

const titleSelectedStatus = {
    area: false,
    mode: false,
    price: false,
    more: false,
}
const picker = ['area', 'mode', 'price'] //遮罩层和筛选显示

const selectedVal = {//筛选默认选中项
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],
    more: []
}

const index = ({ onFilter }) => {
    const [isSelected, setIsSelected] = useState(titleSelectedStatus)//{area: false, mode: false, price: false, more: false}
    const [openType, setOpenType] = useState()//'area' 'mode'这些名字
    const [filterData, setFilterData] = useState({})
    const [selectedValues, setSelectedValues] = useState(selectedVal)//{area: ['area', 'null'],mode: ['null'], price: ['null'], more: []}
    const [show, setShow] = useState(false)

    useEffect(() => {
        getFilterData()
    }, [])
    const getFilterData = async () => {
        const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
        const res = await API.get(`/houses/condition?id=${value}`)
        setFilterData(res.data.body)
    }

    const onTitleClick = (type) => {
        const newStatus = { ...isSelected }//复制state对象
        Object.keys(titleSelectedStatus).forEach(key => {
            // key 表示数组中的每一项，此处，就是每个标题的 type 值。
            if (key === type) {
                // 当前标题
                newStatus[type] = true
                return
            }
            const selV = selectedValues[key].filter(item => item !== null)//把null从数组去掉

            if (key === 'area' && (selV.length !== 2 || selV[0] !== 'area')) {
                newStatus[key] = true
            } else if (key === 'mode' && selV[0] !== 'null') {
                newStatus[key] = true
            }
            else if (key === 'price' && selV[0] !== 'null') {
                newStatus[key] = true
            }
            else if (key === 'more' && selV.length > 0) {
                newStatus[key] = true
            }
            else {
                newStatus[key] = false
            }

        })

        setIsSelected(newStatus)
        setOpenType(type)
        setShow(true)
    }

    const onCancel = (type) => {

        const newStatus = { ...isSelected }
        const selV = selectedValues[type].filter(item => item !== null)
        if (type === 'area' && (selV.length !== 2 || selV[0] !== 'area')) {
            newStatus[type] = true
        } else if (type === 'mode' && selV[0] !== 'null') {
            newStatus[type] = true
        }
        else if (type === 'price' && selV[0] !== 'null') {
            newStatus[type] = true
        }
        else if (type === 'more' && selV.length > 0) {
            newStatus[type] = true
        }
        else {
            newStatus[type] = false
        }
        setIsSelected(newStatus)
        setOpenType('')
        setShow(false)
    }

    const onSave = (type, value) => {

        const newDefaultValue = { ...selectedValues }
        newDefaultValue[type] = value
        setSelectedValues(newDefaultValue)


        const { area, mode, price, more } = newDefaultValue
        const newArea = area.filter(item => item !== null)
        const filters = {}
        const areaKey = area[0]
        let areaValue
        if (newArea.length >= 3) {
            const length = newArea.length
            for (let i = length; i > 0; i--) {
                if (newArea[i - 1] !== 'null') {
                    areaValue = newArea[i - 1]
                    break
                }
            }
        }
        filters[areaKey] = areaValue
        filters.mode = mode[0]
        filters.price = price[0]
        filters.more = more.join(',')
        onFilter(filters)


        const newStatus = { ...isSelected }
        const selV = value.filter(item => item !== null)
        if (type === 'area' && (selV.length !== 2 || selV[0] !== 'area')) {
            newStatus[type] = true
        } else if (type === 'mode' && selV[0] !== 'null') {
            newStatus[type] = true
        }
        else if (type === 'price' && selV[0] !== 'null') {
            newStatus[type] = true
        }
        else if (type === 'more' && selV.length > 0) {
            newStatus[type] = true
        }
        else {
            newStatus[type] = false
        }
        setIsSelected(newStatus)


        setOpenType('')
    }

    const renderFilterPicker = () => {
        const { area, subway, rentType, price } = filterData
        let defaultValue = selectedValues[openType]
        let data = []
        switch (openType) {
            case 'area':
                data = [area, subway]
                break;
            case 'mode':
                data = rentType
                break;
            case 'price':
                data = price
                break;
            default:
                break;
        }

        //判断是否渲染
        return picker.includes(openType) ? <FilterPicker onPickerCancel={onCancel} key={openType} onPickerSave={onSave} data={data} type={openType} defaultValue={defaultValue} /> : null
    }

    const renderFilterMore = () => {
        const { roomType, oriented, floor, characteristic } = filterData

        const data = { roomType, oriented, floor, characteristic }
        let defaultValue = selectedValues[openType]


        if (openType !== 'more') {
            return
        }
        return <FilterMore data={data} onSave={onSave} type={openType} onCancel={onCancel} defaultValue={defaultValue} />
    }

    // const renderMask = () => {

    //     const spring = useSpring({
    //      opacity:show?1:0
    // })


    //     return <animated.div ref={maskRef} style={spring}>

    //          {spring.opacity.animation.to === 0?<div  className={styles.mask} onClick={() => onCancel(openType)} />:null} 
    //     </animated.div>

    // }

    // const [props, api] = useSpring(() => {
    //     return {
    //         opacity: show ? 1 : 0
    //     }
    // }, [show])

    const spring = useSpring({
             opacity:show?1:0
        })

    return (
        <div className={styles.root}>
            {/*  */}

            <animated.div style={spring}>
                {show && <div className={styles.mask} onClick={() => onCancel(openType)} />}
            </animated.div>

            

            <div className={styles.content}>
                <FilterTitle titleSelectedStatus={isSelected} onTitleClick={onTitleClick} />
                {renderFilterPicker()}
                {renderFilterMore()}
            </div>
        </div>
    )
}

export default index