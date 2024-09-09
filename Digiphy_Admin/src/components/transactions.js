import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
// import ReactDatatable from 'react-datatable';




export default class transactions extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            user_id: '',
            transaction_list: [],
            data: [],
            index: 0,
            transaction_sum: '',
            transaction_sum_bid: ''

        };
        this.loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'));
        // this.onChange = this.onChange.bind(this);

        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },
            {
                key: "item_name",
                text: "Nft name",
                sortable: true,
                cell: (item) => {
                    return (
                        <>
                            <a href={config.redirectUrl + `nftdetail/${item.item_edition_id}`}>{item.item_name}</a>
                        </>
                    )
                }
            },
            {
                key: "full_name",
                text: "full name",
                sortable: true
            },
            {
                key: "email",
                text: "email",
                sortable: true
            },

            {
                key: "transaction_type",
                text: "Transaction Type",
                sortable: true

            },
            {
                key: "amount",
                text: "Amount",
                sortable: true,
                cell: (item) => {
                    return (
                        <>
                            <span>INR {
                                item.transaction_type_id == 4 ?
                                    parseFloat(item.amount * -1).toFixed(6) : parseFloat(item.amount).toFixed(6)}</span>
                        </>
                    )
                }
            },

            {
                key: "transaction_date",
                text: "Transaction Date",
                sortable: true

            },




        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            }
        }


    }



    componentDidMount() {
        if (!Cookies.get('loginSuccessdigiphyNFTAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.transactionList();
        this.totalSumBid()
        this.totalSum()
    }

    async transactionList() {
        await axios.get(`${config.apiUrl}transactionDetailAll`, {},)
            .then(result => {
                const data = result.data;
                if (result.data.success === true) {
                    this.setState({
                        transaction_list: result.data.response,
                        pageCount: Math.ceil(data.length / this.state.perPage),
                    })
                }
                else if (result.data.success === false) {
                }
            })
            .catch(err => {
            })
    }

    async totalSum() {
        await axios.get(`${config.apiUrl}transactionTotalSum`, {},)
            .then(result => {
                const data = result.data;
                if (result.data.success === true) {
                    this.setState({
                        transaction_sum: result.data.response
                    })
                }
                else if (result.data.success === false) {
                }
            })
            .catch(err => {
            })
    }

    async totalSumBid() {
        await axios.get(`${config.apiUrl}transactionTotalBid`, {},)
            .then(result => {
                const data = result.data;
                if (result.data.success === true) {
                    this.setState({
                        transaction_sum_bid: result.data.response
                    })
                }
                else if (result.data.success === false) {
                }
            })
            .catch(err => {
            })
    }


    render() {

        return (

            <>

                <ToastContainer />
                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">

                    {/* <!-- Top Menu Items --> */}
                    <Header />
                    {/* <!-- /Top Menu Items --> */}

                    {/* <!-- Left Sidebar Menu --> */}
                    <Leftsidebar />

                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="">Transaction Details</h5>
                                </div>

                            </div>



                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="" id="royalty">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="form-wrap">
                                                    <form action="#">

                                                        {/* <hr className="light-grey-hr" /> */}
                                                        <div className="row">

                                                        </div>



                                                        <div className="form-actions">

                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">
                                                    <div class="table-responsive">
                                                        <div className='row'>
                                                            <div className='col-md-10'>

                                                            </div>

                                                            <div className='col-md-2' style={{ paddingBottom: '15px' }}>
                                                                <b className='text-white'>Total Amount: INR {this.state.transaction_sum.amount + this.state.transaction_sum_bid.amount}</b></div>

                                                        </div>
                                                        <ReactDatatable
                                                            config={this.config}
                                                            records={this.state.transaction_list}
                                                            columns={this.columns}
                                                        />

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            {/* <!-- /Row --> */}

                        </div>
                        {/* <!-- Footer --> */}
                        <Footer />
                        {/* <!-- /Footer --> */}

                    </div>
                    {/* <!-- /Main Content --> */}

                </div>
            </>


        )

    }
}
