import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const headers = {
  'Content-Type': 'application/json'
};

export default class about extends Component {

  constructor(props) {
    super(props)
    this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'));
    if (this.loginData.length === 0) {
      window.location.href = `${config.baseUrl}login`
    }
    this.state = {
      email: '',
      aboutData: '',
      description: "",
      facebook: "",
      insta: "",
      twitter: "",
      pinterest: "",
      website: "",
      youtube: "",
      artstation: "",
      behance: "",
      steemit: "",
      talentStatusAPIData: ''
    }
    this.onChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this)
  }

  componentDidMount() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.getAboutDetailAPI()
    this.talentStatusAPI()

  }

  //================================  Talent status API ======================

  async talentStatusAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getTelentStatus`,
      data: { 'user_id': this.loginData.data.id }
    })
      .then(result => {
        if (result.data.success === true) {
          this.setState({
            talentStatusAPIData: result.data.response[0]
          })
        }
        else if (result.data.success === false) {
        }
      }).catch(err => {
      });
  }

  //================================  Event perform ======================

  handleChange = event => {
    event.preventDefault()
    let value = event.target.value;
    this.setState(prevState => ({
      aboutData: { ...prevState.aboutData, [event.target.name]: value }
    }))
  }

  //================================  About detail ======================

  async getAboutDetailAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getAboutDetail`,
      headers: { "Authorization": this.loginData.Token },
      data: { "email": this.loginData.data.user_email }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          aboutData: response.data.response
        })
      }
    })
  }

  //================================================= Update About ========================

  submitForm(e) {
    e.preventDefault();
    this.state.aboutData.email = this.loginData.data.user_email
    axios({
      method: 'post',
      url: `${config.apiUrl}updateAboutDetail`,
      headers: { "Authorization": this.loginData.Token },
      data: this.state.aboutData
    })
      .then(result => {

        if (result.data.success === true) {
          toast.success(result.data.msg, {
            position: toast.POSITION.TOP_CENTER
          });
          this.componentDidMount()
        }
        else if (result.data.success === false) {
          toast.error(result.data.msg, {
            position: toast.POSITION.TOP_CENTER
          });
        }
      }).catch(err => {
      })
  }

  //================================  URL change ======================

  loading(id) {

    if (id == '1') {
      window.location.href = `${config.baseUrl}authoredit`
    }
    else if (id == '2') {
      window.location.href = `${config.baseUrl}about`
    }
    else if (id == '3') {
      window.location.href = `${config.baseUrl}salehistory`
    }
    else if (id == '4') {
      window.location.href = `${config.baseUrl}yourpurchase`
    }
    else if (id == '5') {
      window.location.href = `${config.baseUrl}paymentsetting`
    }
    else if (id == '6') {
      window.location.href = `${config.baseUrl}featurescreator/${this.loginData.data.id}`

    }
    else if (id == '7') {
      window.location.href = `${config.baseUrl}royalty`
    }
    else if (id == '8') {
      window.location.href = `${config.baseUrl}bulk_nft`
    }

  }

  //==================================  HTML start =========================================
  render() {
    return (

      <>
        <Header />
        <body className="page-login" >
          <div id="content-block">
            <ToastContainer />
            <div className="container be-detail-container your-purchase-bid">

              <div className="row">
                <div className="left-feild col-xs-12 col-sm-3">

                  <div className="be-vidget" id="scrollspy">

                    <div className="creative_filds_block">
                      <ul className="ul nav">
                        {this.state.talentStatusAPIData?.telent_status === 1 ?
                          <li className="edit-ln" ><Link onClick={this.loading.bind(this, '6')} to={`${config.baseUrl}featurescreator/${this.loginData.data.id}`}>My Profile</Link></li>
                          : ''

                        }
                        <li className="edit-ln" ><Link onClick={this.loading.bind(this, '1')} to={`${config.baseUrl}authoredit`}>Account Setting</Link></li>
                        <li className="edit-ln active" ><Link onClick={this.loading.bind(this, '2')} to={`${config.baseUrl}about`}>About</Link></li>
                        <li className="edit-ln" ><Link onClick={this.loading.bind(this, '3')} to={`${config.baseUrl}salehistory`}>Sale history</Link></li>
                        <li className="edit-ln" ><Link onClick={this.loading.bind(this, '4')} to={`${config.baseUrl}yourpurchase`}>Buy History</Link></li>
                        <li className="edit-ln" ><Link onClick={this.loading.bind(this, '5')} to={`${config.baseUrl}paymentsetting`}>Wallet</Link></li>
                        <li className="edit-ln" ><Link onClick={this.loading.bind(this, '7')} to={`${config.baseUrl}royalty`}>Royalty</Link></li>
                      </ul> </div>

                  </div>
                </div>
                <div className="col-xs-12 col-sm-9 _editor-content_">
                  <div className="" data-sec="about-me">
                    <div className="be-large-post">
                      <div className="info-block style-2" style={{ borderRadius: "0px" }}>
                        <div className="be-large-post-align"><h3 className="info-block-label">About You</h3></div>
                      </div>
                      <div className="be-large-post-align">
                        <div className="row">


                          <div className="input-col col-xs-12">
                            <div className="form-group focus-2 mb-4 description-field">
                              <div className="form-label">Description</div>
                              <textarea className="form-input" name="description" onChange={this.handleChange} value={this.state.aboutData.description}
                                placeholder="Something about you"></textarea>
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-12">
                            <div className="form-label">External Link:</div>
                            <div className="input-group mb-5">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3" style={{ width: '110px' }}>Facebook.com</span>
                              </div>
                              <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                                name="facebook" onChange={this.handleChange} value={this.state.aboutData.facebook} />
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12">
                            <div className="input-group mb-5">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3" style={{ width: '110px' }}>Instagram.com</span>
                              </div>
                              <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                                name="insta" onChange={this.handleChange} value={this.state.aboutData.insta} />
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12">
                            <div className="input-group mb-5">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3" style={{ width: '110px' }}>Twitter.com</span>
                              </div>
                              <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                                name="twitter" onChange={this.handleChange} value={this.state.aboutData.twitter} />
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12">
                            <div className="input-group mb-5">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3" style={{ width: '110px' }}>Pinterest.com</span>
                              </div>
                              <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                                name="pinterest" onChange={this.handleChange} value={this.state.aboutData.pinterest} />
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12">
                            <div className="input-group mb-5">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3" style={{ width: '110px' }}>Website</span>
                              </div>
                              <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                                name="website" onChange={this.handleChange} value={this.state.aboutData.website} />
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12">
                            <div className="input-group mb-5">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3" style={{ width: '110px' }}>Youtube.com</span>
                              </div>
                              <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                                name="youtube" onChange={this.handleChange} value={this.state.aboutData.youtube} />
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12">
                            <div className="input-group mb-5">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3" style={{ width: '110px' }}>Artstation.com</span>
                              </div>
                              <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                                name="artstation" onChange={this.handleChange} value={this.state.aboutData.artstation} />
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12">
                            <div className="input-group mb-5">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3" style={{ width: '110px' }}>Behance.net</span>
                              </div>
                              <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                                name="behance" onChange={this.handleChange} value={this.state.aboutData.behance} />
                            </div>
                          </div>
                        </div>
                        <div className="input-group mb-5">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon3" style={{ width: '110px' }}>Steemit.com</span>
                          </div>
                          <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3"
                            name="steemit" onChange={this.handleChange} value={this.state.aboutData.steemit} />
                        </div>

                        <div >
                          <a className="btn color-1 size-1 hover-1 btn-right" type="submit" onClick={this.submitForm} >Update</a>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
        <Footer />
      </>
    )
  }
}