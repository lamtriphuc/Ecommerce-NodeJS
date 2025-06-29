import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import * as UserService from './services/UserService'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, updateUser } from './redux/slides/userSlide'
import axios from 'axios'
import Loading from './components/LoadingComponent/Loading'
// import { useQuery } from '@tanstack/react-query'

function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  // Vừa vào
  useEffect(() => {
    setIsLoading(true)
    const { decoded, storageData } = handleDecoded()
    if (!decoded?.id || !storageData) {
      setIsLoading(false) // nên dừng loading luôn
      return
    }
    handleGetDetailsUser(decoded?.id, storageData)
  }, [])

  const handleDecoded = () => {
    const raw = localStorage.getItem('access_token')
    if (!raw) return { decoded: null, storageData: null }

    try {
      const token = JSON.parse(raw)
      if (typeof token !== 'string') return { decoded: null, storageData: null }
      const decoded = jwtDecode(token)
      return { decoded, storageData: token }
    } catch (error) {
      console.error("Invalid token in storage", error)
      return { decoded: null, storageData: null }
    }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    let tokenRaw = localStorage.getItem("access_token")
    if (!tokenRaw || !isJsonString(tokenRaw)) return config

    const token = JSON.parse(tokenRaw)
    if (typeof token !== 'string') return config

    const decoded = jwtDecode(token)

    const currentTime = new Date()

    const storageRefreshToken = localStorage.getItem('refresh_token')
    let refreshToken = null
    let decodedRefreshToken = null

    if (storageRefreshToken && isJsonString(storageRefreshToken)) {
      refreshToken = JSON.parse(storageRefreshToken)
      if (typeof refreshToken === 'string') {
        decodedRefreshToken = jwtDecode(refreshToken)
      }
    }

    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken)
        const newAccessToken = data?.access_token
        localStorage.setItem("access_token", JSON.stringify(newAccessToken)) // ? có cần không
        config.headers['token'] = `Bearer ${newAccessToken}`
      } else {
        dispatch(resetUser())
      }
    } else {
      // Token còn hạn
      config.headers['token'] = `Bearer ${token}`
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const handleGetDetailsUser = async (id, token) => {
    // try {
    const storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }));
    setIsLoading(false)
    // } catch (error) { }
  }

  return (
    <div>
      {/* <Loading isLoading={isLoading}> */}
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const isCheckAuth = !route.isPrivate || user.isAdmin
            const Layout = route.isShowHeader ? DefaultComponent : React.Fragment
            return (
              < Route key={route.path} path={isCheckAuth ? route.path : undefined} element={
                <Layout>
                  <Page />
                </Layout>
              } />
            )
          })}
        </Routes>
      </Router>
      {/* </Loading> */}
    </div>
  )
}

export default App