

const mongoose = require('mongoose');
const userModel = require("../models/userModel");

const jwt = require('jsonwebtoken');
const validation = require("../validation/validation");
const bcrypt = require('bcrypt');
// const admin = require('../models/adminModel');


const userRegister = async function (req, res) {
    try {
        let userData = req.body;

        let { name, email, password, confirmPassword } = userData;

        if (Object.keys(userData).length == 0)
            return res.status(400).send({ status: false, message: "please provide required fields" });


        if (!name)
            return res.status(400).send({ status: false, message: " name is mandatory" });

        if (typeof name != "string")
            return res.status(400).send({ status: false, message: " name should be in string" });

        // regex
        name = userData.name = name.trim();

        if (name == "")
            return res.status(400).send({ status: false, message: "Please Enter  name value" });


        //================================ email ======

        if (!email)
            return res.status(400).send({ status: false, message: "email is mandatory" });

        if (typeof email != "string")
            return res.status(400).send({ status: false, message: "email id  should be in string" });

        //=========== email =======

        email = userData.email = email.trim().toLowerCase()
        if (email == "")
            return res.status(400).send({ status: false, message: "Please enter email value" });

        if (!validation.validateEmail(email))
            return res.status(400).send({ status: false, message: "Please provide valid email id" });


        //========= password ======

        // if (!password)
        //     return res.status(400).send({ status: false, message: "password is mandatory" });

        // if (typeof password != "string")
        //     return res.status(400).send({ status: false, message: "please provide password in string " });

        // password = userData.password = password.trim();
        // if (password == "")
        //     return res.status(400).send({ status: false, message: "Please provide password value" });


        // //regex password
        // if (!validation.validatePassword(password))
        //     return res.status(400).send({ status: false, message: "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character" });

        // //Encrypting password
        // let hashing = bcrypt.hashSync(password, 10);
        // userData.password = hashing;

        if (!password)
            return res
                .status(400)
                .send({ status: false, message: "password is mandatory" });

        if (typeof password != "string")
            return res
                .status(400)
                .send({ status: false, message: "please provide password in string " });
        password = userData.password = password.trim();

        if (password == "")
            return res
                .status(400)
                .send({ status: false, message: "Please provide password value" });

        if (!validation.validatePassword(password))
            return res.status(400).send({
                status: false,
                message:
                    "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
            });

        //Encrypting password
        let hashingPassword = bcrypt.hashSync(password, 10);
        userData.password = hashingPassword;

        //___________________________________confirmPassword______________________________________

        if (!password)
            return res
                .status(400)
                .send({ status: false, message: "password is mandatory" });

        if (!confirmPassword)
            return res
                .status(400)
                .send({ status: false, message: "confirmPassword is mandatory" });

        if (typeof confirmPassword != "string")
            return res.status(400).send({
                status: false,
                message: "please provide confirmPassword in string ",
            });

        confirmPassword = userData.confirmPassword = confirmPassword.trim();

        if (confirmPassword == "")
            return res.status(400).send({
                status: false,
                message: "Please provide confirmPassword value",
            });

        if (!validation.validatePassword(confirmPassword))
            return res.status(400).send({
                status: false,
                message:
                    "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
            });

        let passwordCompare = await bcrypt.compare(
            confirmPassword, userData.password
        );
        console.log(passwordCompare);
        if (!passwordCompare)
            return res
                .status(404)
                .send({ status: false, message: "password doesn't match" });

        //Encrypting confirmpassword
        let hashingconfirmPassword = bcrypt.hashSync(password, 10);
        userData.confirmPassword = hashingconfirmPassword;

        const userExist = await userModel.findOne({ $or: [{ email: email }] });

        if (userExist) {
            if (userExist.email == email)
                return res.status(400).send({ status: false, message: "email id  already exist, send another email" });

        }

        const userCreated = await userModel.create(userData);

        return res.status(201).send({ status: true, message: "Your Account has been successfully Registered", data: userCreated });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ status: false, message: error.message });
    }
};


const userLogin = async function (req, res) {
    try {
        let data = req.body;
        let { email, password } = data;

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, message: "Please send data" });


        if (!email)
            return res.status(400).send({ status: false, message: "Please enter Emaill" });


        if (email != undefined && typeof email != "string")
            return res.status(400).send({ status: false, message: "Please enter Emaill in string format" });

        email = data.email = email.trim();
        if (email == "")
            return res.status(400).send({ status: false, message: "Please enter Email value" });

        if (!validation.validateEmail(email))
            return res.status(400).send({ status: false, message: "Please enter valid Email" });

        if (!password)
            return res.status(400).send({ status: false, message: "Please enter password" });

        if (password != undefined && typeof password != "string")
            return res.status(400).send({ status: false, message: "Please enter password in string format" });

        password = data.password = password.trim();

        if (password == "")
            return res.status(400).send({ status: false, message: "Please enter password" });

        if (!validation.validatePassword(password))
            return res.status(400).send({ status: false, message: "Please enter valid password" });

        //       

        let isUserExist = await userModel.findOne({ email: email })

        if (!isUserExist)
            return res.status(404).send({ status: false, message: "No user found with given Email", });

        let passwordCompare = await bcrypt.compare(password, isUserExist.password);

        if (!passwordCompare) return res.status(400).send({ status: false, message: "Please enter valid password" })

        let token = jwt.sign(
            { userId: isUserExist._id, exp: Math.floor(Date.now() / 1000) + 86000 },
            "NEHA"
        );

        let tokenInfo = { userId: isUserExist._id, token: token, email: email,name:isUserExist.name ,isDeleted:isUserExist.isDeleted,choosenPlan:isUserExist.choosenPlan,isPaidUser:isUserExist.isPaidUser};

        res.setHeader('x-api-key', token)

        return res.status(200).send({ status: true, message: "Login Successful", data: tokenInfo });

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};





module.exports = { userRegister, userLogin}