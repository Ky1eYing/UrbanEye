import {Router} from 'express';
import {usersData} from '../data/index.js';
import * as check from "../utils/helpers.js";
import { ObjectId } from "mongodb";

const router = Router();

router
    .route('/')

    // .get(async (req, res) => {

    //     try {
    //     //   TODO
    //     return res.json({data: "data"});
    //     } catch (e) {
    //     return res.status(500).json({error: e});
    //     }

    // })

    // createUser
    .post(async (req, res) => {

        const reqBody = req.body;
        if (!reqBody || Object.keys(reqBody).length === 0) {
            return res.status(400).json({ error: "There are no fields in the request body" });
        }
  
        let { userName, name, password, introduction, sex, email, phone } = reqBody;
        
        try {
            userName = check.checkVaildString(userName, "UserName");
            name = check.checkVaildString(name, "Name");
            password = check.checkVaildString(password, "Password");
            introduction = check.validateIntroduction(introduction);
            sex = check.validateSex(sex);
            email = check.validateEmail(email);
            phone = check.validatePhone(phone);
        } 
        catch (e) {
            return res.status(400).json({ error: e.message });
        }
  
        try {
            const user = await usersData.createUser(userName, name, password, introduction, sex, email, phone);
            return res.status(200).json(usersData.filterUser(user));
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    });

router
    .route('/login')

    .post(async (req, res) => {

        const reqBody = req.body;
        if (!reqBody || Object.keys(reqBody).length === 0) {
            return res.status(400).json({ error: "There are no fields in the request body" });
        }
  
        let { userName, password } = reqBody;

        try {
            userName = check.checkVaildString(userName, "UserName");
            password = check.checkVaildString(password, "Password");
        }
        catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            const checkStatus = await usersData.userCheckWithPwdUserName(userName, password);
            if (!checkStatus) {
                return res.status(404).json({ error: "Wrong username or password!" });
            }
            else {
                return res.status(200).json({ message: "Login successfully!" });

                // TODO middleware login

            }
        } catch (e) {
            return res.status(500).json({ error: "Sorry, system authentication failed." });
        }
    });

router
    .route('/logout')

    .post(async (req, res) => {

        // TODO middleware logout
        return res.status(200).json({ message: "Logout successfully!" });

    });

router
    .route("/:userId")

    // getUser
    .get(async (req, res) => {
        let userId;
        try {
            userId = check.checkObjectId(req.params.userId);
        }
        catch (e) {
            return res.status(400).json({ error: e.message });
        }
        try {
            const user = await usersData.getUserByUserId(userId);
            return res.status(200).json(usersData.filterUser(user));
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    })

    // removeUser (need password)
    .delete(async (req, res) => {
        let userId;
        try {
            userId = check.checkObjectId(req.params.userId);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        const reqBody = req.body;
        if (!reqBody || Object.keys(reqBody).length === 0) {
            return res.status(400).json({ error: "There are no fields in the request body" });
        }
  
        let { password } = reqBody;

        try {
            password = check.checkVaildString(password, "Password");
        }
        catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            const checkStatus = await usersData.userCheckWithPwduserId(userId, password);
            if (!checkStatus) {
                return res.status(404).json({ error: "Wrong password!" });
            }
        } catch (e) {
            return res.status(500).json({ error: "Sorry, system authentication failed." });
        }

        try {
            const deleteInfo = await usersData.removeUser(userId);
            return res.status(200).json({ message: deleteInfo + "You will be logged out." });

            // TODO middleware logout

        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    })

    // updateUser userName or password (need originalPassword)
    .post(async (req, res) => {
        let userId;
        try {
            userId = check.checkObjectId(req.params.userId);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        const reqBody = req.body;
        if (!reqBody || Object.keys(reqBody).length === 0) {
            return res.status(400).json({ error: "There are no fields in the request body" });
        }

        let { userName, password, originalPassword } = reqBody;

        try {
            userName = check.checkStringAllowNull(userName, "UserName");
            password = check.checkStringAllowNull(password, "Password");
            originalPassword = check.checkVaildString(originalPassword, "Original Password");
        }
        catch (e) {
            return res.status(400).json({ error: e.message });
        }

        if (userName !== null && password !== null) {
            return res.status(400).json({ error: "Cannot update two fields at the same time" });
        }

        if (userName === null && password === null) {
            return res.status(400).json({ error: "There are no fields to update" });
        }

        try {
            const checkStatus = await usersData.userCheckWithPwduserId(userId, originalPassword);
            if (!checkStatus) {
                return res.status(404).json({ error: "Wrong password!" });
            }
        } catch (e) {
            return res.status(500).json({ error: "Sorry, system authentication failed." });
        }

        if (userName !== null) {
            try {
                await usersData.updateUserName(userId, userName);
                return res.status(200).json({ message: "Update successfully! You will be logged out." });
            } catch (e) {
                return res.status(404).json({ error: e.message });
            }
        }

        if (password !== null) {
            try {
                await usersData.updatePassword(userId, password);
                return res.status(200).json({ message: "Update successfully! You will be logged out." });
            } catch (e) {
                return res.status(404).json({ error: e.message });
            }
        }

        // TODO middleware logout
        
    })
    
    // updateUser general information
    .put(async (req, res) => {
        let userId;
        try {
            userId = check.checkObjectId(req.params.userId);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        const reqBody = req.body;
        if (!reqBody || Object.keys(reqBody).length === 0) {
            return res.status(400).json({ error: "There are no fields in the request body" });
        }
  
        let { name, introduction, sex, email, phone } = reqBody;
        
        try {
            // userName = check.checkVaildString(userName, "UserName");
            name = check.checkVaildString(name, "Name");
            // password = check.checkVaildString(password, "Password");
            introduction = check.validateIntroduction(introduction);
            sex = check.validateSex(sex);
            email = check.validateEmail(email);
            phone = check.validatePhone(phone);
        } 
        catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            const user = await usersData.updateUser(userId, name, introduction, sex, email, phone);
            return res.status(200).json(usersData.filterUser(user));
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    });

export default router;
