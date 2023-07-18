import React, { useState } from 'react'
import styles from './index.module.css'
import FilterFooter from '../../../../components/FilterFooter/index'

const index = ({data,onSave,type,onCancel,defaultValue}) => {
  const {roomType,oriented,floor,characteristic} = data
  const [selectedValues,setSelectedValues] = useState(defaultValue)

  

  const onTagClick = (value)=>{
    const newSelectedValues = [...selectedValues]
    if(selectedValues.indexOf(value) === -1){
      newSelectedValues.push(value)
    }else{
      const index = selectedValues.indexOf(value)
      newSelectedValues.splice(index,1)
    }
    setSelectedValues(newSelectedValues)
  }

  const renderFilters=(type)=>{

   return  type.map(item => {
    const isSelected = selectedValues.indexOf(item.value)>-1
      return <span key={item['value']} className={[styles.tag,isSelected?styles.tagActive:''].join(' ')} onClick={()=>{onTagClick(item.value)}}>{item.label}</span>
    
   } )
     
  }

  const onOk = ()=>{
    onSave(type,selectedValues)
  }
  return (
    <div className={styles.root}>
      <div className={styles.mask} onClick={()=>{onCancel(type)}}/>
      <div className={styles.tags}>
        <dl className={styles.dl}>
          <dt className={styles.dt}>户型</dt>
          <dd className={styles.dd}>{renderFilters(roomType)}</dd>

          <dt className={styles.dt}>朝向</dt>
          <dd className={styles.dd}>{renderFilters(oriented)}</dd>

          <dt className={styles.dt}>楼层</dt>
          <dd className={styles.dd}>{renderFilters(floor)}</dd>

          <dt className={styles.dt}>房屋亮点</dt>
          <dd className={styles.dd}>{renderFilters(characteristic)}</dd>
        </dl>
        <FilterFooter className={styles.footer} cancelText={'清除'} onCancel={()=>{setSelectedValues([])}} onOk={onOk}/>
      </div>
    </div>
  )
}

export default index