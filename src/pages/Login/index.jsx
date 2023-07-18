import React, { useState } from 'react'
import { Input, NavBar, Button, Form, Toast } from 'antd-mobile'
import styles from './index.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'

const index = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [visible, setVisible] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async () => {
        const res = await API.post('/user/login', {
            username,
            password
        })
        if (res.data.status === 200) {
            localStorage.setItem('hkzf_token', res.data.body.token)
            console.log(location);
            navigate(location.state?location.state:-1,{replace:true})
        } else {
            Toast.show({
                icon: 'fail',
                content: '用户名或密码错误',
            })
        }
    }
    return (
        <div className={styles.root}>
            <NavBar onBack={() => navigate(-1)}>账号登陆</NavBar>

            <Form className={styles.form}
                onFinish={handleSubmit}
                footer={
                    <Button block type='submit' color='success' size='large'>
                        登录
                    </Button>
                }
            >
                <Form.Item
                    name='username'
                    rules={[
                        { required: true },
                        {
                            type: 'string',
                            min: 5,
                            max: 12,
                            pattern: /^[a-zA-Z\d]{5,12}$/,
                            message: '长度为5到12位，只能出现数字、字母'
                        }
                    ]}
                >
                    <div className={styles.user}>
                        <Input placeholder='请输入账号' clearable value={username.trim()} onChange={val => setUsername(val)} />
                    </div>
                </Form.Item>
                <Form.Item
                    name='password'
                    rules={[
                        { required: true },
                        {
                            type: 'string',
                            min: 5,
                            max: 12,
                            pattern: /^[\w.]{5,12}$/,
                            message: '长度为5到12位，只能出现数字、字母、下划线、点'
                        }
                    ]}
                >
                    <div className={styles.password}>
                        <Input
                            className={styles.input}
                            placeholder='请输入密码'
                            type={visible ? 'text' : 'password'}
                            value={password.trim()}
                            onChange={val => setPassword(val)}
                        />
                        <div className={styles.eye}>
                            {!visible ? (
                                <EyeInvisibleOutline onClick={() => setVisible(true)} />
                            ) : (
                                <EyeOutline onClick={() => setVisible(false)} />
                            )}
                        </div>
                    </div>
                </Form.Item>
            </Form>






            

            <div className={styles.register}>还没有账号, 去注册~</div>
        </div>
    )
}

export default index