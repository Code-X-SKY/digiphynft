import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramLogin from 'react-instagram-login';
import { gapi } from "gapi-script";

const headers = {
  'Content-Type': 'application/json'
};

export default class login extends Component {

  constructor(props) {

    super(props)
    this.state = {
      email: '',
      password: "",
      passwordIcon: '1',
      spinLoader: '0'
    };
    gapi.load("client:auth2", () => {
      gapi.client.init({
        clientId: config.clientIdGoogle,
        plugin_name: "chat",
      });
    });
    this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))



  }

  componentDidMount() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      spinLoader: '1'
    })
    const { email, password } = this.state;
    const data = this.state

    axios.post(`${config.apiUrl}login`, data, { email, password })
      .then(result => {
        // alert(' ALL field');
        if (result.data.success === true) {

          // setTimeout(() => {

          // window.location.href = `${config.baseUrl}`

          // }, 2500);
          if (result.data.data.enableTwoFactor === 0) {
            setTimeout(() => {
              toast.success('Login Successfully!');
              window.location.href = `${config.baseUrl}`
              Cookies.set('loginDigiphyFrontend', result.data);
            }, 2500);
          }
          else if (result.data.data.enableTwoFactor === 1) {
            // toast.error('Firstly you have to enter google auth code!', {
            //   position: toast.POSITION.TOP_CENTER
            // });
            setTimeout(() => {

              window.location.href = `${config.baseUrl}googleauthentication`

            }, 2500);
            Cookies.set('loginSuccessAuth', result.data);
          }


        }
        else if (result.data.success === false) {



          this.setState({
            email: '',
            password: '',
            spinLoader: '0'
          })

        }
      }).catch(err => {
        toast.error(err.response?.data?.msg)
        this.setState({
          spinLoader: '0'
        })
      })
  }



  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


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
    const { email, password } = this.state;
    return (

      <>
        <Header />
        <Toaster />
        <div id="content-block" className='loginpage'>
          <div className="container-fluid custom-container">
            <div className="container-fluid custom-container pad-spc mt-5 mb-0" >
              <div className="container">
                <div className="row align-items-center">
                  <div className='col-md-6'>
                    <div className="limiter">
                      <div className="container-login100" style={{ minHeight: "54vh" }}>
                        <div className="">
                          <form className="login100-form validate-form" autoComplete="new-password"
                          >
                            {/*   <div className="text-center mb-2">
                              <img src="images/logo-new.png" align="center" width="196px">
                            </div>  */}
                            <span className="login100-form-title p-b-20">
                              Log in <br />
                              <small style={{ fontSize: "17px" }}>Please login to continue</small>
                            </span>
                            <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                              <input className={this.state.email ? "input100  has-val" : "input100 "} type="email" name="email" onChange={this.handleChange} value={email} />
                              <span className="focus-input100"></span>
                              <span className="label-input100">Email</span>
                            </div>


                            <div className="wrap-input100 validate-input" data-validate="Password is required"  >
                              <input className={this.state.password ? "input100  has-val" : "input100 "} autoComplete="new-password"
                                id="password-field" type={this.state.passwordIcon == 1 ? 'password' : 'text'} name="password" onChange={this.handleChange} value={password} />
                              <span className="focus-input100"></span>
                              <span className="label-input100">Password</span>
                              {this.state.passwordIcon == 1 ?
                                <span onClick={this.passwordEye.bind(this, '1')} toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password"></span>
                                :
                                <span onClick={this.passwordEye.bind(this, '0')} toggle="#password-field" className="fa fa-fw fa-eye-slash field-icon toggle-password"></span>

                              }
                            </div>



                            <div className="container-login100-form-btn">
                              {/* <button className="login100-form-btn" type="submit"  >
                                Login
                              </button> */}
                              {this.state.spinLoader === '0' ?
                                <button className="login100-form-btn" type="submit" onClick={this.handleSubmit} disabled={!this.state.email || !this.state.password === ''} >
                                  Login
                                </button> :
                                <button className="login100-form-btn" disabled>
                                  Loading<i class="fa fa-spinner fa-spin validat"></i>
                                </button>
                              }


                            </div>
                            <div className="flex-sb-m w-full p-t-3 p-b-32 mt-2">

                              <Link to={`${config.baseUrl}generatepassword`} className="txt1">
                                Forgot Password?
                              </Link>
                              <div>
                                <div href="#" className="txt1 mt-2">
                                  Don't have an account? <Link to={`${config.baseUrl}register`}>Sign up</Link>
                                </div>
                              </div>
                            </div>

                          </form>
                        </div>
                      </div>
                    </div>

                    <div className='text-center social-icons'>
                      <ul>
                        <li>
                          {/* <img src='images/google.png' /> */}
                          <GoogleLogin
                            clientId={config.clientIdGoogle}
                            // buttonText="sign"
                            autoLoad={false}
                            // icon={false}
                            className="googleButton"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                          />
                        </li>

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
                      </ul>
                    </div>

                  </div>
                  <div className='col-md-6 text-center'>
                    <div className='loginimage'>
                      <img src='images/register.png' />

                    </div>

                  </div>

                </div>
              </div>
            </div>
            <br /><br /><br />
          </div>
        </div>
        <Footer />
      </>
    )
  }
}