import React, { Component } from 'react';
import Cookies from 'js-cookie';
import {Link} from 'react-router-dom'
import config from '../config/config'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
export default class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            profile_pic : ''
        }

        this.loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin'))?[]:JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'))
      //  console.log(this.loginData);


    }
    
   async getUserProfilePicAPI() {
    await axios({
        method: 'post',
        url: `${config.apiUrl}adminprofilepic`,
    //	headers: { "Authorization": this.loginData.message },
  data:{'email':this.loginData.data.user_email}
    })
  .then(response => {
        if (response.data.success === true) {
            this.setState({
                profile_pic: response.data.response
            })
        //  alert(JSON.stringify(this.state.profile_pic))
        
  }
})
}


    componentDidMount() {

          this.getUserProfilePicAPI();
                        }


    logout(){
        Cookies.remove('loginSuccessdigiphyNFTAdmin')
            }

   
    render() {

        return (
            <div className="wrapper theme-6-active pimary-color-green ">
            <div className="sp-header">
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <ToastContainer/>
            <div className="mobile-only-brand pull-left">
                <div className="nav-header pull-left">
                    <div className="logo-wrap">
                        <a href={`${config.baseUrl}dashboard`}>
                            <img className="brand-img" src="images/logo-digiphy.png" alt="brand" style={{width:"135px" ,color:"#fff"}} />
                            <span className="brand-text"></span>
                        </a>
                    </div>
                </div>
                 <a  id="mobileMenuBtn"  className="toggle-left-nav-btn hidden-lg hidden-md  ml-20 pull-left1" href="javascript:void(0);"><i className="zmdi zmdi-menu"></i></a>
                {/* <a id="toggle_mobile_search" data-toggle="collapse" data-target="#search_form" className="mobile-only-view" href="javascript:void(0);"><i className="zmdi zmdi-search"></i></a> */}
                <a id="toggle_mobile_nav" className="mobile-only-view" href="javascript:void(0);"><i className="zmdi zmdi-more"></i></a>

                {/* <form id="search_form" role="search" className="top-nav-search collapse pull-left">
                    <div className="input-group">
                        <input type="text" name="example-input-group2" className="form-control" placeholder="Search" />
                        <span className="input-group-btn">
                            <button type="button" className="btn  btn-default" data-target="#search_form" data-toggle="collapse" aria-label="Close" aria-expanded="true"><i className="zmdi zmdi-search"></i></button>
                        </span>
                    </div>
                </form>  */}
            </div>
            <div id="mobile_only_nav" className="mobile-only-nav pull-right">
                <ul className="nav navbar-right top-nav pull-right">
                    {/* <li>
                        <a id="open_right_sidebar" href="#"><i className="zmdi zmdi-settings top-nav-icon"></i></a>
                    </li> */}
                    {/* <li className="dropdown app-drp">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="zmdi zmdi-apps top-nav-icon"></i></a>
                        <ul className="dropdown-menu app-dropdown" data-dropdown-in="slideInRight" data-dropdown-out="flipOutX">
                            <li>
                                <div className="app-nicescroll-bar">
                                    <ul className="app-icon-wrap pa-10">
                                        <li>
                                            <a href="weather.html" className="connection-item">
                                                <i className="zmdi zmdi-cloud-outline txt-info"></i>
                                                <span className="block">weather</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="inbox.html" className="connection-item">
                                                <i className="zmdi zmdi-email-open txt-success"></i>
                                                <span className="block">e-mail</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="calendar.html" className="connection-item">
                                                <i className="zmdi zmdi-calendar-check txt-primary"></i>
                                                <span className="block">calendar</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="vector-map.html" className="connection-item">
                                                <i className="zmdi zmdi-map txt-danger"></i>
                                                <span className="block">map</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="chats.html" className="connection-item">
                                                <i className="zmdi zmdi-comment-outline txt-warning"></i>
                                                <span className="block">chat</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="contact-card.html" className="connection-item">
                                                <i className="zmdi zmdi-assignment-account"></i>
                                                <span className="block">contact</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <div className="app-box-bottom-wrap">
                                    <hr className="light-grey-hr ma-0" />
                                    <a className="block text-center read-all" href="javascript:void(0)"> more </a>
                                </div>
                            </li>
                        </ul>
                    </li> */}
                    {/* <li className="dropdown full-width-drp">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="zmdi zmdi-more-vert top-nav-icon"></i></a>
                        <ul className="dropdown-menu mega-menu pa-0" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut">
                            <li className="product-nicescroll-bar row">
                                <ul className="pa-20">
                                    <li className="col-md-3 col-xs-6 col-menu-list">
                                        <a href="javascript:void(0);"><div className="pull-left"><i className="zmdi zmdi-landscape mr-20"></i><span className="right-nav-text">Dashboard</span></div><div className="pull-right"><i className="zmdi zmdi-caret-down"></i></div><div className="clearfix"></div></a>
                                        <hr className="light-grey-hr ma-0" />
                                        <ul>
                                            <li>
                                                <a href="index.html">Analytical</a>
                                            </li>
                                            <li>
                                                <a href="index2.html">Demographic</a>
                                            </li>
                                            <li>
                                                <a href="index3.html">Project</a>
                                            </li>
                                            <li>
                                                <a href="index4.html">Hospital</a>
                                            </li>
                                            <li>
                                                <a href="index5.html">HRM</a>
                                            </li>
                                            <li>
                                                <a href="index6.html">Real Estate</a>
                                            </li>
                                            <li>
                                                <a href="profile.html">profile</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="col-md-3 col-xs-6 col-menu-list">
                                        <a href="javascript:void(0);">
                                            <div className="pull-left">
                                                <i className="zmdi zmdi-shopping-basket mr-20"></i><span className="right-nav-text">E-Commerce</span>
                                            </div>
                                            <div className="pull-right"><span className="label label-success">hot</span>
                                            </div>
                                            <div className="clearfix"></div>
                                        </a>
                                        <hr className="light-grey-hr ma-0" />
                                        <ul>
                                            <li>
                                                <a href="e-commerce.html">Dashboard</a>
                                            </li>
                                            <li>
                                                <a href="product.html">Products</a>
                                            </li>
                                            <li>
                                                <a href="product-detail.html">Product Detail</a>
                                            </li>
                                            <li>
                                                <a href="add-products.html">Add Product</a>
                                            </li>
                                            <li>
                                                <a href="product-orders.html">Orders</a>
                                            </li>
                                            <li>
                                                <a href="product-cart.html">Cart</a>
                                            </li>
                                            <li>
                                                <a href="product-checkout.html">Checkout</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="col-md-6 col-xs-12 preview-carousel">
                                        <a href="javascript:void(0);"><div className="pull-left"><span className="right-nav-text">latest products</span></div><div className="clearfix"></div></a>
                                        <hr className="light-grey-hr ma-0" />
                                        <div className="product-carousel owl-carousel owl-theme text-center">
                                            <a href="#">
                                                <img src="img/chair.jpg" alt="chair" />
                                                <span>Circle chair</span>
                                            </a>
                                            <a href="#">
                                                <img src="img/chair2.jpg" alt="chair" />
                                                <span>square chair</span>
                                            </a>
                                            <a href="#">
                                                <img src="img/chair3.jpg" alt="chair" />
                                                <span>semi circle chair</span>
                                            </a>
                                            <a href="#">
                                                <img src="img/chair4.jpg" alt="chair" />
                                                <span>wooden chair</span>
                                            </a>
                                            <a href="#">
                                                <img src="img/chair2.jpg" alt="chair" />
                                                <span>square chair</span>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li> */}
                    {/* <li className="dropdown alert-drp">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="zmdi zmdi-notifications top-nav-icon"></i><span className="top-nav-icon-badge">5</span></a>
                        <ul className="dropdown-menu alert-dropdown" data-dropdown-in="bounceIn" data-dropdown-out="bounceOut">
                            <li>
                                <div className="notification-box-head-wrap">
                                    <span className="notification-box-head pull-left inline-block">notifications</span>
                                    <a className="txt-danger pull-right clear-notifications inline-block" href="javascript:void(0)"> clear all </a>
                                    <div className="clearfix"></div>
                                    <hr className="light-grey-hr ma-0" />
                                </div>
                            </li>
                            <li>
                                <div className="streamline message-nicescroll-bar">
                                    <div className="sl-item">
                                        <a href="javascript:void(0)">
                                            <div className="icon bg-green">
                                                <i className="zmdi zmdi-flag"></i>
                                            </div>
                                            <div className="sl-content">
                                                <span className="inline-block capitalize-font  pull-left truncate head-notifications">
                                                    New subscription created</span>
                                                <span className="inline-block font-11  pull-right notifications-time">2pm</span>
                                                <div className="clearfix"></div>
                                                <p className="truncate">Your customer subscribed for the basic plan. The customer will pay $25 per month.</p>
                                            </div>
                                        </a>
                                    </div>
                                    <hr className="light-grey-hr ma-0" />
                                    <div className="sl-item">
                                        <a href="javascript:void(0)">
                                            <div className="icon bg-yellow">
                                                <i className="zmdi zmdi-trending-down"></i>
                                            </div>
                                            <div className="sl-content">
                                                <span className="inline-block capitalize-font  pull-left truncate head-notifications txt-warning">Server #2 not responding</span>
                                                <span className="inline-block font-11 pull-right notifications-time">1pm</span>
                                                <div className="clearfix"></div>
                                                <p className="truncate">Some technical error occurred needs to be resolved.</p>
                                            </div>
                                        </a>
                                    </div>
                                    <hr className="light-grey-hr ma-0" />
                                    <div className="sl-item">
                                        <a href="javascript:void(0)">
                                            <div className="icon bg-blue">
                                                <i className="zmdi zmdi-email"></i>
                                            </div>
                                            <div className="sl-content">
                                                <span className="inline-block capitalize-font  pull-left truncate head-notifications">2 new messages</span>
                                                <span className="inline-block font-11  pull-right notifications-time">4pm</span>
                                                <div className="clearfix"></div>
                                                <p className="truncate"> The last payment for your G Suite Basic subscription failed.</p>
                                            </div>
                                        </a>
                                    </div>
                                    <hr className="light-grey-hr ma-0" />
                                    <div className="sl-item">
                                        <a href="javascript:void(0)">
                                            <div className="sl-avatar">
                                                <img className="img-responsive" src="img/avatar.jpg" alt="avatar" />
                                            </div>
                                            <div className="sl-content">
                                                <span className="inline-block capitalize-font  pull-left truncate head-notifications">Sandy Doe</span>
                                                <span className="inline-block font-11  pull-right notifications-time">1pm</span>
                                                <div className="clearfix"></div>
                                                <p className="truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                            </div>
                                        </a>
                                    </div>
                                    <hr className="light-grey-hr ma-0" />
                                    <div className="sl-item">
                                        <a href="javascript:void(0)">
                                            <div className="icon bg-red">
                                                <i className="zmdi zmdi-storage"></i>
                                            </div>
                                            <div className="sl-content">
                                                <span className="inline-block capitalize-font  pull-left truncate head-notifications txt-danger">99% server space occupied.</span>
                                                <span className="inline-block font-11  pull-right notifications-time">1pm</span>
                                                <div className="clearfix"></div>
                                                <p className="truncate">consectetur, adipisci velit.</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="notification-box-bottom-wrap">
                                    <hr className="light-grey-hr ma-0" />
                                    <a className="block text-center read-all" href="javascript:void(0)"> read all </a>
                                    <div className="clearfix"></div>
                                </div>
                            </li>
                        </ul>
                    </li> */}
                    <li className="dropdown auth-drp">
                        <a href="#" className="dropdown-toggle pr-0" data-toggle="dropdown"><img src={`${config.imageUrl1}/${this.state.profile_pic.profile_pic}`} alt="user_auth" className="user-auth-img img-circle" /><span className="user-online-status"></span></a>
                        <ul className="dropdown-menu user-auth-dropdown" data-dropdown-in="flipInX" data-dropdown-out="flipOutX">
                            {/* <li>
                                <a href="profile.html"><i className="zmdi zmdi-account"></i><span>Profile</span></a>
                            </li>
                            <li>
                                <a href="#"><i className="zmdi zmdi-card"></i><span>my balance</span></a>
                            </li>
                            <li>
                                <a href="inbox.html"><i className="zmdi zmdi-email"></i><span>Inbox</span></a>
                            </li>
                            <li>
                                <a href="#"><i className="zmdi zmdi-settings"></i><span>Settings</span></a>
                            </li> */}
                            {/* <li className="divider"></li>
                            <li className="sub-menu show-on-hover">
                                <a href="#" className="dropdown-toggle pr-0 level-2-drp"><i className="zmdi zmdi-check text-success"></i> available</a>
                                <ul className="dropdown-menu open-left-side">
                                    <li>
                                        <a href="#"><i className="zmdi zmdi-check text-success"></i><span>available</span></a>
                                    </li>
                                    <li>
                                        <a href="#"><i className="zmdi zmdi-circle-o text-warning"></i><span>busy</span></a>
                                    </li>
                                    <li>
                                        <a href="#"><i className="zmdi zmdi-minus-circle-outline text-danger"></i><span>offline</span></a>
                                    </li>
                                </ul>
                            </li> */}
                           
                            {/* <li> */}
                            {/* <button type="button" className="link" data-toggle="modal" data-target="#reset-password-modal">change Password</button>           */}
                            {/* </li> */}
                            <li>
                                <a href={`${config.baseUrl}changeprofile`}  ><i className="zmdi zmdi-account-o "></i>
                                <span>Edit Profile Pic</span></a>
                            </li>
                            
                             <li>
                                <a href={`${config.baseUrl}changepassword`}  ><i className="zmdi zmdi-key"></i>
                                <span>Change Password</span></a>
                            </li> 
                            
                        
                            <li>
                                <a href={`${config.baseUrl}`} onClick={this.logout.bind(this)}><i className="zmdi zmdi-power"></i>
                                <span>Log Out</span></a>
                            </li>
                        </ul>
                    </li>
                </ul>
              
{/* 
                <div className="bottomLinksOption clr">
                        <div>

                           <div className="modal fade" id="reset-password-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                              <div className="modal-dialog" role="document">
                                 <div className="modal-content">
                                    <div className="modal-body">
                                       <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                       <h5 className="modal-title">Reset Your Password</h5>
                                       <p></p>
                                       <form>
                                          <div className="input_row"><span className="reveal_pass">Old Password</span><input className="form-control input-lg" type="password" placeholder="Old Password" onChange={this.handleChange1} name="currentPassword" id="old_password" value={this.state.currentPassword}/></div>
                                          <div className="input_row"><span className="reveal_pass">New Password</span><input className="form-control input-lg" type="password" placeholder="New Password" onChange={this.handleChange1} name="password" id="new_password" value={this.state.password}/></div>
                                          <div className="input_row"><span className="reveal_pass">Confirm New Password</span><input className="form-control input-lg" type="password" placeholder="Confirm New Password" onChange={this.handleChange1} id="confirm_new_password" name="password2" value={this.state.password2}/></div>
                                          <div className="form-group last-child"><button type="button" onClick={this.changePasswordAPI} className="btn mt-3 btn-primary custom-btn gradient md" style={{width:"100"}}><span>Update Password</span></button></div>         
                                      </form>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                            </div> */}

                            {/* Edit Profile  */}
                            </div>
                  </nav>
                  </div>
                  </div>

        )

    }
}