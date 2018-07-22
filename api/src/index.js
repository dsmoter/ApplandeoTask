import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

import User from './models/User';

dotenv.config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
});

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(bodyParser.json());

const isAuthenticated = (req, res, next) => {
    const authorizationHeader = req.get('Authorization');

    if (authorizationHeader) {
        const jwt = (authorizationHeader.split(" "))[1];
        if (jwt) {
            User.verifyToken(jwt, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        "status": "Wrong authorization token",
                        "type": "TOKERR"
                    });
                }
                return next();
            })
        } else {
            res.status(400).json({
                "status": "Wrong authorization header.",
                "type": "TOKERR"
            })
        }
    } else {
        res.status(401).json({
            "status": "You are not logged in.",
            "type": "TOKERR"
        })
    }
    
}

app.post('/api/validate', (req, res) => {
    const userData = req.body;
    User.verifyToken(userData.token, (err, result) => {
        if (err) {
            return res.status(401).json({
                error: err
            });
        }

        return res.status(200).json({
            status: 'ok'
        });
    });
});

app.post('/api/auth', (req,res) => {
    const { credentials } = req.body;
    if (!credentials.email || !credentials.password) {
        return res.status(400).json({
            errors: {
                global: "No credentials provided."
            }
        })
    }
    User.findOne({
        email: credentials.email
    }).then(user => {
        if (user && user.checkPassword(credentials.password)) {
            res.json({ user: user.packForLogin() });
        } else {
            res.status(400).json({ errors: { global: "Invalid credentials" } });
        }
    })
});

app.post('/api/upload', isAuthenticated, (req, res) => {
    const form = new formidable.IncomingForm();
    const VALID_EXTENSIONS = ['pdf', 'jpg', 'png', 'gif'];
    const MAX_FILE_SIZE = 5242880;

    let isInvalidRequest;
    const response = {
        wrongFiles: [],
        error: ''
    };

    const validateFile = function (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase(),
              fileSize = file.size;

        if (!VALID_EXTENSIONS.includes(fileExtension) || fileSize > MAX_FILE_SIZE) {
            isInvalidRequest = true;
        }

    }

    form.on('file', (name, file) => {
        return validateFile(file);
    })

    form.parse(req, (err, fields, files) => {
        const uploadedFiles = Object.keys(files);
        if (uploadedFiles.length < 1 || uploadedFiles.length > 10 || isInvalidRequest) {
            // it's not an elegant solution, I know
            isInvalidRequest = true;
        }

        return Promise.all(
            uploadedFiles.map((elementIndex) => {
                const currentFile = files[elementIndex];
                const temp_path = currentFile.path; 
                const file_name = currentFile.name;
                const new_location = path.join(__dirname, 'img');

                return new Promise((resolve, reject) => {
                    fs.rename(temp_path, path.join(new_location, file_name), (err) => {  
                        if (err) {
                            response.wrongFiles.push(file_name)
                            response.error = "Cannot upload files: ";
                            reject();
                        }
                        resolve();
                    })
                })
         
            })
        ).then(() => {
            res.status(200).json({
                "status": "ok"
            })
        }).catch(e => {
            res.status(406).json(response)
        })
    });

})

app.listen(4001, () => console.log("Running on port 4001"));