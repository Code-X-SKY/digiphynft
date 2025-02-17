
const config = require('../config');
const authQueries = require('../services/authQueries');
const marketplaceQueries = require('../services/marketplaceQueries');
const CryptoJS = require("crypto-js");
var validator = require("email-validator");
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer')
var fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const { user } = require('../config');
var QRCode = require('qrcode');
var speakeasy = require("speakeasy");
const { Console } = require('console');
const adminQueries = require('../services/adminQueries');
const { json } = require('express');
const emailActivity = require('../controllers/emailActivity');
const mysql = require('mysql2');
const pool = mysql.createPool({ host: config.mysqlHost, user: config.user, password: config.password, database: config.database, port: config.mysqlPort });
// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();


function closeNFT(code) {
    try {
        var encoded = base64encode(code);
        for (let i = 0; i < 5; i++) {
            encoded = base64encode(reverse(encoded));
        }
        encoded = Buffer.from(encoded);
        let json = JSON.stringify(encoded);
        var data = base64encode(json);
        return {
            data: reverse(data)
        }
    } catch (e) {
        return {
            data: ''
        }
    }
}

function openNFT(code) {
    try {
        var json = base64decode(reverse(code));
        let bufferOriginal = Buffer.from(JSON.parse(json).data);
        var decode = base64decode(bufferOriginal.toString('utf8'));
        for (let i = 0; i < 5; i++) {
            decode = base64decode(reverse(decode));
        }
        return decode

    } catch (e) {
        return 'error!!'
    }
}

// Register new user
exports.register = async (db, req, res) => {
    console.log("in register");

    var full_name = req.body.full_name;
    var user_name = req.body.user_name;
    var email = req.body.email;
    var confirm_email = req.body.confirm_email;
    var password = req.body.password;
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var num2 = /[0123456789]+/;
    var address = req.body.address;
    var is_subscribed = req.body.is_subscribed;


    try {



        // if (!full_name) {
        //     return res.status(400).send({
        //         success: false,
        //         msg: "Full Name required "
        //     });
        // }
        // if (!user_name) {
        //     return res.status(400).send({
        //         success: false,
        //         msg: "User Name required "
        //     });
        // }
        if (!email) {
            return res.status(400).send({
                success: false,
                msg: "Email required "
            });
        }
        if (!validator.validate(email)) {
            return res.status(400).send({
                success: false,
                msg: "Email is not validate"
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                msg: "password required"
            });
        }

        // if (!confirm_email) {
        //     return res.status(400).send({
        //         success: false,
        //         msg: "Confirm email required"
        //     });
        // }


        // if (email !== confirm_email) {
        //     return res.status(400).send({
        //         success: false,
        //         msg: "email not match"
        //     });
        // }

        if (password.length < 8) {
            return res.status(400).send({
                success: false,
                msg: "password length should be 8 characters or more"
            });
        }

        if (!num2.test(password)) {
            return res.status(400).send({
                success: false,
                msg: "password should include one numeric character"
            });
        }

        if (!format.test(password)) {
            return res.status(400).send({
                success: false,
                msg: "password should include one special character"
            });
        }


        await db.query(authQueries.getUsersEmail, [email], async function (error, results) {


            await db.query(authQueries.getUsersUser, [user_name], async function (error, userresults) {


                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured",
                        error
                    });
                } else if (results.length > 0) {
                    if (email === results[0].email) {
                        return res.status(400).send({
                            success: false,
                            msg: "Email Already Registered! Try New Email."

                        });
                    }
                }
                else if (userresults.length > 0) {

                    return res.status(400).send({
                        success: false,
                        msg: "User Name Already Registered! Try New Username."

                    });

                }


                if (is_subscribed == 1) {

                    var sub = {
                        "email": email,
                        "ip": null,
                        "datetime": new Date()
                    }

                    await db.query(authQueries.addSubscriber, [sub])

                }

                const Token = jwt.sign({
                    email: req.body.email
                }, config.JWT_SECRET_KEY)

                // var transporter = nodemailer.createTransport({
                //     service: 'gmail',
                //     auth: {
                //       user: `bilal.espsofttech@gmail.com`,
                //       pass: `Bilal123#`
                //     }
                //   });

                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'support@digiphynft.com',
                        pass: 'DigiPhyNFT@123#'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                var mailOptions = {
                    from: 'support@digiphynft.com',
                    to: `${email}`,
                    subject: 'Please verify your DigiPhyNFT account',
                    html: `
                
        <table cellspacing="0" cellpadding="0" width="100%" class="digiphyemail" style=" max-width: 600px;margin: auto;font-family: Inter,sans-serif;font-size: 14px; background-image:url('https://digiphynft.shop/images/email/music.png');  background-size:cover;background-repeat:no-repeat ">
         <tbody>
            <tr>
               <td style="padding:25px 35px">
                  <a href="#" style="display:inline-block;margin:0 15px" target="_blank" ><img src="https://digiphynft.shop/images/email/logo.png" width="150" class="CToWUd" data-bit="iit"></a>
                
                  <span style="margin-top:30px;width:100%;display:block;height:1px;background-image: url('https://digiphynft.shop/images/email/bgbtn.jpg');background-size:cover;background-repeat:no-repeat;backend-position:center;"></span>
               </td>
            </tr>
            <tr>
               <td style="padding:15px 36px" align="left">
                  <p style="margin:0 0 20px;color:#fff;line-height:28px;font-size:16px">Hello,</p>

                  <p style="margin:0 0 20px;color:#fff;line-height:28px;font-size:16px;word-wrap:break-word">Greetings from DigiPhyNFT.</p>

                  <p style="margin:0 0 20px;color:#fff;line-height:28px;font-size:16px;word-wrap:break-word">We have received a request to login using email address ${email} on DigiPhyNFT.</p>

                  <p style="margin:0 0 20px;color:#fff;line-height:28px;font-size:16px;word-wrap:break-word">If you did not make this request, you can safely ignore this email.</p>
                   
               </td>
            </tr>
         
            <tr>
               <td style="padding:15px 36px" align="left">
                  <p style="margin-top:30px;color:#fff;line-height:25px;font-size:16px;font-weight:400;text-align:justify">Best Regrads,<br>
                  Team DigiPhyNFT</p>
               </td>
            </tr>

            <tr>
            <td style="padding:15px" align="center">
            <a href='${config.mailUrl}verifyAccount/${Token}' style="display:inline-block;font-size:16px;width:60%;padding:16px 0;background-image:url('https://digiphynft.shop/images/email/bgsmall.jpg');background-size:cover;background-repeat:no-repeat;backend-position:center; border-radius:10px;color:#fff;text-decoration:none" target="_blank" >Verify Now</a>
            </td>
         </tr>

            <tr>
               <td style="padding:20px 15px" align="center">
                  <a href="https://www.facebook.com/DigiPhyNFT" style="display:inline-block;margin:0 15px" target="_blank">
                  <img src="https://digiphynft.shop/images/email/facebook.png" width="34" class="CToWUd" data-bit="iit">
                  <a href="https://twitter.com/DigiPhyNFT" style="display:inline-block;margin:0 15px" target="_blank" >
                  <img src="https://digiphynft.shop/images/email/twitter.png" width="34" class="CToWUd" data-bit="iit">
                  </a>
                  <a href="https://www.instagram.com/DigiPhyNFT/" style="display:inline-block;margin:0 15px" target="_blank" >
                  <img src="https://digiphynft.shop/images/email/instagram.png" width="34" class="CToWUd" data-bit="iit">
                  </a>
                  <a href="https://discord.com/invite/GuymFFY2NF" style="display:inline-block;margin:0 15px" target="_blank" >
                  <img src="https://digiphynft.shop/images/email/discord.png" width="34" class="CToWUd" data-bit="iit">
                  </a>
                  <a href="https://www.reddit.com/r/DigiPhyNFT/" style="display:inline-block;margin:0 15px" target="_blank">
                  <img src="https://digiphynft.shop/images/email/reddit.png" width="34" class="CToWUd" data-bit="iit">
                  </a>
                  <a href="https://www.linkedin.com/company/DigiPhyNFT/" style="display:inline-block;margin:0 15px" target="_blank">
                  <img src="https://digiphynft.shop/images/email/linkedin.png" width="34" class="CToWUd" data-bit="iit">
                  </a>
                  
                  
                  
                  </a>
                  <a href="https://www.youtube.com/channel/UC878bT4K6sZqjqKarlZa8Qw
                  " style="display:inline-block;margin:0 15px" target="_blank" >
                  <img src="https://digiphynft.shop/images/email/youtube.png" width="34" class="CToWUd" data-bit="iit">
                  </a>
       
               </td>
            </tr>
            <tr>
               <td style="background:#19132a;padding:15px" align="center">
                  <p style="margin:0;color:#fff">Please reach out to <a href="#" style="text-decoration:none;color:#e33f84" target="_blank">help@digiphynft.com</a> for any queries</p>
                  <font color="#888888">
                  </font>
               </td>
            </tr>
         </tbody>
      </table>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                var secret = speakeasy.generateSecret({ length: 20 });

                QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {

                    // const hash = bcrypt.hashSync(password, 8);
                    const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
                    //     console.log('hash',hash);
                    var users = {
                        "full_name": full_name,
                        "user_name": user_name,
                        "email": email,
                        "password": hash,
                        "is_email_verify": 0,
                        "googleAuthCode": secret.base32,
                        "QR_code": data_url,
                        "deactivate_account": 0,
                        "address": address,
                        "is_subscribed": is_subscribed
                    }
                    db.query(authQueries.insertUserData, users, async function (error, result) {
                        if (error) {
                            return res.status(400).send({
                                success: false,
                                msg: "error occured",
                                error
                            });
                        }
                        // const response1 = await fetch(config.walletApiUrl, {
                        //     method: 'GET', headers: {
                        //         'Accept': 'application/json',
                        //         'Content-Type': 'application/json'
                        //     }
                        // });
                        // const data1 = await response1.json();
                        // console.log(data1);
                        // if (!data1?.wallet?.private) {
                        //     return res.status(400).send({
                        //         success: false,
                        //         msg: "error occured in wallet creation",
                        //         error
                        //     });
                        // }

                        // var insertData = {
                        //     "user_id": result.insertId,
                        //     "coin_id": 1,
                        //     "public": data1.wallet.address,
                        //     "private": data1.wallet.private
                        // }
                        // await db.query(adminQueries.createUserWallet, [insertData], async function (error, data) {
                        //     if (error) {
                        //         return res.status(400).send({
                        //             success: false,
                        //             msg: "error occured",
                        //             error
                        //         });
                        //     }
                        // })

                        return res.status(200).send({
                            success: true,
                            msg: "Email has been sent, kindly activate your account"
                        });
                    });
                });
            });
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "user not registered due to internal error"
        });
    }
}

exports.activateAccount = async (db, req, res) => {
    console.log("in activateAccount");
    var token = req.params;
    //console.log(token)
    if (token) {
        jwt.verify(token.token, config.JWT_SECRET_KEY, async function (err, decodedToken) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    msg: "Incorrect or Expired Link"
                });
            }
            //  console.log('decode',decodedToken.email); 


            await db.query(authQueries.updateStatus, [decodedToken.email], function (err, data) {
                if (err) throw err;


            });
            return res.status(200).send({
                success: true,
                msg: "Account Successfully Verified"
            });
        })
    } else {
        return res.status(400).send({
            success: false,
            msg: "something went wrong"
        });
    }
}

exports.forgot = async (db, req, res) => {
    console.log("in forgot");

    var email = req.body.email;
    try {

        if (email == '') {
            return res.status(400).send({
                success: false,
                msg: "Email required "
            });
        }
        if (!validator.validate(email)) {
            return res.status(400).send({
                success: false,
                msg: "Email is not validate"
            });
        }


        await db.query(authQueries.getUsersEmail, [email], async function (error, results) {


            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });

            }
            else if (results.length > 0) {
                const Token = jwt.sign({
                    email: req.body.email
                }, config.JWT_SECRET_KEY)

                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'support@digiphynft.com',
                        pass: 'DigiPhyNFT@123#'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                //   var transporter = nodemailer.createTransport({
                //       service: 'gmail',
                //       auth: {
                //          user: `bilal.espsofttech@gmail.com`,
                //          pass: `Bilal123#`
                //       }
                //     });

                var mailOptions = {
                    from: 'support@digiphynft.com',
                    // from : "bilal.espsofttech@gmail.com",
                    to: `${email}`,
                    subject: 'Reset Password Link',
                    html: `
                    <table cellspacing="0" cellpadding="0" width="100%" class="digiphyemail" style=" max-width: 600px;margin: auto;font-family: Inter,sans-serif;font-size: 14px; background-image:url('https://digiphynft.shop/images/email/music.png');  background-size:cover;background-repeat:no-repeat ">
                    <tbody>
                       <tr>
                          <td style="padding:25px 35px">
                             <a href="#" style="display:inline-block;margin:0 15px" target="_blank" ><img src="https://digiphynft.shop/images/email/logo.png" width="150" class="CToWUd" data-bit="iit"></a>
                           
                             <span style="margin-top:30px;width:100%;display:block;height:1px;background-image: url('https://digiphynft.shop/images/email/bgbtn.jpg');background-size:cover;background-repeat:no-repeat;backend-position:center;"></span>
                          </td>
                       </tr>
                       <tr>
                          <td style="padding:15px 36px" align="left">
                             <p style="margin:0 0 30px;color:#fff;line-height:28px;font-size:16px">Dear ,${results[0].full_name}</p>
                             <p style="margin:0px;color:#fff;line-height:28px;font-size:16px;word-wrap:break-word">We're delighted to have you on board. Digiphy is the "India's Most memorable NFT Marketplace".Digiphy engages Specialists to fabricate fan networks and empowers fans to assume a part to supercharge development of Craftsmen by purchasing NFTs and assist them with catching additional worth from their work. These NFTs allow the fans an opportunity to be essential for a selective local area with the Craftsman and get unique honors and procure royalty*, exceptional honors like early admittance to restrictive in the background content, meet-n-welcome open doors, behind the stage admittance to shows and so on to reinforce direct commitment and unwaveringness with fans.</p>
                          </td>
                       </tr>
                       <tr>
                          <td style="padding:15px" align="center">
                          <a href='${config.mailUrl}resetpassword/${Token}' style="display:inline-block;font-size:16px;width:60%;padding:16px 0;background-image:url('https://digiphynft.shop/images/email/bgsmall.jpg');background-size:cover;background-repeat:no-repeat;backend-position:center; border-radius:10px;color:#fff;text-decoration:none" target="_blank" >Please click here to Reset your Password</a>
                          </td>
                       </tr>
                       <tr>
                          <td style="padding:15px 36px" align="left">
                             <p style="margin-top:30px;color:#fff;line-height:25px;font-size:16px;font-weight:400;text-align:justify">Regards,<br>Team DigiPhyNFT</p>
                          </td>
                       </tr>
                       <tr>
                          <td style="padding:20px 15px" align="center">
                             <a href="https://www.facebook.com/DigiPhyNFT" style="display:inline-block;margin:0 15px" target="_blank">
                             <img src="https://digiphynft.shop/images/email/facebook.png" width="34" class="CToWUd" data-bit="iit">
                             <a href="https://twitter.com/DigiPhyNFT" style="display:inline-block;margin:0 15px" target="_blank" >
                             <img src="https://digiphynft.shop/images/email/twitter.png" width="34" class="CToWUd" data-bit="iit">
                             </a>
                             <a href="https://www.instagram.com/DigiPhyNFT/" style="display:inline-block;margin:0 15px" target="_blank" >
                             <img src="https://digiphynft.shop/images/email/instagram.png" width="34" class="CToWUd" data-bit="iit">
                             </a>
                             <a href="https://discord.com/invite/GuymFFY2NF" style="display:inline-block;margin:0 15px" target="_blank" >
                             <img src="https://digiphynft.shop/images/email/discord.png" width="34" class="CToWUd" data-bit="iit">
                             </a>
                             <a href="https://www.reddit.com/r/DigiPhyNFT/" style="display:inline-block;margin:0 15px" target="_blank">
                             <img src="https://digiphynft.shop/images/email/reddit.png" width="34" class="CToWUd" data-bit="iit">
                             </a>
                             <a href="https://www.linkedin.com/company/DigiPhyNFT/" style="display:inline-block;margin:0 15px" target="_blank">
                             <img src="https://digiphynft.shop/images/email/linkedin.png" width="34" class="CToWUd" data-bit="iit">
                             </a>
                             
                             
                             
                             </a>
                             <a href="https://www.youtube.com/channel/UC878bT4K6sZqjqKarlZa8Qw
                             " style="display:inline-block;margin:0 15px" target="_blank" >
                             <img src="https://digiphynft.shop/images/email/youtube.png" width="34" class="CToWUd" data-bit="iit">
                             </a>
                  
                          </td>
                       </tr>
                       <tr>
                          <td style="background:#19132a;padding:15px" align="center">
                             <p style="margin:0;color:#fff">Please reach out to <a href="#" style="text-decoration:none;color:#e33f84" target="_blank">help@digiphynft.com</a> for any queries</p>
                             <font color="#888888">
                             </font>
                          </td>
                       </tr>
                    </tbody>
                 </table>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });


                return res.status(200).send({
                    success: true,
                    msg: "Check your email for a link to reset your password"
                });

            }
            else {
                return res.status(400).send({
                    success: false,
                    msg: "Email Not in Database."

                });
            }


        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: "user not registered due to internal error"
        });
    }
}


{/* <div style="background-color:#f4f4f4">
       <div>
          <div style="margin:0px auto;max-width:800px">
             <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
                <tbody>
                   <tr>
                      <td style="direction:ltr;font-size:0px;padding:10px 0px;text-align:center">
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
      <div style="background:black;background-color:black;margin:0px auto;border-radius:5px;max-width:800px">
         <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
            <tbody>
               <tr>
                  <td style="direction:ltr;font-size:0px;padding:8px 0;text-align:center">
                     <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                        <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                           <tbody>
                              <tr>
                                 <td align="center" style="font-size:0px;padding:0px 25px 0px 25px;word-break:break-word">
                                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px">
                                       <tbody>
                                          <tr>
                                             <td style="width:126px">
                                                <img height="auto" src="https://digiphynft.shop/backend/uploads/image-1656053820251.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="150" class="CToWUd">
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
          <div style="height:20px">
             &nbsp;
          </div>
          <div style="background:#fff;margin:0px auto;border-radius:5px;max-width:800px">
             <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
                <tbody>
                   <tr>
                      <td style="direction:ltr;font-size:0px;padding:0px;text-align:center">
                         <div style="margin:0px auto;max-width:800px">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
                               <tbody>
                                  <tr>
                                     <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
                                        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                           <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                <tbody>
                   <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1;text-align:left;color:#000"><b>Dear ${results[0].full_name}</b></div>
                      </td>
                   </tr>
                   <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                         <h4>Please <a href='${config.mailUrl}resetpassword/${Token}'>click here </a>  to Reset  your Password</h4>
                         
           
                         </div>
                      </td>
                   </tr>
                   <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                           Thanks <br>
                           DigiPhyNFT Team
                         </div>
                      </td>
                   </tr>
                   
                </tbody>
               </table>
                                        </div>
                                     </td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table
          </div>
          <div style="height:20px">
             &nbsp;
          </div>
          <div style="background:#000;background-color:#000;margin:0px auto;border-radius:5px;max-width:800px">
             <font color="#888888">
                   </font><font color="#888888">
                </font><font color="#888888">
             </font><table align="center" border="0" cellpadding="0" cellspacing="0" style="background:#000;background-color:#000;width:100%;border-radius:5px">
                <tbody>
                   <tr>
                      <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
                         <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                            <font color="#888888">
                                  </font><font color="#888888">
                               </font><font color="#888888">
                            </font><table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                               <tbody>
                                  <tr>
                                     <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
                                        <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:left;color:#fff"><b>DigiPhyNFT Team

                                        </b></div>
                                     </td>
                                     <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
                                        <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:right;color:#fff"><b style="color:white"><a href="mailto:support@DigiPhyNFT.io" target="_blank">support@DigiPhyNFT.io</a></b></div><font color="#888888">
                                     </font></td></tr></tbody></table><font color="#888888">
                         </font></div><font color="#888888">
                      </font></td></tr></tbody></table><font color="#888888">
          </font></div><font color="#888888">
       </font></div><font color="#888888">
    </font></div> */}


exports.Resetpassword = async (db, req, res) => {
    console.log("in Resetpassword");
    var token = req.params;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var num2 = /[0123456789]+/;

    if (!num2.test(password)) {
        return res.status(400).send({
            success: false,
            msg: "password should include one numeric character"
        });
    }

    if (!format.test(password)) {
        return res.status(400).send({
            success: false,
            msg: "password should include one special character"
        });
    }

    if (password == '') {
        return res.status(200).send({
            success: false,
            msg: "password required"
        });
    }
    if (password2 == '') {
        return res.status(200).send({
            success: false,
            msg: "Confirm  password required"
        });
    }

    if (password.length < 6) {
        return res.status(200).send({
            success: false,
            msg: "password length should be 8 characters or more"
        });
    }

    if (password !== password2) {
        return res.status(200).send({
            success: false,
            msg: "password not match"
        });
    }
    if (token) {
        jwt.verify(token.token, config.JWT_SECRET_KEY, async function (err, decodedToken) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    msg: "Incorrect or Expired Link"
                });
            }
            //console.log('decode', decodedToken.email);
            const hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

            await db.query(authQueries.updatepassword, [hash, decodedToken.email], function (err, data) {
                if (err) throw err;


            });
            emailActivity.Activity(email, 'Password Changed', `Your password changed successfully, You can login now.`);

            return res.status(200).send({
                success: true,
                msg: "Your password changed successfully, You can login now."
            });
        })
    } else {
        return res.status(400).send({
            success: false,
            msg: "something went wrong"
        });
    }
}



exports.getCountry = async (db, req, res) => {
    console.log("in getCountry");
    try {
        db.query(authQueries.getCountry, function (error, result) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
            if (result.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "Country Details",
                    response: result
                })
            } else {
                return res.status(400).send({
                    success: false,
                    msg: "No Data"
                })
            }
        })

    } catch (err) {
        // console.log(err)
        return res.status(400).send({
            success: false,
            msg: "unexpected internal error",
            err
        });
    }

}






exports.getProfilePic = async (db, req, res) => {

    console.log("in getProfilePic");
    var email = req.body.email;

    try {
        await db.query(authQueries.getProfile, [email], function (error, data) {

            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "Profile Pic",
                    response: data[0]
                });
            } else {
                return res.status(204).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(204).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}

exports.changePassword = async (db, req, res) => {
    console.log("in changePassword");
    var email = req.body.email;
    var currentPassword = req.body.currentPassword;
    var password = req.body.password;
    var password2 = req.body.password2;
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var num2 = /[0123456789]+/;


    try {
        if (!num2.test(password)) {
            return res.status(400).send({
                success: false,
                msg: "password should include one numeric character"
            });
        }

        if (!format.test(password)) {
            return res.status(400).send({
                success: false,
                msg: "password should include one special character"
            });
        }


        if (currentPassword == '') {
            return res.status(200).send({
                success: false,
                msg: "Current Password required "
            });
        }

        if (password == '') {
            return res.status(200).send({
                success: false,
                msg: "New Password required "
            });
        }
        if (password2 == '') {
            return res.status(200).send({
                success: false,
                msg: "Re-Type Password required "
            });
        }
        if (password != password2) {
            return res.status(200).send({
                success: false,
                msg: "New Password and Re-type Password not Match"
            });
        }

        db.query(authQueries.getPassword, [email], function (error, result) {

            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
            // console.log('result',result[0].password);
            const hashpassword = CryptoJS.SHA256(currentPassword).toString(CryptoJS.enc.Hex);


            if (result[0].password == hashpassword) {

                const newpassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

                db.query(authQueries.updatepassword, [newpassword, email], function (error, result) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "error occured",
                            error
                        });
                    }

                    emailActivity.Activity(email, 'Password Changed', `Your password changed successfully, You can login now.`);
                    if (result) {

                        return res.status(200).send({
                            success: true,
                            msg: "Password Changed Successfully"
                        })
                    } else {
                        return res.status(400).send({
                            success: false,
                            msg: "Password Changed Failed due to Error"
                        })
                    }
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "Current Password Wrong"
                })

            }
        });
    }
    catch (err) {
        //  console.log(err)
        return res.status(400).send({
            success: false,
            msg: "unexpected internal error",
            err
        });
    }

}




exports.updateProfilePic = async (db, req, res) => {
    console.log("in updateProfilePic");
    var full_name = req.body.full_name;
    var email = req.body.email;
    var user_name = req.body.user_name;
    var profile_pic = (!req.files['profile_pic']) ? null : req.files['profile_pic'][0].filename;
    var banner = (!req.files['banner']) ? null : req.files['banner'][0].filename;


    db.query(authQueries.getProfile, [email], function (error, result1) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        db.query(authQueries.checkUserName, [user_name, email], function (error, checkUserName) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured!",
                    error
                });
            }
            if (checkUserName.length > 0) {
                return res.status(400).send({
                    success: false,
                    msg: "User name already exists!"
                });
            }

            if (!profile_pic) {
                profile_pic = result1[0].profile_pic;
            }
            if (!banner) {
                banner = result1[0].banner;
            }


            db.query(authQueries.updateProfile, [full_name, email, profile_pic, banner, user_name, email], function (error, result) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured!",
                        error
                    });
                }
                if (result) {
                    res.status(200).send({
                        success: true,
                        msg: "Update Profile Successfully",
                    });
                } else {
                    res.status(200).send({
                        success: true,
                        msg: "update Profile Failed",
                    });
                }
            })
        });
    });
}



exports.getAboutDetail = async (db, req, res) => {
    console.log("in getAboutDetail");
    var email = req.body.email;

    await db.query(authQueries.aboutDetail, [email], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "About Details",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}


exports.updateAboutDetail = async (db, req, res) => {
    console.log("in updateAboutDetail");
    var email = req.body.email;
    var description = req.body.description;
    var facebook = req.body.facebook;
    var insta = req.body.insta;
    var twitter = req.body.twitter;
    var pinterest = req.body.pinterest;
    var website = req.body.website;
    var youtube = req.body.youtube;
    var artstation = req.body.artstation;
    var behance = req.body.behance;
    var steemit = req.body.steemit


    await db.query(authQueries.updateaboutDetail, [description, facebook, insta, twitter, pinterest, website, youtube, artstation, behance, steemit, email], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "About Details Updated"
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Updation Error"
            });
        }
    });
}


exports.getShippingAddress = async (db, req, res) => {
    var user_id = req.body.user_id;


    await db.query(authQueries.getShippingAddress, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Address Details Updated",
                data: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Updation Error"
            });
        }
    });
}


exports.updateShippingAddress = async (db, req, res) => {

    var user_id = req.body.user_id;
    var mobile_number = req.body.mobile_number;
    var pin_code = req.body.pin_code;
    var locality = req.body.locality;
    var shipping_address = req.body.shipping_address;
    var city = req.body.city;
    var state = req.body.state;
    var landmark = req.body.landmark_address;


    let address = {
        mobile_number: mobile_number,
        pin_code: pin_code,
        locality: locality,
        shipping_address: shipping_address,
        city: city,
        state: state,
        landmark: landmark
    }


    await db.query(authQueries.updateShippingAddress, [address, user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Address Details Updated"
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Updation Error"
            });
        }
    });
}






exports.getUserDetail = async (db, req, res) => {
    console.log("in getUserDetail");

    var user_id = req.body.user_id;
    var following_id = req.body.following_id;
    const response1 = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy', {
        method: 'GET', headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const data1 = await response1.json();
    var apiData = await openNFT(config.apiKey);
    const response2 = await fetch('https://espsofttech.in:8001/api/erc1155/getFeeForMint', {
        method: 'POST', headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${config.stripe_key}`
        },
        body: JSON.stringify({
            "from_address": `${config.contractOwnerAddress}`,
            "from_private_key": `${apiData}`,
            "contract_address": `${config.contractAddress}`,
            "to_address": `${config.contractOwnerAddress}`,
            "MetaDataHash": "dfsdsfdsf",
            "TokenName": "test",
            "TokenId": 1,
            "totalSupply": 1
        })
    });
    const feedata = await response2.json();
    //console.log(data1);
    //   const feedata = 5;

    await db.query(authQueries.getUserDetail, [user_id, following_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        //console.log("data=>",data);
        await db.query(marketplaceQueries.getWalletDetail, [user_id], async function (error, walletData) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured in wallet detail!!",
                    error
                });
            }
            // console.log(walletData);

            if (walletData.length > 0) {

                data[0].wallet_balance_usd = (walletData[0].balance).toFixed(2);
                data[0].wallet_balance_eth = (walletData[0].balance / data1['data']['amount']).toFixed(6);
            }
            else {
                data[0].wallet_balance_usd = 0.00;
                data[0].wallet_balance_eth = 0.00;
            }
            var extrafee = 3;

            data[0].transfer_fee_eth = (feedata.tnx_fee + (extrafee / data1['data']['amount'])).toFixed(6);
            data[0].transfer_fee_usd = ((feedata.tnx_fee * data1['data']['amount']) + extrafee).toFixed(2);

            data[0].transfer_fee_eth = 0.01;
            data[0].transfer_fee_usd = 0.01;

            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    msg: "Get User Details",
                    response: data[0]
                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    });
}

exports.addSubscriber = async (db, req, res) => {
    console.log("in addSubscriber");
    var email = req.body.email;


    await db.query(authQueries.getSubscriber, email, async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }

        if (data.length > 0) {
            res.status(400).send({
                success: false,
                msg: "This email is already Subscribed!!",
            });
        } else {
            var sub = {
                "email": email,
                "ip": null,
                "datetime": new Date()
            }

            await db.query(authQueries.addSubscriber, [sub], function (error, result) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                if (result) {
                    res.status(200).send({
                        success: true,
                        msg: "You are subscribed successfully!!",
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        msg: "Insertion Error!! "
                    });
                }
            });
        }
    });
}

exports.getSubscriber = async (db, req, res) => {
    console.log("in getSubscriber");

    await db.query(authQueries.getSubscribe, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All Subscribe Details",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}

exports.getUserDetailData = async (db, req, res) => {
    console.log("in getUserDetailData");
    var id = req.body.id;
    try {
        db.query(authQueries.getUserDetailData, [id], function (error, result) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
            if (result.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "UserProfile Details",
                    response: result[0]
                })
            } else {
                return res.status(400).send({
                    success: false,
                    msg: "No Data"
                })
            }
        })

    } catch (err) {
        //   console.log(err)
        return res.status(400).send({
            success: false,
            msg: "unexpected internal error",
            err
        });
    }

}


exports.cancelListing = async (db, req, res) => {
    console.log("in cancelListing");
    let item_id = req.body.item_id;
    let owner_id = req.body.owner_id;
    let quantity = req.body.quantity;

    let qryData = `select id from item_edition where item_id=${item_id} and owner_id=${owner_id} and is_on_sale=1 and id not in (select item_edition_id from transaction where item_id=${item_id}) order by id limit ${quantity}`;
    console.log(qryData);

    const [editionList] = await promisePool.query(qryData);
    let i=0;
    while(i< editionList.length){
        let qry=`UPDATE item_edition SET is_on_sale=0 WHERE id=${editionList[i].id}`;
        console.log(qry);
        const [editionList2] = await promisePool.query(qry);  
        i++;  
    }
           return res.status(200).send({
                success: true,
                msg: "Listing has been canceled"
    });
}