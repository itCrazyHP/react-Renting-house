import React from 'react'
import { useLocation,Navigate } from 'react-router-dom'
import { getToken } from '../../utils/auth'

const index = (props) => {
    const location = useLocation()
  return (
    getToken()?props.children:<Navigate to={"/Login"} replace state={location.pathname}/>
  )
}

export default index