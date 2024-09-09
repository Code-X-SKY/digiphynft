import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramLogin from 'react-instagram-login';

const headers = {
  'Content-Type': 'application/json'
};

export default class register extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      confirm_email: '',
      user_name: '',
      full_name: '',
      password: '',
      captcha_code: '',
      passwordIcon: '1',
      is_subscribed: '1',
      spinLoader: '0',
      address: ''
    };
    const { match: { params } } = this.props;
    this.token = params.token
  }

  componentDidMount() {
    if (this.token) {
      this.verifyAccountAPI()
    }
  }

  //====================================  Event  ========================================================

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //=======================================  Password Eye ================================================
  passwordEye(id) {
    if (id == 1) {
      id = 0
    }
    else if (id == 0) {
      id = 1
    }
    this.setState({
      passwordIcon: id
    })
  }

  //=============================================  Verify Account  =========================================

  async verifyAccountAPI() {
    axios.post(`${config.apiUrl}verifyAccount/` + this.token, { headers })
      .then(result => {
        if (result.data.success === true) {
          toast.success(result.data.msg)
          setTimeout(() => {
            window.location.href = `${config.baseUrl}login`
          }, 3500);
        }
        if (result.data.success === false) {
          toast.error(result.data.msg);
        }
      })
      .catch(err => {
        toast.error(err.response.data?.msg)
      });
    setTimeout(() => {
      window.location.href = `${config.baseUrl}login`
    }, 3500);
  }

  //==========================================  Register API  ===============================================

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      spinLoader: '1'
    })
    if (this.state.is_subscribed == 0) {
      return
    }
    const { full_name, user_name, email, confirm_email, password, is_subscribed, address } = this.state;
    axios.post(`${config.apiUrl}register`, { full_name, user_name, email, confirm_email, password, is_subscribed, address })
      .then(result => {
        if (result.data.success === true) {
          toast.success(result.data.msg);
          setTimeout(() => {
            window.location.href = `${config.baseUrl}login`
          }, 2000);
        }
      }).catch(err => {
        this.setState({
          spinLoader: '0'
        })
        toast.error(err.response.data?.msg);
      })
  }

  //==============================================  Subscribe check box ======================================

  clickChange(id) {
    if (id === 0) {
      this.setState({
        is_subscribed: '1'
      })
    }
    else if (id === 1) {
      this.setState({
        is_subscribed: '0'
      })
    }
  }


  //========================================  login with google  ========================
  responseGoogle = async (response) => {
    if (response.profileObj?.email) {
      try {
        const res = await axios.post(`${config.apiUrl}loginType`, {
          "email": response.profileObj?.email,
          "full_name": response.profileObj?.name,
          "login_type": "Gmail"
        });
        Cookies.set('loginDigiphyFrontend', JSON.stringify(res.data));
        toast.success(res.data.msg)
        setTimeout(() => {
          window.location.href = `${config.baseUrl}authoredit`
        }, 1000);
      } catch (err) {
        toast.error(err.response.data?.msg)
      }
    }
  }

  //========================================  login with Facebook  ========================

  responseFacebook = async (response) => {
    try {
      const res = await axios.post(`${config.apiUrl}loginType`, {
        "email": response?.email,
        "full_name": response?.name,
        "login_type": "Facebook"
      });
      if (res.data.success === true) {
        Cookies.set('loginDigiphyFrontend', JSON.stringify(res.data));
        toast.success(res.data.msg)
        setTimeout(() => {
          window.location.href = `${config.baseUrl}authoredit`
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response.data?.msg)
    }
  }

  //========================================  login with Instagram  ========================

  responseInstagram = async (response) => {
    try {
      const res = await axios.post(`${config.apiUrl}loginType`, {
        "email": response?.email,
        "full_name": response?.name,
        "login_type": "Instagram"
      });
      if (res.data.success === true) {
        Cookies.set('loginDigiphyFrontend', JSON.stringify(res.data));
        toast.success(res.data.msg)
        setTimeout(() => {
          window.location.href = `${config.baseUrl}authoredit`
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response.data?.msg)
    }
  }


  render() {
    const { user_name, full_name, email, confirm_email, password, is_subscribed, address } = this.state;
    return (
      <>
        <Header />
        <div id="content-block" className='loginpage'>
          <br /><br />
          <div className="container-fluid custom-container">
            <div className="container-fluid custom-container pad-spc pt-0  mb-0" >
              <div className="container">
                <div className="row">
                  <div className='col-md-6'>
                    <div className="limiter">
                      <div className="container-login100">
                        <div className="">
                          <form className="login100-form validate-form" autoComplete="new-password"
                          >
                            <Toaster />
                            <div className="text-center mb-2">
                            </div>
                            <span className="login100-form-title p-b-20">
                              Sign up for DiGiphyNFT
                            </span>
                            <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                              <input className={this.state.email ? "input100  has-val" : "input100 "} type="email" name="email" autoComplete="new-password"
                                onChange={this.handleChange} value={email} />
                              <span className="focus-input100"></span>
                              <span className="label-input100">Email Address</span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz" style={{display:'none'}}>
                              <input className={this.state.confirm_email ? "input100  has-val" : "input100 "} type="email" name="confirm_email" autoComplete="new-password"
                                onChange={this.handleChange} value={confirm_email} />
                              <span className="focus-input100"></span>
                              <span className="label-input100">Confirm Email Address*</span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Username is required">
                              <input className={this.state.user_name ? "input100  has-val" : "input100 "} type="text" name="user_name" autoComplete="new-password"
                                onChange={this.handleChange} value={user_name} />
                              <span className="focus-input100"></span>
                              <span className="label-input100">Username</span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Your Name is required" style={{display:'none'}}>
                              <input className={this.state.full_name ? "input100  has-val" : "input100 "} type="text" name="full_name" autoComplete="new-password"
                                onChange={this.handleChange} value={full_name} />
                              <span className="focus-input100"></span>
                              <span className="label-input100">Full Name</span>
                            </div>

                            <div className="wrap-input100 validate-input mb-3" data-validate="Password is required">
                              <input className={this.state.password ? "input100  has-val" : "input100 "} type={this.state.passwordIcon == 1 ? 'password' : 'text'} id="password-field" name="password" autoComplete="new-password"
                                onChange={this.handleChange} value={password} />
                              <span className="focus-input100"></span>
                              <span className="label-input100">Password</span>
                              {this.state.passwordIcon == 1 ?
                                <span toggle="#password-field" onClick={this.passwordEye.bind(this, '1')} className="fa fa-fw fa-eye field-icon toggle-password"></span>
                                : <span toggle="#password-field" onClick={this.passwordEye.bind(this, '0')} className="fa fa-fw fa-eye-slash field-icon toggle-password"></span>}
                            </div>

                            <div className="wrap-input100 validate-input" style={{display:'none'}}>
                              <input className={this.state.address ? "input100  has-val" : "input100 "} type="text" name="address" autoComplete="new-password"
                                onChange={this.handleChange} value={address} />
                              <span className="focus-input100"></span>
                              <span className="label-input100">User Address</span>
                            </div>



                            <p className="text-white mb-3">Password must be at least 8 characters and contain 1 special character or number.</p>

                            <div className="flex-sb-m w-full mt-0 ">
                              <div className="contact100-form-checkbox pt-4">
                                {this.state.is_subscribed === '1'
                                  ?
                                  <input className="input-checkbox100" id="ckb1" type="checkbox" checked onClick={this.clickChange.bind(this, 1)} name="remember-me" />
                                  : <input className="input-checkbox100" id="ckb1" type="checkbox" onClick={this.clickChange.bind(this, 0)} name="remember-me" />
                                }

                                <label className="label-checkbox100" for="ckb1">
                                  By signing up, you agree to the <a href={`${config.baseUrl}termscondition`}>
                                    Terms and Conditions</a> and &nbsp;
                                  <a href={`${config.baseUrl}privacypolicy`} >Privacy Policy</a>
                                </label>

                              </div>
                            </div>
                            <br />
                            {this.state.is_subscribed == 0 ? <p style={{ color: 'red' }}>To Register with DiGiphyNFT you have to click on checkbox</p> : ''}
                            <div>
                            </div>

                            <br />

                            <div className="container-login100-form-btn">
                              <button className="login100-form-btn" type='submit' onClick={this.handleSubmit}>
                                Register
                              </button>
                            </div>
                            <div className="p-t-10 p-b-32">
                              <div>
                                <span className='text-white pull-right'>Already have an account?&nbsp;<Link style={{ float: 'right' }} to={`${config.baseUrl}login`}>
                                  Login here
                                </Link></span>
                              </div>
                            </div>
                            {/* <br /> */}
                          </form>
                        </div>
                      </div>

                    </div>
                    <div className='text-center social-icons'>
                      {/* <ul>
                        <li> */}
                          {/* <img src='images/google.png' /> */}
                          <GoogleLogin
                            clientId={config.clientIdGoogle}
                            buttonText="signup with Google"
                            autoLoad={false}
                            // icon={false}
                            className="googleButton"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                          />
                        {/* </li> */}

                        {/* <li><img src='images/facebook.png' />
                          <FacebookLogin
                            appId={config.facebookId}
                            icon={false}
                            textButton="sign"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                          />
                        </li>

                        <li className="instagramButton"><img
                          src='images/Instagram.webp' />
                          <InstagramLogin
                            clientId={config.instaId}
                            buttonText="sign"
                            onSuccess={this.responseInstagram}
                            onFailure={this.responseInstagram}
                          /></li> */}
                      {/* </ul> */}
                    </div>
                  </div>
                  <div className='col-md-6 text-center'>
                    <div className='registerimage '>
                      <img src='images/login.png' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
          </div>
        </div>
        <Footer />
      </>
    )
  }
}