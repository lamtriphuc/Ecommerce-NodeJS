const Product = require('../models/ProductModel');

const createProduct = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            // const checkUser = await User.findOne({
            //     email: email
            // })
            // if (checkUser !== null) {
            //     resolve({
            //         status: 'OK',
            //         message: 'The email is already'
            //     })
            // }
            // const hash = bcrypt.hashSync(password, 10);
            // const createdUser = await User.create({
            //     name,
            //     email,
            //     password: hash,
            //     phone
            // });
            // if (createUser) {
            //     resolve({
            //         status: 'OK',
            //         message: 'User created successfully',
            //         data: createdUser
            //     })
            // }
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    createProduct
}