import React, { useEffect, useLayoutEffect, useState } from 'react'
import FilterFooter from '../../../../components/FilterFooter/index'
import { CascadePicker } from 'antd-mobile';
import styles from './index.module.css'

const index = ({onPickerCancel,onPickerSave,data,type,defaultValue}) => {
  const [value,setValue] = useState(defaultValue)
  const selectHandler=(v)=>{ 
    setValue(v)
  }
  return (
    <div className={styles.picker} key={type}>
      
      <CascadePicker
      className={styles.cascadePicker}
        options={data}
        visible={true}
        getContainer={null}
        value={value}
        onSelect={selectHandler}
      />
      
      <FilterFooter className={styles.footer} onCancel={()=>{onPickerCancel(type)}} onOk={()=>{onPickerSave(type,value)}}/>
    </div>
  )
}

export default index