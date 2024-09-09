import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

export default class tokenManagement extends Component {

    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'));

        this.state = {
            getWalletDetailAPIData: '',
            rece_address: '',
            amount: '',
            to_address: '',
            token: '',
            getTokenDetailAPIData: ''
        }
        this.onChange = this.onChange.bind(this)
        this.coinTransfer = this.coinTransfer.bind(this)
    }


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessdigiphyNFTAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.getWalletDetailAPI();
        // this.getTokenDetailAPI()
    }



    async getWalletDetailAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getSettings`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': this.loginData?.data.user_email, 'user_id': this.loginData.data.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        getWalletDetailAPIData: result.data
                    })
                    this.getTokenDetailAPI()
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }


    async getTokenDetailAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getAdminTokenBalance`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'address': this.state.getWalletDetailAPIData?.public_key, 'contractAddress': config.tokenContract }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        getTokenDetailAPIData: result.data
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }


    async coinTransfer(event) {
        event.preventDefault();
        await axios({
            method: 'post',
            url: `${config.apiUrl}transferToken`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'to_address': this.state.to_address, 'token': this.state.token }
        })
            .then(result => {
                if (result.data.success === true) {
                    toast.success('Token Transfer successfully', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({
                        to_address: '',
                        token: ''
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });


    }



    render() {

        return (


            <>
                {/* <!-- /Preloader --> */}
                <div className="wrapper theme-6-active pimary-color-green">
                    <ToastContainer />
                    {/* <!-- Top Menu Items --> */}
                    <Header />
                    {/* <!-- /Top Menu Items --> */}

                    {/* <!-- Left Sidebar Menu --> */}
                    <Leftsidebar />
                    {/* <!-- /Left Sidebar Menu --> */}

                    {/* <!-- Right Sidebar Menu --> */}
                    <div className="page-wrapper" >
                        <div className="container-fluid pt-25">
                            <div className="row">
                                <div className="col-lg-12 col-md-7 col-sm-12 col-xs-12">
                                    <div className="panel panel-default card-view panel-refresh" style={{ background: "#0e0126", border: '1px solid #fff' }} id="wallet_card">
                                        <div className="refresh-container">
                                            <div className="la-anim-1"></div>
                                        </div>
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h4 className="panel-title txt-white"><strong>Token Management</strong></h4>
                                            </div>

                                            <div className="clearfix"></div>
                                        </div>


                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row pa-0">

                                                <div className="">
                                                    <div className='col-md-6'>
                                                        <p>
                                                            <b className="panel-title txt-white">Public key:</b>
                                                        </p><input disabled style={{ background: '#000' }} type="text" className="form-control" name="public_key" value={this.state.getWalletDetailAPIData?.public_key} /><br />
                                                    </div>
                                                </div>
                                            </div>
                                            <b>Token Balance:</b>
                                            <p>{this.state.getTokenDetailAPIData.data}</p>
                                        </div>
                                    </div>

                                    <div className="panel panel-default card-view panel-refresh" style={{ background: "#0e0126", border: '1px solid #fff' }} id="wallet_card">
                                        <div className="refresh-container">
                                            <div className="la-anim-1"></div>
                                        </div>
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h4 className="panel-title txt-white"><strong>Token Transfer</strong></h4>
                                            </div>

                                            <div className="clearfix"></div>
                                        </div>


                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row pa-0">

                                                <div className="">
                                                    <div className='col-md-6'>
                                                        <p>
                                                            <b className="panel-title txt-white">To Address:</b>
                                                        </p><input style={{ background: '#000' }} type="text" className="form-control" name="to_address" value={this.state.to_address}
                                                            onChange={this.onChange} /><br />
                                                    </div>

                                                    <div className='col-md-6'>
                                                        <p>
                                                            <b className="panel-title txt-white">Token:</b>
                                                        </p><input style={{ background: '#000' }} type="text" className="form-control" name="token" value={this.state.token}
                                                            onChange={this.onChange} /><br />
                                                    </div>
                                                </div>

                                                <button style={{ marginBottom: '25px', marginLeft: '20px' }} className="btn btn-primary update" onClick={this.coinTransfer}
                                                    disabled={!this.state.to_address || !this.state.token}>Update</button>
                                            </div>

                                        </div>
                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </>

        )

    }
}