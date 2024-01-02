
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Asisten = require("../models/AsistenModel");
const Praktikan = require("../models/PraktikanModel");
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (user) => {
    return jwt.sign({ user: user }, process.env.SECRET_TOKEN);
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            let response = {
                error: "Email and password are required"
            }
            return res.status(400).json(response);
        }

        let user = null;

        const asisten = await Asisten.findOne({ where: { email: email } });
        const praktikan = await Praktikan.findOne({ where: { email: email } });
        let role
        if (asisten) {
            user = asisten;
            role ="asisten"
        } else if (praktikan) {
            user = praktikan;
            role ="praktikan"
        } else {
            let response = {
                error: "Email tidak terdaftar"
            }
            return res.status(404).json(response);
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Password salah" });
        }

        const token = generateToken(user);
        res.setHeader('authorization', token);

        const response = {
            token: token,
            message: "Login berhasil",
            user: user ,
            role:role
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



// JWT

const getProfile = async (req, res) => {
    try {
        let user_id = req.user.user.asisten_id ? req.user.user.asisten_id : req.user.user.praktikan_id;
        const asisten = await Asisten.findOne({ where: { asisten_id : user_id } });
        const praktikan = await Praktikan.findOne({ where: { praktikan_id : user_id } });

        if (!asisten) {
            if(!praktikan){
                return res.status(400).json({ message: "tidak ketemu = "+user_id });
            }

           return res.status(200).json( praktikan );
        }
        res.status(200).json(asisten);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "KACIAN ERROR" });
    }
};



const logout = async (req, res) => {
    const token = req.headers.authorization || req.body.token;
    console.log(token)
};


module.exports = {
    login,
    getProfile,
    logout,
};