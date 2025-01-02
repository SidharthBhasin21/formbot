const userModel = require('../models/userModel');
const dashboardModel = require('../models/dashboardModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async (req, res) => {
    try {
        let {email, username, password} = req.body;
        
    if (!email || !username || !password) {
        return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
    }

    const userExists = await userModel.findOne({email})
    if (userExists) {
        return res.status(400).json({
            status: 'error',
            message: 'User already exists, please login'});
    }
    bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'An error occurred while hashing password'
                });
            }else {
                const user = await userModel.create({
                    email,
                    username,
                    password: hash
                });
                const dashboard = await dashboardModel.create({
                    name: `${username}'s Dashboard`,
                    owner: user._id,
                    members: [
                        {
                            user: user._id,
                            permissions: "edit",
                        },
                    ],
                });
                user.dashboard = dashboard._id;
                await user.save();

                const token = generateToken(user);
                res.cookie("token", token)
                res.status(201).json({
                    status: 'success',
                    user,
                    token,
                    message: 'User created successfully'
                });
            }
        })
    })
    
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        });
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // console.log(req.body)

        if (!email || !password) {
            throw new Error('All fields are required');
        }
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });

        }
        bcrypt.compare(password,user.password, async(err,result)=>{
            
            if(result){
                const token = generateToken(user);
                res.cookie('token', token , {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    path: '/', 
                    domain: 'localhost'  
                });
                res.json({
                    user,
                    message: 'User logged in successfully',
                    token
                });
            } else {
                return res.status(401).json({message: 'Email or password incorrect'});
            }
        })

    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message});
    }
}
module.exports.logoutUser = async (req, res) => {
    try {
        res.cookie('token', '');
        return res.json({
            status: 'success',
            message: 'User logged out successfully'
        });
    } catch (error) {
        return res.redirect('/');
    }
}