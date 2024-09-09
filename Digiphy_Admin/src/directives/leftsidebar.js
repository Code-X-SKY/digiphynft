import React, { Component } from 'react';
import config from '../config/config'
import { Link } from 'react-router-dom';
export default class Leftsidebar extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {


    }


    render() {

        return (
            <div className="fixed-sidebar-left mobileLeftShow">
                <ul className="nav navbar-nav side-nav nicescroll-bar">
                    <li className="navigation-header">
                        <span style={{ color: "#fff", fontSize: "18px" }}>Main</span>

                        <i className="zmdi zmdi-more"></i>
                    </li>

                    <li>
                        <a href={`${config.baseUrl}dashboard`}><div className="pull-left"><i className="zmdi zmdi-view-dashboard mr-20"></i><span className="right-nav-text">Dashboard</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                   

                    {/* <li>
                    <a href={`${config.baseUrl}realestateusers`}><div className="pull-left"><i className="zmdi zmdi-city-alt mr-20"></i><span className="right-nav-text">Real Estate Users</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li> */}

                    <li>
                        <a href={`${config.baseUrl}users`}><div className="pull-left"><i className="zmdi zmdi-account mr-20"></i><span className="right-nav-text">Users</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                        <a href={`${config.baseUrl}usercollection`}><div className="pull-left"><i className="zmdi zmdi-accounts mr-20"></i><span className="right-nav-text">User Collections</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                    <a href={`${config.baseUrl}admincollection`}><div className="pull-left"><i className="zmdi zmdi-local-store mr-20"></i><span className="right-nav-text">Admin Collections</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>

                    <li>
                        <a href={`${config.baseUrl}category`}><div className="pull-left"><i className="zmdi zmdi-collection-image mr-20"></i><span className="right-nav-text">Category</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                        <a href={`${config.baseUrl}product`}><div className="pull-left"><i className="zmdi  zmdi-toys mr-20"></i><span className="right-nav-text">Admin NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
                    <li>
                        <a href={`${config.baseUrl}productuser`}><div className="pull-left"><i className="zmdi  zmdi-toys mr-20"></i><span className="right-nav-text">User NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
                    <li>
                        <a href={`${config.baseUrl}bulk_item`}><div className="pull-left"><i className="zmdi zmdi-assignment-account mr-20"></i><span className="right-nav-text">Bulk Nft</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>
                    {/* <li>
                        <a href={`${config.baseUrl}usernft`}><div className="pull-left"><i className="zmdi  zmdi-toys mr-20"></i><span className="right-nav-text">Users NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li> */}
                    {/* <li>
                    <a href={`${config.baseUrl}editnft`}><div className="pull-left"><i className="zmdi  zmdi-city mr-20"></i><span className="right-nav-text">Edit NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li> */}
                    <li>
                        <a href="javascript:void(0);" data-toggle="collapse" data-target="#app_dr" class="collapsed" aria-expanded="false"><span className=""> <i class="zmdi zmdi-layers mr-20"></i><span className="right-nav-text">Website Content</span>  <i class="zmdi zmdi-chevron-down zmdi-hc-fw mr-20" style={{ float: "right", marginTop: "3px" }}></i></span></a>



                        <ul id="app_dr" class="collapse collapse-level-1" >

                            <li className="">
                                <a href={`${config.baseUrl}faqs`} >

                                    <span className="pcoded-micon"><i class="zmdi zmdi-format-list-bulleted mr-20"></i></span>
                                    <span className="pcoded-mtext">FAQ's</span>
                                    <span className="pcoded-mcaret"></span>
                                </a>

                            </li>

                            <li className="">
                                <a href={`${config.baseUrl}privacyAndPolicy`} >

                                    <span className="pcoded-micon"><i class="zmdi zmdi-format-list-bulleted mr-20"></i></span>
                                    <span className="pcoded-mtext">  Privacy Policy</span>
                                    <span className="pcoded-mcaret"></span>
                                </a>

                            </li>

                            <li className="">
                                <a href={`${config.baseUrl}termsAndCondition`} >
                                    <span className="pcoded-micon"><i class="zmdi zmdi-format-indent-increase mr-20"></i></span>
                                    <span className="pcoded-mtext">  Terms & condition</span>
                                    <span className="pcoded-mcaret"></span>
                                </a>
                            </li>

                            <li className="">
                                <a href={`${config.baseUrl}about`} >
                                    <span className="pcoded-micon"><i class="zmdi zmdi-spinner mr-20"></i></span>
                                    <span className="pcoded-mtext"> About</span>
                                    <span className="pcoded-mcaret"></span>
                                </a>
                            </li>

                            <li className="">
                                <a href={`${config.baseUrl}product_pricing`} >
                                    <span className="pcoded-micon"><i class="zmdi zmdi-spinner mr-20"></i></span>
                                    <span className="pcoded-mtext"> Product Pricing</span>
                                    <span className="pcoded-mcaret"></span>
                                </a>
                            </li>

                            <li className="">
                                <a href={`${config.baseUrl}refund_pricing`} >
                                    <span className="pcoded-micon"><i class="zmdi zmdi-spinner mr-20"></i></span>
                                    <span className="pcoded-mtext"> Refund Policy</span>
                                    <span className="pcoded-mcaret"></span>
                                </a>
                            </li>

                            {/* <li className="">
                                <Link to={`${config.baseUrl}bannerImage`} class="dropdown-item waves-light waves-effect">
                                    <span className="pcoded-micon"><i class="zmdi zmdi-spinner mr-20"></i></span>
                                    <span className="pcoded-mtext"> Banner Image </span>
                                    <span className="pcoded-mcaret"></span>
                                </Link>
                            </li> */}
                        </ul>

                    </li>
                    <li>
                        <a href={`${config.baseUrl}icons`}><div className="pull-left"><i className="zmdi  zmdi-image mr-20"></i><span className="right-nav-text">Slider/Logo</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    {/* <li>
                    <a href={`${config.baseUrl}realestateslider`}><div className="pull-left"><i className="zmdi  zmdi-image mr-20"></i><span className="right-nav-text">Real Estate Slider</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li> */}

                    <li>
                        <a href={`${config.baseUrl}subscribed`}><div className="pull-left"><i className="zmdi  zmdi-accounts-list mr-20"></i><span className="right-nav-text">Subscribed users</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                        <a href={`${config.baseUrl}contact`}><div className="pull-left"><i className="zmdi  zmdi-accounts-list mr-20"></i><span className="right-nav-text">Contacts</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                    <a href={`${config.baseUrl}wallet`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Wallet Setting</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li>
                    {/* <li>
                    <a href={`${config.baseUrl}user_bank_detail`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Bank Detail</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

					</li> */}
                    <li>
                        <a href={`${config.baseUrl}royalty`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Royalty Setting</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                        <a href={`${config.baseUrl}withdrawRequest`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Withdraw Request</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                        <a href={`${config.baseUrl}transactions`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Transactions</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    <li>
                        <a href={`${config.baseUrl}tokenManagement`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Token Management</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></a>

                    </li>

                    
                </ul>
            </div>
        )

    }
}