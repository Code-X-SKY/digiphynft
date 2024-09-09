import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import login from './login';
import { data } from 'jquery';

export default class wallet extends Component {

    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'));
        this.state = {
            getWalletDetailAPIData: '',
            rece_address: '',
            amount: ''
        }
        this.receiveWalletUpdate = this.receiveWalletUpdate.bind(this)
        this.onChangeUpdate = this.onChangeUpdate.bind(this)
        this.onChange = this.onChange.bind(this)
        this.adminWalletUpdate = this.adminWalletUpdate.bind(this)
        this.updateFee = this.updateFee.bind(this)

    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessdigiphyNFTAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.getWalletDetailAPI();
    }

    onChangeUpdate = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getWalletDetailAPIData: { ...prevState.getWalletDetailAPIData, [event.target.name]: value }
        }))
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
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async receiveWalletUpdate(event) {
        event.preventDefault();
        await axios({
            method: 'post',
            url: `${config.apiUrl}receiveWalletUpdate`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': this.loginData?.data.user_email, 'receive_address': this.state.getWalletDetailAPIData?.receive_address }
        })
            .then(result => {
                if (result.data.success === true) {
                    toast.success('Wallet Addres Update successfully', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({
                        rece_address: '',
                        amount: ''
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });


    }

    async adminWalletUpdate(event) {
        event.preventDefault();
        await axios({
            method: 'post',
            url: `${config.apiUrl}adminWalletUpdate`,
            headers: { "Authorization": this.loginData?.Token },
            data: {
                'email': this.loginData?.data.user_email, 'public_key': this.state.getWalletDetailAPIData?.public_key,
                'private_key': this.state.getWalletDetailAPIData?.private_key, 'maxcoinpercentage': this.state.getWalletDetailAPIData?.maxcoinpercentage
            }
        })
            .then(result => {
                if (result.data.success === true) {
                    toast.success('Wallet Addres Update successfully', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({
                        rece_address: '',
                        amount: ''
                    })
                    setTimeout(() => {
                        window.location.reload()
                    }, 500);
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
                toast.error(err?.response?.data?.msg, {
                    position: toast.POSITION.TOP_CENTER
                });

            });


    }


    async updateFee(event) {
        event.preventDefault();
        await axios({
            method: 'post',
            url: `${config.apiUrl}updateFee`,
            headers: { "Authorization": this.loginData?.Token },
            data: {
                'email': this.loginData?.data.user_email, 'coin_value': this.state.getWalletDetailAPIData?.coin_value, 'maxcoinpercentage': this.state.getWalletDetailAPIData?.maxcoinpercentage
            }
        })
            .then(result => {
                if (result.data.success === true) {
                    toast.success('Update successfully', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({
                        rece_address: '',
                        amount: ''
                    })
                }
                else if (result.data.success === false) {
                }
                window.location.reload();
            }).catch(err => {
                toast.error(err?.response?.data?.msg, {
                    position: toast.POSITION.TOP_CENTER
                });

            });


    }

    async updatePlateformFee(event) {
        event.preventDefault();
            var data  ={
                email : this.loginData?.data.user_email,
                platform_fee : this.state.getWalletDetailAPIData.platform_fee
            }
        await axios({
            method: 'post',
            url: `${config.apiUrl}updatePlateformFee`,
            // headers: { "Authorization": this.loginData?.Token},
            data: data
        })
            .then(result => {
                if (result.data.success === true) {
                    toast.success('Update successfully', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({
                        rece_address: '',
                        amount: ''
                        // platform_fee :""
                    })
                }
                else if (result.data.success === false) {
                }
                window.location.reload();
            }).catch(err => {
                toast.error(err?.response?.data?.msg, {
                    position: toast.POSITION.TOP_CENTER
                });

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
                                                <h4 className="panel-title txt-white"><strong>Wallet Setting</strong></h4>
                                            </div>

                                            <div className="clearfix"></div>
                                        </div>


                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row pa-0">

                                                <div className="">
                                                    <div className='col-md-6'>
                                                        <p>
                                                            <b className="panel-title txt-white">Public key:</b>
                                                        </p><input type="text" className="form-control" name="public_key" value={this.state.getWalletDetailAPIData?.public_key}
                                                            onChange={this.onChangeUpdate} /><br />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <p><b className="panel-title txt-white">Private Key:</b> </p>
                                                        <input type="text" className="form-control" name="private_key" value={this.state.getWalletDetailAPIData?.private_key}
                                                            onChange={this.onChangeUpdate} /><br />
                                                    </div>
                                                    <button style={{ marginBottom: '25px', marginLeft: '20px' }} className="btn btn-primary update" onClick={this.adminWalletUpdate}
                                                        disabled={!this.state.getWalletDetailAPIData?.public_key || !this.state.getWalletDetailAPIData?.private_key}>Update</button>


                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel panel-default card-view panel-refresh" style={{ background: "#0e0126", border: '1px solid #fff' }} id="wallet_card">
                                        <div className="refresh-container">
                                            <div className="la-anim-1"></div>
                                        </div>
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h4 className="panel-title txt-white"><strong>Receive Address Setting</strong></h4>
                                            </div>

                                            <div className="clearfix"></div>
                                        </div>


                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row pa-0">

                                                <div className="">
                                                    <div className='col-md-6'>
                                                        <p>
                                                            <b className="panel-title txt-white">Receive Address:</b>
                                                        </p><input type="text" className="form-control" name="receive_address" value={this.state.getWalletDetailAPIData?.receive_address}
                                                            onChange={this.onChangeUpdate} /><br />
                                                    </div>

                                                    <button style={{ marginBottom: '25px', marginLeft: '20px', marginTop: '22px' }} className="btn btn-primary update" onClick={this.receiveWalletUpdate}
                                                        disabled={!this.state.getWalletDetailAPIData?.receive_address}>Update</button>


                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel panel-default card-view panel-refresh" style={{ background: "#0e0126", border: '1px solid #fff' }} id="wallet_card">
                                        <div className="refresh-container">
                                            <div className="la-anim-1"></div>
                                        </div>
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h4 className="panel-title txt-white"><strong>Fees:</strong></h4>
                                            </div>

                                            <div className="clearfix"></div>
                                        </div>


                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row pa-0">

                                                <div className="">
                                                    {/* <div className='col-md-6'>
                                                        <p>
                                                            <b className="panel-title txt-white">Minting Fees:</b>
                                                        </p><input type="text" className="form-control" style={{ background: '#fff' }} name="minting_fee" value={this.state.getWalletDetailAPIData?.minting_fee}
                                                            onChange={this.onChangeUpdate} /><br />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <p><b className="panel-title txt-white">Resale Fees:</b> </p>
                                                        <input type="text" className="form-control" style={{ background: '#fff' }} name="resale_charges" value={this.state.getWalletDetailAPIData?.resale_charges}
                                                            onChange={this.onChangeUpdate} /><br />
                                                    </div>

                                                    <div className='col-md-6'>
                                                        <p><b className="panel-title txt-white">Royalty Percentage:</b> </p>
                                                        <input type="text" className="form-control" style={{ background: '#fff' }} name="royalty_percent" value={this.state.getWalletDetailAPIData?.royalty_percent}
                                                            onChange={this.onChangeUpdate} /><br />
                                                    </div> */}

                                                    <div className='col-md-6'>
                                                        <p><b className="panel-title txt-white">coin value:</b> </p>
                                                        <input type="text" className="form-control" name="coin_value" value={this.state.getWalletDetailAPIData?.coin_value}
                                                            onChange={this.onChangeUpdate} /><br />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <p><b className="panel-title txt-white">Max Coin Percentage:</b> </p>
                                                        <input type="text" className="form-control" name="maxcoinpercentage" value={this.state.getWalletDetailAPIData?.maxcoinpercentage}
                                                            onChange={this.onChangeUpdate} /><br />
                                                    </div>
                                                    <button style={{ marginBottom: '20px', marginLeft: '16px' }} className="btn btn-primary update" onClick={this.updateFee}
                                                        disabled={!this.state.getWalletDetailAPIData?.coin_value}>Update</button>


                                                </div>


                                            </div>
                                        </div>



                                    </div>



                                    <div className="panel panel-default card-view panel-refresh" style={{ background: "#0e0126", border: '1px solid #fff' }} id="wallet_card">
                                        <div className="refresh-container">
                                            <div className="la-anim-1"></div>
                                        </div>
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h4 className="panel-title txt-white"><strong> Platform Fees:</strong></h4>
                                            </div>

                                            <div className="clearfix"></div>
                                        </div>


                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row pa-0">

                                                <div className="">


                                                    <div className='col-md-6'>
                                                        <p><b className="panel-title txt-white">Platform Fee:</b> </p>
                                                        <input type="text" className="form-control" name="platform_fee" value={this.state.getWalletDetailAPIData?.platform_fee}
                                                            onChange={this.onChangeUpdate} 
                                                            /><br /> 
                                                    </div>
                                                    {/* <div className='col-md-6'>
                                                        <p><b className="panel-title txt-white">Max Coin Percentage:</b> </p>
                                                        <input type="text" className="form-control" name="maxcoinpercentage" value={this.state.getWalletDetailAPIData?.maxcoinpercentage}
                                                            onChange={this.onChangeUpdate} /><br />
                                                    </div> */}
                                                </div>
                                                <div className='col-md-8'>
                                                    <button style={{ marginBottom: '20px', marginLeft: '16px' }} className="btn btn-primary update pull-right" onClick={this.updatePlateformFee.bind(this)}
                                                        disabled={!this.state.getWalletDetailAPIData?.platform_fee}>Update</button>
                                                </div>



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