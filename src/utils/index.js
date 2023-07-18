import axios from "axios";

export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
    if (!localCity) {
        return new Promise((resolve, reject) => {
            const curCity = new BMapGL.LocalCity();
            curCity.get(//百度地图的方法，用于获取当前城市名称.返回的res中有属性name即名称
                async res => {
                try {
                    const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
                    resolve(result.data.body)
                } catch (e) {
                    reject(e)
                }

            })

        })


    }
    return Promise.resolve(localCity)

}