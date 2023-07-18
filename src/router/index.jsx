// 缓存的组件不能懒加载
import Citylist from "@/pages/Citylist"
import Home from "@/pages/Home"
import Map from '@/pages/Map'
import { lazy } from "react"
import { Suspense } from "react"
import { BrowserRouter, useRoutes,Navigate } from "react-router-dom"
import AuthRouter from '../components/AuthRoute'
const HomeList = lazy(()=>import('@/pages/HomeList'))
const Index = lazy(()=>import('@/pages/Index'))
const Profile = lazy(()=>import('@/pages/Profile'))
const News = lazy(()=>import('@/pages/News'))
const HouseDetail = lazy(()=>import('@/pages/HouseDetail'))
const Login = lazy(()=>import('@/pages/Login'))
const Rent = lazy(()=>import('@/pages/Rent'))
const Favourite = lazy(()=>import('@/pages/Favourite'))
const Add = lazy(()=>import('@/pages/Rent/Add/add.jsx'))
const Search = lazy(()=>import('@/pages/Rent/Search/search.jsx'))
const GetRoutes = ()=>{
    const routes = useRoutes([
    {
        path:"/",
        element:<Navigate to='/home'/>
    },
    {
        path:"/citylist",
        element:<Citylist/>
    },
    {
        path:"/map",
        element:<Map/>
    },
    {
        path:"/detail/:id",
        element:<HouseDetail/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/favourite",
        element:<Favourite/>
    },
    {
        path:"/rent",
        element:<AuthRouter><Rent/></AuthRouter>,
    },
    {
        path:"/rent/add",
        element:<AuthRouter><Add/></AuthRouter>
    },
    {
        path:"/rent/search",
        element:<AuthRouter><Search/></AuthRouter>
    },
    {
        path:"/home",
        element:<Home/>,
        children:[
            {
                path:"/home",
                element:<Index/>
            },
            {
                path:"/home/news",
                element:<News/>
            },
            {
                path:"/home/profile",
                element:<Profile/>
            },
            {
                path:"/home/list",
                element:<HomeList/>
            },
        ]
    }
])
    return routes
}

const SetRoutes =()=>{
    return(
        
            <Suspense>
                <GetRoutes/>
            </Suspense>
        
    )
}
export default SetRoutes