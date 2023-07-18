import React from 'react'

import styles from './index.module.css'



const index = ({ cancelText = '取消',okText = '确定',onCancel,onOk,className,style}) => {
  return (
    <div style={style} className={[styles.root, className || ''].join(' ')}>
      {/* 取消按钮 */}
      <span
        className={[styles.btn, styles.cancel].join(' ')}
        onClick={onCancel}
      >
        {cancelText}
      </span>

      {/* 确定按钮 */}
      <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
        {okText}
      </span>
    </div>
  )
}

export default index
// function FilterFooter({
//   cancelText = '取消',
//   okText = '确定',
//   onCancel,
//   onOk,
//   className,
//   style
// }) {
//   return (
//     <Flex style={style} className={[styles.root, className || ''].join(' ')}>
//       {/* 取消按钮 */}
//       <span
//         className={[styles.btn, styles.cancel].join(' ')}
//         onClick={onCancel}
//       >
//         {cancelText}
//       </span>

//       {/* 确定按钮 */}
//       <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
//         {okText}
//       </span>
//     </Flex>
//   )
// }
