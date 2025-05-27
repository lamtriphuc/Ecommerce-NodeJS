const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const generalAccessToken = async (payload) => {
    const access_token = jwt.sign(
        { ...payload },
        process.env.ACCESS_TOKEN,
        { expiresIn: '10s' }
    )
    return access_token
}

const generalRefreshToken = async (payload) => {
    const refresh_token = jwt.sign(
        { ...payload },
        process.env.REFRESH_TOKEN,
        { expiresIn: '1d' }
    )
    return refresh_token
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'Authemtication'
                    })
                }
                const access_token = await generalAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                resolve({
                    status: 'OK',
                    message: 'Success',
                    access_token
                })
            })
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJwtService
}