import React, { Component } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'
import Modal from 'react-awesome-modal';
import ReactTooltip from 'react-tooltip';

import axios from 'axios';
import config from '../config/config'
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3';
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import Countdown, { zeroPad } from 'react-countdown';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
// To include the default styles
import ModalImage from "react-modal-image";
import ReactDatatable from '@ashvin27/react-datatable'
import Swal from 'sweetalert2'
import { Dialog } from "@blueprintjs/core";
import BarLoader from 'react-bar-loader'
import Loader from "react-loader-spinner";
import { CodeShimmer } from 'react-content-shimmer'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';

export default class nftdetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            checkout: false,
            cardmodel: false,
            value: '0',
            revealModel: false,
            getUsdBalance: '',
            getListItem: '',
            getRelatedItem: '',
            getImage1: '',
            loaderImage: 0,
            nodata: '',
            likeCount: '',
            propertiesData: [],
            getBidDetailData: [],
            purchased_quantity: '1',
            etherClickActive: 0,
            coinValue: '',
            checkView: false,
            maxCoinPerc: '',
            amount: 100,
            percentageList: 0,
            token_balance: 0,
            paymentType: 1,
            wallet_type: 1,
            liveCryptoPrice: [],
            formData: 0,
            curreny_sel: "ETH",
            from_address: '',
            isDialogOpen: false,
            bid_price: 0,
            getShippingAddress: '',
            isAllowForSale: true,
            adminpublicAddress: '',
            subpaymentType: false
        }
        this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))
        this.wallettypeAddress = localStorage.getItem('walletType')
        this.onChange = this.onChange.bind(this)
        this.openCheckout = this.openCheckout.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this)

        this.columns = [
            {
                key: "user_name",
                text: "Owner",
                cell: (item) => {
                    return (
                        <>
                            <Link className="weak mr-2 d-inlne-block" to={`${config.baseUrl}userprofile/${item.user_id}`}
                                target="_blank">
                                <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                    ? 'images/noimage.webp'
                                    :
                                    `${config.imageUrl1}${item.profile_pic}`} className="profile_picture x-small"
                                    style={{ height: '36px', width: '36px' }} alt="" />
                            </Link>
                            <div className="ml-1 mt-2 d-inline-block" style={{ maxWidth: '150px', overflowX: 'hidden', textOverflow: 'ellipsis', marginBottom: '-7px' }}>
                                <Link to={`${config.baseUrl}userprofile/${item.user_id}`} target="_blank" className="heavy strong" mptrackaction="product:activity:collector_name">
                                    {item.user_name ? item.user_name : item.email}
                                </Link>
                            </div>
                        </>
                    );
                }
            },
            {
                key: "transaction_type",
                text: "Activity",
                cell: (item) => {
                    return (
                        <div>

                            {item.transaction_type} INR {item.amount}
                        </div>
                    );
                }
            },
            {
                key: "edition_text",
                text: "Edition",

            },
            {
                key: "transaction_date",
                text: "Date",
                sortable: true,
                cell: (item) => {
                    return (
                        <div>
                            {item.transaction_date}
                        </div>
                    );
                }

            },
        ]

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

    handleChangeAddress = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getShippingAddress: { ...prevState.getShippingAddress, [event.target.name]: value }
        }))
    }

    openCheckout = async (id) => {
        let percentageListData = parseFloat(this.state.percentageList).toFixed(6)
        let tokenListData = parseFloat(this.state.token_balance).toFixed(6)
        if (parseFloat(percentageListData) > parseFloat(tokenListData)) {
            toast.error('insufficient token for transfer')
            this.setState({
                checkout: false
            })
            return false
        }
        if (this.state.getListItem?.sell_type == 2 && parseFloat(this.state.bid_price) <= parseFloat(this.state.getListItem?.max_bid)) {
            toast.error('Bid price should be greater than ' + this.state.getListItem?.max_bid)
            this.setState({
                checkout: false
            })
        }
        else {
            let options = {
                "key": config.razorPayId,
                "amount": id * 100, // 2000 paise = INR 20, amount in paisa
                "name": this.loginData?.data?.full_name,
                "description": "Purchase Description",
                "image": "/your_logo.png",
                handler: function (response) {
                    this.paymentShowAPI(response.razorpay_payment_id, id); //does not work as cannot identify 'this'
                }.bind(this),
                "prefill": {
                    "name": this.loginData?.data?.full_name,
                    "email": this.loginData?.data?.user_email
                },
                "notes": {
                    "address": "Hello World"
                },
                "theme": {
                    "color": "#F37254"
                }
            };
            let rzp = new window.Razorpay(options);
            rzp.open();
        }
    }

    //======================================  Item purchase  ================================================

    async paymentShowAPI(id, purchaseamount, id1, fee) {
        this.setState({
            loadingStripe: 1,
            loaderShow: true,
            isDialogOpen: true,
            checkout: false
        })
        await axios({
            method: 'post',
            url: `${config.apiUrl}itemPurchase`,
            headers: { "Authorization": this.loginData?.Token },
            data: {
                "email": this.loginData?.data?.user_email, "user_id": this.loginData?.data?.id,
                "amount": this.state.getListItem?.sell_type_name === 'Price' ?
                    parseFloat(parseFloat(purchaseamount).toFixed(6))
                    :
                    this.state.bid_price, "sell_type": this.state.getListItem?.sell_type_name,
                "item_edition_id": this.props.match.params.id,
                "item_id": this.state.getListItem?.item_id,
                "user_address": localStorage.getItem('walletType'),
                "purchased_quantity": parseInt(this.state.purchased_quantity),
                "token_owner_address": this.state.getListItem?.itemaddress,
                "coin_percentage": this.state.percentageList,
                "transferNft": 0,
                "gas_fee": fee
            }
        })
            .then(async response => {
                if (response.data.success) {
                    this.setState({
                        isDialogOpen: false,
                        checkout: false,
                    })
                    var willSearch = await Swal.fire({
                        title: 'Payment successful!',
                        text: 'Congratulations, you are successfully completed the payment.',
                        icon: 'success',
                        width: 500,
                        confirmButtonColor: '#3085d6',
                        allowOutsideClick: false,
                        confirmButtonText: 'View items',
                    });
                    window.location.href = `${config.baseUrl}purchasedetail`
                    Cookies.set('paymentFor', this.state.getListItem?.sell_type_name);
                    Cookies.set('purchase_item_id', response.data?.transaction_id)
                } else {
                    toast.error((!response.data.msg) ? 'Something went wrong! Please try again later.' : response.data.msg, {
                        position: toast.POSITION.TOP_CENTER,
                    })
                    this.setState({
                        isDialogOpen: false
                    })
                }
            }).catch(err => {
                this.setState({
                    errorMessageSripe: err?.response?.data?.msg,
                    loadingStripe: 0,
                    loaderShow: false,
                    isDialogOpen: false
                })
            });
    }

    //=======================================  Bid details  =====================

    async getBidDetailAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getMarketActivity`,
            data: { "item_id": this.state.getListItem.item_id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        getBidDetailData: result.data.response,
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }

    async getcheckeditionpurchaseAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}checkeditionpurchase`,
            data: { "item_edition_id": this.props.match.params.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        checkEdition: true,
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
                this.setState({
                    checkEdition: false
                })
            });
    }

    onChange = e => {
        if (e.target.name == 'percentageList') {
            if (e.target.value > (this.state.getListItem?.price * this.state.getListItem?.coin_percentage / 100) / this.state.coinValue) {
                this.setState({
                    maxToken: '1'
                })
            } else {
                this.setState({
                    maxToken: ''
                })
            }
        }
        this.setState({
            [e.target.name]: e.target.value,

        })
    }

    async getDigiCoin() {
        await axios({
            method: 'post',
            url: config.apiUrl + 'getSettings',
            data: { "email": "admin@digiphynft.io", "user_id": 1 }
        })
            .then(response => {
                if (response.data.success == true) {
                    this.setState({
                        adminpublicAddress: response.data.receive_address,
                        coinValue: response.data.coin_value
                    })
                }
            })
    }

    //=======================================  Item details  =====================

    async itemDetailsAPI() {
        this.setState({
            loaderImage: 0
        })
        await axios({
            method: 'post',
            url: `${config.apiUrl}itemdetail`,
            data: { "item_edition_id": this.props.match.params.id, 'user_id': this.loginData?.data?.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    let image_array = (!result.data.response.image_array) ? [] : JSON.parse(result.data.response.image_array);
                    let percentage = result.data.response?.coin_percentage;
                    let coinValue = (parseFloat(parseFloat(result.data.response?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2))
                    let percen = (parseFloat(coinValue * percentage) / 100)
                    this.setState({
                        maxCoinPerc: percen
                    })
                    this.setState({
                        getUsdBalance: result.data,
                        getListItem: result.data.response,
                        getRelatedItem: result.data.data,
                        getImage1: image_array,
                        loaderImage: 1,
                        nodata: 0,
                        propertiesData: result.data.propertiesData
                    })
                    let mainArr = [];
                    image_array.map(item => (
                        (item.file_type == 'image') ?
                            mainArr.push(`${config.imageUrl}${item.image}`)
                            : ''
                    ))
                    this.setState({
                        mainSliderImages: mainArr
                    })
                    this.getBidDetailAPI()
                    if (this.loginData?.data?.id !== this.state.getListItem?.user_id && this.state.checkView == false) {
                        this.itemViewsAPI()
                    }
                    this.getBlockchainDetailsForNFT.bind(this, {
                        current_owner: result?.data?.response?.current_owner,
                        token_id: result?.data?.response?.token_id,
                        isMinted: result?.data?.response?.isMinted,
                        isClaimed: result?.data?.response?.isClaimed,
                        contractAddress: result?.data?.response?.contractAddress
                    })
                }
                else if (result.data.success === false) {
                    this.setState({
                        loaderImage: 1
                    })
                }
            }).catch(err => {
                this.setState({
                    loaderImage: 1,
                    nodata: 1
                })
            });
    }


    setValue(val) {
        this.setState({
            value: val
        })
    }

    async itemViewsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}itemView`,
            data: { "item_edition_id": this.props.match.params.id, "user_id": this.loginData?.data?.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.itemDetailsAPI()
                    this.setState({
                        checkView: true,
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }

    componentDidMount() {
        this.itemDetailsAPI()
        this.getWalletDetailAPI()
        this.getBidDetailAPI()
        this.getDigiCoin()
        this.getShippingAddressAPI()
        this.getItemLikeCountsAPI()
        this.livePriceAPI()
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async getShippingAddressAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getshippingaddress`,
            data: { 'user_id': this.loginData.data?.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        getShippingAddress: result.data.data,
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }

    async getBlockchainDetailsForNFT(data) {
        if (data.isMinted == 1) {
            const web3 = new Web3();
            web3.setProvider(
                new web3.providers.HttpProvider(
                    config.RPC_URL
                )
            );
            const contract = await new web3.eth.Contract(config.abiMarketplace, data.contractAddress);
            let balance = await contract.methods.balanceOf(data.current_owner, data.token_id).call();
            if (balance == 0) {
                this.setState({
                    isAllowForSale: false
                })
            }
        }
    }


    async handlePayment(type, payamount) {
        if (type == 'BNB') {
            if (window.ethereum) {
                let web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                let currentNetwork = await web3.currentProvider.chainId
                web3.eth.defaultAccount = accounts[0];
                var from_address = accounts[0];
                if (from_address === undefined) {
                    toast.error("Please  connect to your wallet first");
                    this.setState({
                        checkout: false,
                        isDialogOpen: false
                    })
                    return
                }
                try {

                    if (currentNetwork != web3.utils.toHex(config.BNBChainId)) {
                        toast.error(config.chainMessageBNB);
                        this.setState({
                            checkout: false
                        })
                        return false;
                    }
                    var chainId = config.BNBChainId;
                    var to_address = this.state.adminpublicAddress;
                    var trx_amount = parseInt(payamount);
                    var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
                    var currentBal = parseFloat(getBalace).toFixed(6)
                    trx_amount = parseFloat((trx_amount / this.state.liveCryptoPrice[1].current_price)).toFixed(8)
                    if (this.state.getListItem?.sell_type == 2 && parseFloat(this.state.bid_price) <= parseFloat(this.state.getListItem?.max_bid)) {
                        toast.error('Bid price should be greater than ' + this.state.getListItem?.max_bid)
                        this.setState({
                            checkout: false,
                            isDialogOpen: false
                        })
                        return false
                    }
                    if (currentBal < trx_amount) {
                        toast.error(`Insufficient fund for transfer`);

                        this.setState({
                            checkout: false,
                            isDialogOpen: false
                        })
                        return false;
                    }
                    let percentageListData = parseFloat(this.state.percentageList).toFixed(6)
                    const contract = await new web3.eth.Contract(config.DGB_ABI, config.DGB_Token);
                    let decimals = await contract.methods.decimals().call();
                    decimals = parseInt(decimals);
                    percentageListData = parseFloat(percentageListData) * (10 ** decimals);
                    percentageListData = percentageListData.toLocaleString('fullwide', { useGrouping: false });
                    var getMetaBalace = await contract.methods.balanceOf(from_address).call();
                    let tokenListData = parseFloat(getMetaBalace).toFixed(6)  //metamask
                    if (parseFloat(percentageListData) > parseFloat(tokenListData)) {
                        toast.error(`Insufficient Token for transfer`);
                        this.setState({
                            checkout: false,
                            isDialogOpen: false
                        })
                        return false;
                    }
                    this.setState({
                        checkout: false,
                        isDialogOpen: true
                    })
                    trx_amount = (trx_amount * 10 ** 18).toString()
                    let gasPrice = await web3.eth.getGasPrice();
                    let gasLimit = await web3.eth.estimateGas({
                        gasPrice: web3.utils.toHex(gasPrice),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                    });
                    let fee = (parseFloat(gasPrice) * parseFloat(gasLimit) / 10 ** 18).toFixed(6)

                    const txData = await web3.eth.sendTransaction({
                        gasPrice: web3.utils.toHex(gasPrice),
                        gas: web3.utils.toHex(gasLimit),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                    });

                    let txData1;
                    if (percentageListData > 0) {
                        let trx = await contract.methods.transfer(to_address, percentageListData);
                        let encodeData = trx.encodeABI();
                        let gasPrice1 = await web3.eth.getGasPrice();
                        let gasLimit1 = await web3.eth.estimateGas({
                            gasPrice: web3.utils.toHex(gasPrice1),
                            to: config.DGB_Token,
                            from: from_address,
                            data: encodeData,
                        });
                        txData1 = await web3.eth.sendTransaction({
                            gasPrice: web3.utils.toHex(gasPrice1),
                            gas: web3.utils.toHex(gasLimit1),
                            to: config.DGB_Token,
                            from: from_address,
                            data: encodeData,
                        });
                    }

                    if (txData.transactionHash) {
                        let data = {
                            'from_address': from_address,
                            'hash': txData.transactionHash,
                            'token_hash': txData1?.transactionHash
                        }
                        this.paymentShowAPI(txData.transactionHash, payamount, txData1?.transactionHash, fee)
                    }
                } catch (error) {
                    toast.error(`Something went wrong! Please try again.`, {
                    });
                    this.setState({
                        checkout: false,
                        isDialogOpen: false
                    })
                    return false;
                }
            }
            else {
                toast.error(`Please connect your MetaMask wallet!`);
                this.setState({
                    isDialogOpen: false,
                    checkout: false,
                })
                return false;
            }
        }

        else if (type == 'ETH') {
            if (window.ethereum) {
                var web3 = '';
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                let currentNetwork = await web3.currentProvider.chainId;
                web3.eth.defaultAccount = accounts[0];
                var from_address = accounts[0];
                if (from_address === undefined) {
                    toast.error("Please  connect to your wallet first");
                    this.setState({
                        checkout: false,
                        isDialogOpen: false

                    })
                    return
                }
                try {
                    if (currentNetwork != web3.utils.toHex(config.ETHChainId)) {
                        toast.error(config.chainMessageETH);
                        this.setState({
                            checkout: false
                        })
                        return false;
                    }
                    var chainId = config.ETHChainId;
                    var to_address = this.state.adminpublicAddress;
                    var trx_amount = parseInt(payamount);
                    var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
                    var currentBal = parseFloat(getBalace).toFixed(6)
                    this.setState({
                        checkout: false,
                        isDialogOpen: true
                    })
                    trx_amount = parseFloat((trx_amount / this.state.liveCryptoPrice[0].current_price)).toFixed(8)
                    if (this.state.getListItem?.sell_type == 2 && parseFloat(this.state.bid_price) <= parseFloat(this.state.getListItem?.max_bid)) {
                        toast.error('Bid price should be greater than ' + this.state.getListItem?.max_bid)
                        this.setState({
                            checkout: false,
                            isDialogOpen: false
                        })
                        return false
                    }
                    if (currentBal < trx_amount) {
                        toast.error(`Insufficient fund for transfer`);
                        this.setState({
                            checkout: false,
                            isDialogOpen: false
                        })

                        return false;
                    }
                    let percentageListData = parseFloat(this.state.percentageList).toFixed(6)
                    const contract = await new web3.eth.Contract(config.DGB_ABI, config.DGB_Token);
                    let decimals = await contract.methods.decimals().call();
                    decimals = parseInt(decimals);
                    percentageListData = parseFloat(percentageListData) * (10 ** decimals);
                    percentageListData = percentageListData.toLocaleString('fullwide', { useGrouping: false });
                    var getMetaBalace = await contract.methods.balanceOf(from_address).call();
                    let tokenListData = parseFloat(getMetaBalace).toFixed(6)  //metamask
                    if (parseFloat(percentageListData) > parseFloat(tokenListData)) {
                        toast.error(`Insufficient Token for transfer`);
                        this.setState({
                            checkout: false,
                            isDialogOpen: false
                        })
                        return false;
                    }
                    if (parseFloat(percentageListData) > parseFloat(tokenListData)) {
                        toast.error(`Insufficient Token for transfer`);
                        this.setState({
                            checkout: false,
                            isDialogOpen: false
                        })
                        return false;
                    }

                    this.setState({
                        checkout: false,
                        isDialogOpen: true
                    })

                    trx_amount = (trx_amount * 10 ** 18).toString()

                    let gasPrice = await web3.eth.getGasPrice();
                    let gasLimit = await web3.eth.estimateGas({
                        gasPrice: web3.utils.toHex(gasPrice),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                    });

                    let fee = (parseFloat(gasPrice) * parseFloat(gasLimit) / 10 ** 18).toFixed(6)


                    const txData = await web3.eth.sendTransaction({
                        gasPrice: web3.utils.toHex(gasPrice),
                        gas: web3.utils.toHex(gasLimit),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                    });

                    let txData1;
                    if (percentageListData > 0) {
                        let trx = await contract.methods.transfer(to_address, percentageListData);

                        let encodeData = trx.encodeABI();
                        let gasPrice1 = await web3.eth.getGasPrice();

                        let gasLimit1 = await web3.eth.estimateGas({
                            gasPrice: web3.utils.toHex(gasPrice1),
                            to: config.DGB_Token,
                            from: from_address,
                            data: encodeData,
                        });
                        txData1 = await web3.eth.sendTransaction({
                            gasPrice: web3.utils.toHex(gasPrice1),
                            gas: web3.utils.toHex(gasLimit1),
                            to: config.DGB_Token,
                            from: from_address,
                            data: encodeData,
                        });
                    }
                    if (txData.transactionHash) {
                        let data = {
                            'from_address': from_address,
                            'hash': txData.transactionHash
                        }
                        this.paymentShowAPI(txData.transactionHash, payamount, txData1?.transactionHash, fee)
                    }

                } catch (error) {
                    toast.error(`Something went wrong! Please try again.`, {

                    });
                    this.setState({
                        isDialogOpen: false,
                        checkout: false
                    })

                    return false;
                }
            }
            else {
                toast.error(`Please connect your MetaMask wallet!`, {

                });
                this.setState({
                    isDialogOpen: false,
                    checkout: false
                })
                return false;
            }
        }
        else if (type == 'MATIC') {

            if (window.ethereum) {
                var web3 = '';
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                let currentNetwork = await web3.currentProvider.chainId;

                web3.eth.defaultAccount = accounts[0];

                this.setState({
                    from_address: accounts[0]
                })
                var from_address = accounts[0];
                if (from_address === undefined) {
                    toast.error("Please  connect to your wallet first");
                    this.setState({
                        checkout: false,
                        isDialogOpen: false

                    })
                    return;
                }
                try {

                    if (currentNetwork != web3.utils.toHex(config.chainId)) {
                        toast.error(config.chainMessage);
                        this.setState({
                            checkout: false,
                            isDialogOpen: false

                        })
                        return false;
                    }
                    var chainId = config.chainId;
                    var to_address = this.state.adminpublicAddress;
                    var trx_amount = parseInt(payamount);
                    var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
                    var currentBal = parseFloat(getBalace).toFixed(6)
                    trx_amount = parseFloat((trx_amount / this.state.liveCryptoPrice[2].current_price)).toFixed(8)
                    this.setState({
                        checkout: false,
                        isDialogOpen: true
                    })
                    if (this.state.getListItem?.sell_type == 2 && parseFloat(this.state.bid_price) <= parseFloat(this.state.getListItem?.max_bid)) {
                        toast.error('Bid price should be greater than ' + this.state.getListItem?.max_bid)
                        this.setState({
                            checkout: false,
                            isDialogOpen: false
                        })
                        return false
                    }
                    if (currentBal < trx_amount) {
                        toast.error(`Insufficient fund for transfer`);
                        this.setState({
                            checkout: false,
                            isDialogOpen: false

                        })
                        return false;
                    }
                    let percentageListData = parseFloat(this.state.percentageList).toFixed(6)
                    const contract = await new web3.eth.Contract(config.DGB_ABI, config.DGB_Token);
                    let decimals = await contract.methods.decimals().call();
                    decimals = parseInt(decimals);
                    percentageListData = parseFloat(percentageListData) * (10 ** decimals);
                    percentageListData = percentageListData.toLocaleString('fullwide', { useGrouping: false });
                    var getMetaBalace = await contract.methods.balanceOf(from_address).call();
                    let tokenListData = parseFloat(getMetaBalace).toFixed(6)  //metamas
                    if (parseFloat(percentageListData) > parseFloat(tokenListData)) {
                        toast.error(`Insufficient Token for transfer`);
                        this.setState({
                            checkout: false,
                            isDialogOpen: false
                        })
                        return false;
                    }
                    trx_amount = (trx_amount * 10 ** 18).toString()
                    let gasPrice = await web3.eth.getGasPrice();
                    let gasLimit = await web3.eth.estimateGas({
                        gasPrice: web3.utils.toHex(gasPrice),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                    });
                    let fee = (parseFloat(gasPrice) * parseFloat(gasLimit) / 10 ** 18).toFixed(6)
                    let txData1;
                    const txData = await web3.eth.sendTransaction({
                        gasPrice: web3.utils.toHex(gasPrice),
                        gas: web3.utils.toHex(gasLimit),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                    });
                    if (percentageListData > 0) {
                        let trx = await contract.methods.transfer(to_address, percentageListData);
                        let encodeData = trx.encodeABI();
                        let gasPrice1 = await web3.eth.getGasPrice();
                        let gasLimit1 = await web3.eth.estimateGas({
                            gasPrice: web3.utils.toHex(gasPrice1),
                            to: config.DGB_Token,
                            from: from_address,
                            data: encodeData,
                        });
                        txData1 = await web3.eth.sendTransaction({
                            gasPrice: web3.utils.toHex(gasPrice1),
                            gas: web3.utils.toHex(gasLimit1),
                            to: config.DGB_Token,
                            from: from_address,
                            data: encodeData,
                        });
                    }

                    if (txData.transactionHash) {
                        this.paymentShowAPI(txData.transactionHash, payamount, txData1?.transactionHash, fee)
                    }

                } catch (error) {
                    toast.error(`Something went wrong! Please try again.`, {
                    });
                    this.setState({
                        checkout: false,
                        isDialogOpen: false
                    })
                    return false;
                }
            }
            else {
                toast.error(`Please connect your MetaMask wallet!`, {
                });
                this.setState({
                    isDialogOpen: false,
                    checkout: false
                })
                return false;
            }
        }
    };

    async getWalletDetailAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getWalletDetail`,
            headers: { "Authorization": this.loginData?.Token },
            data: { "email": this.loginData?.data?.user_email, 'user_id': this.loginData?.data?.id }
        })
            .then(result => {
                if (result.data.success === true) {

                    this.setState({
                        token_balance: result.data.token_balance
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }

    openModal2() {
        this.getcheckeditionpurchaseAPI()
        setTimeout(() => {
            if (this.state.checkEdition == true) {
                toast.error("This NFT Edition is already bought by another user")
                this.setState({
                    checkout: false
                });
                setTimeout(() => {
                    window.location.href = config.baseUrl + 'marketplace'
                }, 500);
            } else {
                this.setState({
                    checkout: true
                });
            }
        }, 1000);

    }
    openModal3() {
        this.setState({
            cardmodel: true,
            checkout: false
        });
    }

    closeModal() {
        this.setState({
            checkout: false,
            cardmodel: false
        });
    }
    openModal4() {
        this.setState({
            revealModel: true,

        });
    }

    closeModal4() {
        this.setState({

            revealModel: false
        });
    }

    //=======================================  Like/dislike  =====================

    async likeAPI() {
        if (this.loginData?.length === 0) {
            window.location.href = `${config.baseUrl}login`
        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}likeItem`,
            data: { "item_edition_id": this.props.match.params.id, user_id: this.loginData?.data?.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.getItemLikeCountsAPI()
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }

    //=======================================  Like details  =====================

    async getItemLikeCountsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getItemLikeCount`,
            data: { "item_edition_id": this.props.match.params.id, "user_id": this.loginData?.data?.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        likeCount: result.data.response
                    })

                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }

    getTimeOfStartDate(dateTime) {
        var date = new Date(dateTime); // some mock date
        var milliseconds = date.getTime();
        return milliseconds;
    }

    CountdownTimer({ days, hours, minutes, seconds, completed }) {
        if (completed) {
            return "Starting";
        } else {
            var dayPrint = (days > 0) ? days + 'd' : '';
            return <span>{dayPrint} {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s</span>;
        }
    };


    plusQuantity() {

        var qty = parseInt(this.state.purchased_quantity) + parseInt(1)
        this.setState({
            'purchased_quantity': qty
        })

        if (qty > this.state.getListItem.available_quantity) {
            this.setState({
                errorAvailable: '1'
            })

        }
        else if (qty === '0' || qty === '') {
            this.setState({
                errorAvailable: '2'
            })

        }
        else {
            this.setState({
                errorAvailable: '0'
            })
        }
    }


    minusQuantity() {
        var qty = parseInt(this.state.purchased_quantity) - parseInt(1)
        if (this.state.purchased_quantity > 1) {
            this.setState({
                'purchased_quantity': qty
            })
        }


        if (qty > this.state.getListItem.available_quantity) {
            this.setState({
                errorAvailable: '1'
            })

        }
        else if (qty === '0' || qty === '') {
            this.setState({
                errorAvailable: '2'
            })

        }
        else {
            this.setState({
                errorAvailable: '0'
            })
        }
    }


    //======================================  Card and ether popup dynamic through state =================

    etherClick(id) {
        if (id === 'cc') {
            this.setState({
                etherClickActive: 0,
                bid_price: '',
                purchased_quantity: '1',
                errorAvailable: '0'
            })
        }
        else if (id === 'Ether') {
            this.setState({
                etherClickActive: 1,
                bid_price: '',
                purchased_quantity: '1',
                errorAvailable: '0'
            })
        }
        else if (id === 'ccc') {
            this.setState({
                etherClickActive: 2,
                bid_price: '',
                purchased_quantity: '1',
                errorAvailable: '0'
            })
        }
    }

    changesubPaymentType(type) {

        this.setState({
            subpaymentType: type,
        })
    }

    changePaymentType(type) {

        this.setState({
            paymentType: type,
        })
    }


    livePriceAPI = async () => {
        await axios({
            method: 'get',
            url: ' https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&ids=ethereum,binancecoin,matic-network&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        })
            .then(response => {
                this.setState({
                    liveCryptoPrice: response.data
                })
            })
    }

    checkLogin() {
        toast.error(`To ${this.state.getListItem.sell_type == 1 ? 'Buy' : 'Bid'} an item you have to login first!`)
    }
    targetData(item) {
        window.open(
            config.imageUrl + item.image,
            '_blank' // <- This is what makes it open in a new window.
        );
    }
    render() {
        return (

            <>
                <Header />
                {this.state.loaderImage === 0 ?
                    <div className="row _post-container_" style={{ height: '366px', marginTop: '260px' }}>
                        <div className="caroselHeight loaderBars">
                            <Loader type="Bars" color="#00BFFF" height={40} width={40} />
                        </div>
                    </div> :
                    <>
                        <div id="content-block" className='mt-0'>
                            <Dialog
                                title="Please Wait..."

                                style={{
                                    color: '#3fa1f3',
                                    textAlign: "center"
                                }}
                                isOpen={this.state.isDialogOpen}
                                isCloseButtonShown={false}
                            >
                                <div className="text-center pl-3 pr-3">
                                    <BarLoader color="#e84747" height="2" />
                                    <br />
                                    <p style={{ color: '#091f3f' }}>
                                        Please do not refresh page or close tab.
                                    </p>
                                    <div>
                                        <div className="spinner-border"></div>
                                    </div>
                                </div>
                            </Dialog>

                            <div className="breadcrumb-wrap bg-f br-3">
                                <div className="overlay bg-black op-7" />
                                <div className="container">
                                    <div className="breadcrumb-title">
                                        <h2>NFT Details</h2>
                                        <ul className="breadcrumb-menu list-style">
                                            <li>
                                                <a href={`${config.baseUrl}`}>Home </a>
                                            </li>
                                            <li>NFT Details</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <section className="recent-nfts ptb-60 pb-5">
                                <div className="container-fluid custom-container">
                                    <div className="Toastify" />

                                    <div className="container">
                                        <div className="row">
                                            <div className='col-md-6 detail-video'>
                                                {this.state.getListItem?.image === undefined || this.state.getListItem?.image === '' || this.state.getListItem?.image === null ? '' :
                                                    this.state.getListItem?.file_type === 'image' ?

                                                        <ModalImage
                                                            small={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                            large={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                            medium={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                            width="100%" className='nftdetailimage'
                                                            showRotate
                                                            imageBackgroundColor
                                                        />

                                                        :
                                                        this.state.getListItem?.file_type === 'video' ?
                                                            <Link to="#">
                                                                {/* 
                                                                <Player src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='nftdetailimage' /> */}
                                                                <div onClick={this.targetData.bind(this, this.state.getListItem)}>
                                                                    <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                </div>
                                                            </Link> :

                                                            this.state.getListItem?.file_type === 'audio' ?
                                                                <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">
                                                                    <ReactAudioPlayer
                                                                        src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='nftdetailimage'

                                                                        controls
                                                                    />
                                                                </Link> : ''

                                                }


                                            </div>
                                            <div className='col-md-6'>
                                                <div className="item_info">
                                                    <h2 className="mt-0">{this.state.getListItem.name}</h2>
                                                    <h5>No of Copies : {this.state.getListItem.edition_text}</h5>
                                                    <br />
                                                    <div className="item_info_counts">
                                                        <div className="item_info_type">
                                                            <i className="fa fa-image" />
                                                            {this.state.getListItem.category_name}
                                                        </div>
                                                        <div className="item_info_views">
                                                            <i className="fa fa-eye" />
                                                            {this.state.getListItem.view_count}
                                                        </div>
                                                        <div className="item_info_like">
                                                            <span onClick={this.likeAPI.bind(this)}>

                                                                <i className="fa fa-heart" style={{ color: this.state.likeCount?.is_liked == 0 ? '' : 'red' }}></i> {this.state.likeCount?.count}</span>


                                                        </div>
                                                        <p>{this.state.getListItem.nft_type == 1 ? 'Digital NFT' : this.state.getListItem.nft_type == 2 ? 'Physical NFT' : ''}</p>

                                                        <p style={{ marginLeft: '40px' }}><a href={config.imageUrl + this.state.getListItem?.image} target="_blank">View on IPFS</a></p>
                                                    </div>

                                                    <div className="row mt-4">
                                                        <div className="col-lg-4 col-md-4 mt-5">
                                                            <h6>Creator</h6>
                                                            <Link to={`${config.baseUrl}userprofile/${this.state.getListItem.created_by}`}>
                                                                <div className="item_author">
                                                                    <div className="author_list_pp">
                                                                        <img
                                                                            className="lazy"
                                                                            src={this.state.getListItem.creator_profile_pic ? config.imageUrl1 + this.state.getListItem.creator_profile_pic : "images/noimage.webp"}
                                                                        />
                                                                    </div>
                                                                    <div className="author_list_info">{this.state.getListItem.creator}</div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 mt-5">
                                                            <h6>Owner</h6>
                                                            <Link to={`${config.baseUrl}userprofile/${this.state.getListItem.owner_id}`}>
                                                                <div className="item_author">
                                                                    <div className="author_list_pp">
                                                                        <img
                                                                            className="lazy"
                                                                            src={this.state.getListItem.owner_profile_pic ? config.imageUrl1 + this.state.getListItem.owner_profile_pic : "images/noimage.webp"}
                                                                        />
                                                                    </div>
                                                                    <div className="author_list_info">{this.state.getListItem.owner}</div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                        <div className="col-lg-4 col-md-4 mt-5">
                                                            <h6>Collection</h6>
                                                            <Link to={`${config.baseUrl}collectiondetail/${this.state.getListItem.user_collection_name}`}>
                                                                <div className="item_author">
                                                                    <div className="author_list_pp">
                                                                        <img
                                                                            className="lazy"
                                                                            src={this.state.getListItem.user_collection_pic ? config.imageUrl1 + this.state.getListItem.user_collection_pic : "images/noimage.webp"}
                                                                        />
                                                                    </div>
                                                                    <div className="author_list_info">{this.state.getListItem.user_collection_name}</div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    {this.state.getListItem?.unlockable_content == '' ? '' :
                                                        <div className="row mt-4">
                                                            <div className="col-lg-12 mt-3 col-md-12">
                                                                <button type="button" onClick={this.openModal4.bind(this)} className='reveal mt-4'><i className="fa fa-lock"></i>
                                                                    Reveal unlockable content
                                                                </button>
                                                            </div>

                                                        </div>
                                                    }

                                                    <div className="spacer-40" />
                                                    <div className="de_tab tab_simple">

                                                        <h6 className='mb-0 mt-5'>Price</h6>
                                                        <div className="nft-item-price">
                                                            <img src="images/bnb-icon.png" />
                                                            <span>INR {this.state.getListItem.price}</span>

                                                        </div>
                                                        {this.state.getListItem?.sell_type == 2 ?
                                                            <>
                                                                <h6 className='mb-0'>Sale Ends in</h6>
                                                                <div className="nft-item-price">

                                                                    <span> <Countdown
                                                                        date={this.getTimeOfStartDate(this.state.getListItem?.expiry_date1)}
                                                                        renderer={this.CountdownTimer}
                                                                    /></span>

                                                                </div></> : ''
                                                        }

                                                        {!this.state.isAllowForSale ?
                                                            <>
                                                                <h6>Item not available for sale</h6>
                                                                <ul>
                                                                    <li>This NFT is not available in the current owner wallet, The owner may have sold it at another market place.</li>
                                                                </ul>
                                                            </>
                                                            :
                                                            this.loginData?.data?.id == this.state.getListItem?.owner_id && this.state?.aa ?


                                                                <button className="btn btn-main btn-lg mb-3" disabled>
                                                                    {this.state.getListItem?.sell_type == 1 ? 'Buy now' : 'Place Bid'}
                                                                </button>
                                                                :
                                                                this.state.getListItem?.owner_id == this.loginData?.data?.id ? <a
                                                                    href="javascript:void(0);"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#walletModel">
                                                                </a>
                                                                    : <a
                                                                        href="javascript:void(0);"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#walletModel"
                                                                        onClick={() => this.loginData?.data?.id ? this.openModal2() : this.checkLogin()}
                                                                    >


                                                                        <button className="btn btn-main btn-lg mb-3" disabled={this.state.getListItem?.owner_id == this.loginData?.data?.id ? true : false} >
                                                                            {this.state.getListItem.sell_type == 1 ? 'Buy now' : 'Place Bid'}
                                                                        </button>
                                                                    </a>}

                                                        &nbsp;&nbsp;
                                                        {this.state.getListItem?.token_hash === null || this.state.getListItem?.token_hash === undefined || this.state.getListItem?.token_hash === '' ? ''
                                                            :
                                                            <>
                                                                <a
                                                                    href="javascript:void(0);"

                                                                >
                                                                    <button className="btn btn-main btn-lg mb-3"><a style={{ color: '#fff' }} href={this.state.getListItem?.token_hash} target="_blank">Blockchain View</a></button>
                                                                </a>
                                                            </>

                                                        }


                                                        {this.loginData?.data?.id == this.state.getListItem.owner_id ?
                                                            <>
                                                                <span className='tooltip-small'>
                                                                    <i style={{ fontSize: '25px' }} className="fa fa-info-circle" data-tip={'You are the owner of this NFT.'} aria-hidden="true"></i>
                                                                    <ReactTooltip />
                                                                </span>
                                                            </> : ''
                                                        }

                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </section>

                            <section className=''>
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col-md-6 col-xs-12 mb-4'>
                                            <div className='accordianlist'>
                                                <button className='accordion_button'>
                                                    <img src='images/description.png' width="30" />&nbsp;&nbsp;Description
                                                </button>
                                                <div className='panel-body'>
                                                    <div>
                                                        Created by  <Link to={`${config.baseUrl}userprofile/${this.state.getListItem.created_by}`}><span>{this.state.getListItem.creator}</span></Link>
                                                        <br />
                                                        <p style={{ marginTop: '15px' }}> {this.state.getListItem.description}</p>
                                                    </div>
                                                </div>
                                                <Accordion >
                                                    {this.state.propertiesData.length == 0 ? '' :
                                                        <AccordionItem>
                                                            <AccordionItemHeading>
                                                                <AccordionItemButton>
                                                                    <img src='images/properties.png' width="30" />&nbsp;&nbsp;Properties
                                                                </AccordionItemButton>
                                                            </AccordionItemHeading>
                                                            <AccordionItemPanel>
                                                                <a href="javascript:void(0)" className="fpieog">

                                                                    <div className='row'>
                                                                        {this.state.propertiesData.map(item => (
                                                                            <div className='col-md-4'>

                                                                                <div className="item-property" style={{ cursor: 'alias' }} >
                                                                                    <>

                                                                                        <div className="Property-type">{item.type}</div>
                                                                                        <div className="Property-value" >{item.value}</div>
                                                                                    </>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </a>
                                                            </AccordionItemPanel>
                                                        </AccordionItem>
                                                    }

                                                    <AccordionItem>
                                                        <AccordionItemHeading>
                                                            <AccordionItemButton>
                                                                <img src='images/aboutsupermaskman.png' width="30" />&nbsp;&nbsp;About {this.state.getListItem?.user_collection_name}
                                                            </AccordionItemButton>
                                                        </AccordionItemHeading>
                                                        <AccordionItemPanel>
                                                            <div className="item-about-container-collection">
                                                                <Link to={`${config.baseUrl}collectiondetail/${this.state.getListItem.user_collection_id}`}>
                                                                    <div className="item-about-image-collection" style={{ height: '100%', width: '80px' }}>
                                                                        <img alt="" className="item-image" src={this.state.getListItem.user_collection_pic ? config.imageUrl1 + this.state.getListItem.user_collection_pic : "images/noimage.webp"} style={{ objectFit: "cover" }} />
                                                                    </div>
                                                                </Link>
                                                                <span className='collection-details text-white'>{this.state.getListItem?.user_collection_description}</span>
                                                            </div>
                                                        </AccordionItemPanel>
                                                    </AccordionItem>
                                                    <AccordionItem>
                                                        <AccordionItemHeading>
                                                            <AccordionItemButton>
                                                                <img src='images/details.png' width="30" />&nbsp;&nbsp;Details
                                                            </AccordionItemButton>
                                                        </AccordionItemHeading>
                                                        <AccordionItemPanel>
                                                            <div className='detailslist'>
                                                                <table className='table'>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>Contract Address</td>
                                                                            <td><a href={`https://polygonscan.com/token/${this.state.getListItem?.contractAddress}`} target='_blank'>
                                                                                {this.state.getListItem?.contractAddress?.toString().substring(0, 8) + '...' + this.state.getListItem?.contractAddress?.toString().substr(config.marketplaceContract.length - 8)}
                                                                            </a></td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td>Token ID</td>
                                                                            <td>{this.state.getListItem.token_id}</td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td>Token Standard</td>
                                                                            <td>ERC-1155</td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td>Blockchain</td>
                                                                            <td>Polygon</td>

                                                                        </tr>

                                                                    </tbody>

                                                                </table>
                                                            </div>
                                                        </AccordionItemPanel>
                                                    </AccordionItem>
                                                </Accordion>

                                            </div>

                                        </div>

                                        <div className='col-md-6 col-xs-12'>
                                            <h4 className='mb-3 text-white'>Item Activity</h4>
                                            <div className='tablelist'>
                                                <ReactDatatable
                                                    config={this.config}
                                                    records={this.state.getBidDetailData}
                                                    columns={this.columns} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </section>
                            <br /><br />
                            <br /><br />
                        </div>
                    </>
                }

                <Modal visible={this.state.checkout} width="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className='header_modal offer_method connect_wallet'>
                        <div className='modal-header text-right d-flex pt-3 pb-2'>
                            <h1 className="ant-typography title">Offer Method</h1>
                            <button className='close mt-1' onClick={() => this.closeModal()}><span>x</span></button>
                        </div>
                        <div className="nav-tab  clearfix" style={{ display: 'flex' }}>
                            <div className={this.state.etherClickActive == 0 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'cc')}>
                                <span>Razor Pay</span>
                            </div>
                            <div className={this.state.etherClickActive == 1 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'Ether')}>
                                <span className="text-black">Crypto</span>
                            </div>
                        </div>
                        <div className='modal-body text-left p-5'>
                            <div className={this.state.etherClickActive == 0 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 0 ? 'block' : 'none' }}>
                                <div className='checkout'>
                                    <div className='row align-items-center'>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Item

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div className="checklist">
                                                <ul>
                                                    <li>{this.state.getListItem?.name} </li>
                                                    <li>
                                                        {this.state.getListItem?.image === undefined || this.state.getListItem?.image === '' || this.state.getListItem?.image === null ? '' :
                                                            this.state.getListItem?.file_type === 'image' ?
                                                                <ModalImage
                                                                    small={`${config.imageUrl}${this.state.getListItem?.image}`}
                                                                    large={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                                    medium={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                                    width="100%" className='productimage'
                                                                    showRotate
                                                                    imageBackgroundColor
                                                                />
                                                                :
                                                                this.state.getListItem?.file_type === 'video' ?
                                                                    <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">

                                                                        {/* <Player src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='productimage' /> */}
                                                                        <div onClick={this.targetData.bind(this, this.state.getListItem)}>
                                                                            <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                        </div>
                                                                    </Link> :

                                                                    this.state.getListItem?.file_type === 'audio' ?
                                                                        <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">
                                                                            <ReactAudioPlayer
                                                                                src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='productimage'

                                                                                controls
                                                                            />
                                                                        </Link> : ''
                                                        }
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Price
                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>INR {this.state.getListItem?.price}<br />  </div>
                                        </div>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Quantity
                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right '>
                                            <div className="form-group fg_icon focus-2 mb-2">
                                                <div className="col-12 mt-3">
                                                    {this.state.getListItem?.sell_type_name === 'Price' ?
                                                        <>
                                                            <div className="row">
                                                                <div className='col-md-4'></div>
                                                                <div className="col-md-7">
                                                                    <div className="input-group">
                                                                        <span className="input-group-btn" style={{ marginRight: '31px' }}>
                                                                            <button type="button" onClick={this.minusQuantity.bind(this)} className="btn btn-primary btn-number plus-minus" data-type="minus" data-field="quant[2]">
                                                                                <span className="glyphicon glyphicon-minus"></span>
                                                                            </button>
                                                                        </span>
                                                                        <input type="text" onKeyPress={(event) => {
                                                                            if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }} className="form-control border-form" name="purchased_quantity" placeholder="Quantity" value={this.state.purchased_quantity}
                                                                            onChange={this.onChange} style={{ fontSize: '12px', height: '32px', width: '53px' }} />

                                                                        <span className="input-group-btn">
                                                                            <button type="button" onClick={this.plusQuantity.bind(this)} className="btn btn-primary btn-number plus-minus" data-type="plus" data-field="quant[2]">
                                                                                <span className="glyphicon glyphicon-plus"></span>
                                                                            </button>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {this.state.errorAvailable === '1' ?
                                                                <p style={{ color: 'red' }}>Quantity must be less than Edition</p>
                                                                :
                                                                this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                                                    ''
                                                            }
                                                        </>
                                                        :
                                                        <strong>Your offer must be greater than: INR {this.state.getListItem?.max_bid}</strong>
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                        <div className='col-md-12 '>
                                            <hr />
                                        </div>


                                    </div>
                                    <div className='row align-items-center'>

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Subtotal

                                        </div>
                                        {this.state.getListItem?.sell_type_name === 'Price' ?
                                            <>
                                                <div className='col-md-8 col-xs-9 text-right mb-3'>
                                                    <div>
                                                        <div className='input-label'>
                                                            INR {parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)}
                                                        </div>

                                                    </div>

                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className='col-md-8 col-xs-9 text-right mb-3'>
                                                    <input type="text" className="form-control currency  ccbid-price"
                                                        placeholder="Offer amount" onKeyPress={(event) => {
                                                            if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }} id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" />
                                                </div>
                                            </>
                                        }

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            DigiPhy coin
                                            <br />

                                            (Max Use {(this.state.getListItem?.price * this.state.getListItem?.coin_percentage / 100) / this.state.coinValue} )

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>
                                                <div className='input-label'>
                                                    <input className='form-control' type='text' onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.onChange} name='percentageList' value={this.state.percentageList} />
                                                    {this.state.maxToken === '1' ?
                                                        <p style={{ color: 'red' }}>You have only use {(this.state.getListItem?.price * this.state.getListItem?.coin_percentage / 100) / this.state.coinValue} DigiPhy Coin</p>
                                                        : ''
                                                    }
                                                </div>

                                            </div>
                                        </div>

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Total amount
                                            <br />
                                            1 DiGiphy Coin = INR {this.state.coinValue}

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>
                                                <div className='input-label'>
                                                    {this.state.percentageList} coin +
                                                    INR&nbsp;

                                                    {this.state.getListItem?.sell_type_name === 'Price' ?
                                                        <>
                                                            {parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2) - this.state.percentageList * this.state.coinValue}
                                                        </>
                                                        :
                                                        (parseFloat(parseFloat(this.state.bid_price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue}

                                                </div>

                                            </div>
                                        </div>

                                        <div className='col-md-12 col-xs-12'>
                                            {this.state.maxToken == '1' ?
                                                <button style={{ cursor: 'not-allowed' }} className='btn-main style1 w-100 mt-2'> Proceed to payment</button>
                                                :
                                                this.state.getListItem?.sell_type == 2 ?

                                                    <button onClick={() => this.openCheckout((parseFloat(parseFloat(this.state.bid_price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue)} className='btn-main style1 w-100'> Proceed to payment</button>
                                                    :
                                                    <button onClick={() => this.openCheckout((parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue)} className='btn-main style1 w-100'> Proceed to payment</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={this.state.etherClickActive == 1 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 1 ? 'block' : 'none' }}>
                                <div className='checkout'>
                                    <div className='row align-items-center'>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Item
                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div className="checklist">
                                                <ul>
                                                    <li>{this.state.getListItem?.name} </li>
                                                    <li>
                                                        {this.state.getListItem?.image === undefined || this.state.getListItem?.image === '' || this.state.getListItem?.image === null ? '' :
                                                            this.state.getListItem?.file_type === 'image' ?
                                                                <ModalImage
                                                                    small={`${config.imageUrl}${this.state.getListItem?.image}`}
                                                                    large={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                                    medium={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                                    width="100%" className='productimage'
                                                                    showRotate
                                                                    imageBackgroundColor
                                                                />
                                                                :
                                                                this.state.getListItem?.file_type === 'video' ?
                                                                    <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">

                                                                        {/* <Player src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='productimage' /> */}
                                                                        <div onClick={this.targetData.bind(this, this.state.getListItem)}>
                                                                            <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                        </div>
                                                                    </Link> :
                                                                    this.state.getListItem?.file_type === 'audio' ?
                                                                        <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">
                                                                            <ReactAudioPlayer
                                                                                src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='productimage'

                                                                                controls
                                                                            />
                                                                        </Link> : ''
                                                        }
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Price

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>INR {this.state.getListItem?.price}<br />  </div>

                                        </div>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Quantity

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right '>
                                            <div className="form-group fg_icon focus-2 mb-2">
                                                <div className="col-12 mt-3">
                                                    {this.state.getListItem?.sell_type_name === 'Price' ?
                                                        <>

                                                            <div className="row">

                                                                <div className='col-md-4'></div>
                                                                <div className="col-md-7">
                                                                    <div className="input-group">
                                                                        <span className="input-group-btn" style={{ marginRight: '31px' }}>
                                                                            <button type="button" onClick={this.minusQuantity.bind(this)} className="btn btn-primary btn-number plus-minus" data-type="minus" data-field="quant[2]">
                                                                                <span className="glyphicon glyphicon-minus"></span>
                                                                            </button>
                                                                        </span>
                                                                        <input type="text" onKeyPress={(event) => {
                                                                            if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }} className="form-control border-form" name="purchased_quantity" placeholder="Quantity" value={this.state.purchased_quantity}
                                                                            onChange={this.onChange} style={{ fontSize: '12px', height: '32px', width: '53px' }} />

                                                                        <span className="input-group-btn">
                                                                            <button type="button" onClick={this.plusQuantity.bind(this)} className="btn btn-primary btn-number plus-minus" data-type="plus" data-field="quant[2]">
                                                                                <span className="glyphicon glyphicon-plus"></span>
                                                                            </button>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            {this.state.errorAvailable === '1' ?
                                                                <p style={{ color: 'red' }}>Quantity must be less than Edition</p>
                                                                :
                                                                this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                                                    ''
                                                            }


                                                        </>
                                                        :
                                                        <strong>Your offer must be greater than: INR {this.state.getListItem?.max_bid}</strong>
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                        <div className='col-md-12 '>
                                            <hr />
                                        </div>


                                    </div>
                                    <div className='row align-items-center'>

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Subtotal

                                        </div>
                                        {this.state.getListItem?.sell_type_name === 'Price' ?
                                            <>
                                                <div className='col-md-8 col-xs-9 text-right mb-3'>
                                                    <div>
                                                        <div className='input-label'>
                                                            INR {parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)}
                                                        </div>

                                                    </div>

                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className='col-md-8 col-xs-9 text-right mb-3'>
                                                    <input type="text" className="form-control currency  ccbid-price"
                                                        placeholder="Offer amount" onKeyPress={(event) => {
                                                            if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }} id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" />
                                                </div>
                                            </>
                                        }

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            DigiPhy coin
                                            <br />
                                            (Max Use {(this.state.getListItem?.price * this.state.getListItem?.coin_percentage / 100) / this.state.coinValue} )

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>
                                                <div className='input-label'>
                                                    <input className='form-control' onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} type='text' onChange={this.onChange} name='percentageList' value={this.state.percentageList} />
                                                    {this.state.maxToken === '1' ?
                                                        <p style={{ color: 'red' }}>You have only use {(this.state.getListItem?.price * this.state.getListItem?.coin_percentage / 100) / this.state.coinValue} DigiPhy Coin</p>
                                                        : ''
                                                    }
                                                </div>

                                            </div>
                                        </div>

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Total amount
                                            <br />
                                            1 DiGiphy Coin = INR {this.state.coinValue}

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>
                                                <div className='input-label'>
                                                    {this.state.percentageList} coin +
                                                    INR&nbsp;
                                                    {this.state.getListItem?.sell_type_name === 'Price' ?
                                                        <>
                                                            {parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2) - this.state.percentageList * this.state.coinValue}
                                                        </>
                                                        :
                                                        (parseFloat(parseFloat(this.state.bid_price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue}
                                                </div>

                                            </div>
                                        </div>
                                        <h4 style={{ marginLeft: '15px' }}>Pay with Crypto</h4>
                                        <br />
                                        <div className='col-md-12 col-xs-12' style={{ marginTop: '10px' }}>
                                            <div className='row'>
                                                <div className="col-md-6 col-12">
                                                    <label id="payment_btn">
                                                        <input type="radio" name="wallet_type" value="1" onChange={this.changePaymentType.bind(this, 1)} />&nbsp;Meta Mask
                                                    </label>
                                                </div>
                                                <div className="col-md-6 col-12" style={{ display: 'none' }}>
                                                    <label id="payment_btn">
                                                        <input type="radio" name="wallet_type" value="2" onChange={this.changePaymentType.bind(this, 2)} />&nbsp;Toruse Connect
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {this.state.paymentType == 1 ?
                                            <>
                                                <div className='col-md-12 col-xs-12' style={{ marginTop: '10px' }}>
                                                    <div className='row'>
                                                        <div className="col-md-6 col-12">
                                                            <label id="payment_btn">
                                                                <input type="radio" name="paymentType" value="ETH" onChange={this.changesubPaymentType.bind(this, 'ETH')} />&nbsp;ETH
                                                            </label>
                                                        </div>


                                                        <div className="col-md-6 col-12">
                                                            <label id="payment_btn">
                                                                <input type="radio" name="paymentType" value="BNB" onChange={this.changesubPaymentType.bind(this, 'BNB')} />&nbsp;BNB
                                                            </label>
                                                        </div>

                                                        <div className="col-md-6 col-12 mt-3">
                                                            <label id="payment_btn">
                                                                <input type="radio" name="paymentType" value="Matic" onChange={this.changesubPaymentType.bind(this, "MATIC")} />&nbsp;Matic
                                                            </label>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className='col-md-12 col-xs-12'>
                                                    {this.state.maxToken == '1' ?
                                                        <button style={{ cursor: 'not-allowed' }} className='btn-main style1 w-100'> Proceed to payment</button>
                                                        :
                                                        <button onClick={() => this.handlePayment(this.state.subpaymentType, (parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue)} className='btn-main style1 w-100'> Proceed to payment</button>
                                                    }
                                                </div>
                                            </>

                                            : ''
                                        }
                                    </div>

                                </div>


                            </div>


                        </div>

                    </div>

                </Modal>
                <Modal visible={this.state.checkout} width="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div className='header_modal offer_method connect_wallet '>
                        <div className='modal-header text-right d-flex pt-3 pb-2'>
                            <h1 className="ant-typography title">Offer Method</h1>
                            <button className='close mt-1' onClick={() => this.closeModal()}><span>x</span></button>
                        </div>
                        <div className="nav-tab  clearfix" style={{ display: 'flex' }}>
                            <div className={this.state.etherClickActive == 0 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'cc')}>
                                <span>Razor Pay</span>
                            </div>
                            <div className={this.state.etherClickActive == 1 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'Ether')}>
                                <span className="text-black">Crypto</span>
                            </div>
                        </div>
                        <div className='modal-body text-left p-5'>
                            <div className={this.state.etherClickActive == 0 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 0 ? 'block' : 'none' }}>
                                <div className='checkout'>
                                    <div className='row align-items-center'>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Item

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div className="checklist">
                                                <ul>
                                                    <li>{this.state.getListItem?.name} </li>
                                                    <li>
                                                        {this.state.getListItem?.image === undefined || this.state.getListItem?.image === '' || this.state.getListItem?.image === null ? '' :
                                                            this.state.getListItem?.file_type === 'image' ?

                                                                <ModalImage
                                                                    small={`${config.imageUrl}${this.state.getListItem?.image}`}
                                                                    large={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                                    medium={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                                    width="100%" className='productimage'
                                                                    showRotate
                                                                    imageBackgroundColor
                                                                />
                                                                :
                                                                this.state.getListItem?.file_type === 'video' ?
                                                                    <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">

                                                                        {/* <Player src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='productimage' /> */}
                                                                        <div onClick={this.targetData.bind(this, this.state.getListItem)}>
                                                                            <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                        </div>
                                                                    </Link> :

                                                                    this.state.getListItem?.file_type === 'audio' ?
                                                                        <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">
                                                                            <ReactAudioPlayer
                                                                                src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='productimage'

                                                                                controls
                                                                            />
                                                                        </Link> : ''

                                                        }
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Price

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>INR {this.state.getListItem?.price}<br />  </div>

                                        </div>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Quantity

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right '>
                                            <div className="form-group fg_icon focus-2 mb-2">
                                                <div className="col-12 mt-3">
                                                    {this.state.getListItem?.sell_type_name === 'Price' ?
                                                        <>

                                                            <div className="row">

                                                                <div className='col-md-4'></div>
                                                                <div className="col-md-7">
                                                                    <div className="input-group">
                                                                        <span className="input-group-btn" style={{ marginRight: '31px' }}>
                                                                            <button type="button" onClick={this.minusQuantity.bind(this)} className="btn btn-primary btn-number plus-minus" data-type="minus" data-field="quant[2]">
                                                                                <span className="glyphicon glyphicon-minus"></span>
                                                                            </button>
                                                                        </span>
                                                                        <input type="text" onKeyPress={(event) => {
                                                                            if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }} className="form-control border-form" name="purchased_quantity" placeholder="Quantity" value={this.state.purchased_quantity}
                                                                            onChange={this.onChange} style={{ fontSize: '12px', height: '32px', width: '53px' }} />


                                                                        <span className="input-group-btn">
                                                                            <button type="button" onClick={this.plusQuantity.bind(this)} className="btn btn-primary btn-number plus-minus" data-type="plus" data-field="quant[2]">
                                                                                <span className="glyphicon glyphicon-plus"></span>
                                                                            </button>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            {this.state.errorAvailable === '1' ?
                                                                <p style={{ color: 'red' }}>Quantity must be less than Edition</p>
                                                                :
                                                                this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                                                    ''
                                                            }


                                                        </>
                                                        :
                                                        <strong>Your offer must be greater than: INR {this.state.getListItem?.max_bid}</strong>
                                                    }

                                                </div>
                                            </div>

                                        </div>

                                        <div className='col-md-12 '>
                                            <hr />
                                        </div>


                                    </div>
                                    <div className='row align-items-center'>

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Subtotal

                                        </div>
                                        {this.state.getListItem?.sell_type_name === 'Price' ?
                                            <>
                                                <div className='col-md-8 col-xs-9 text-right mb-3'>
                                                    <div>
                                                        <div className='input-label'>
                                                            INR {parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)}
                                                        </div>

                                                    </div>

                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className='col-md-8 col-xs-9 text-right mb-3'>
                                                    <input type="text" className="form-control currency  ccbid-price"
                                                        placeholder="Offer amount" onKeyPress={(event) => {
                                                            if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }} id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" />
                                                </div>
                                            </>
                                        }

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            DigiPhy coin
                                            <br />

                                            (Max Use {(this.state.getListItem?.price * this.state.getListItem?.coin_percentage / 100) / this.state.coinValue} )

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>
                                                <div className='input-label'>
                                                    <input className='form-control' onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} type='text' onChange={this.onChange} name='percentageList' value={this.state.percentageList} />
                                                    {this.state.maxToken === '1' ?
                                                        <p style={{ color: 'red' }}>You have only use {(this.state.getListItem?.price * this.state.getListItem?.coin_percentage / 100) / this.state.coinValue} DigiPhy Coin</p>
                                                        : ''
                                                    }

                                                </div>

                                            </div>
                                        </div>

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Total amount
                                            <br />
                                            1 DiGiphy Coin = INR {this.state.coinValue}

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>
                                                <div className='input-label'>
                                                    {this.state.percentageList} coin +
                                                    INR&nbsp;

                                                    {this.state.getListItem?.sell_type_name === 'Price' ?
                                                        <>
                                                            {parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2) - this.state.percentageList * this.state.coinValue}
                                                        </>
                                                        :
                                                        (parseFloat(parseFloat(this.state.bid_price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue}

                                                </div>

                                            </div>
                                        </div>

                                        <div className='col-md-12 col-xs-12'>
                                            {this.state.maxToken == '1' ?
                                                <button style={{ cursor: 'not-allowed' }} className='btn-main style1 w-100 mt-2'> Proceed to payment</button>
                                                :
                                                this.state.getListItem?.sell_type == 2 ?

                                                    <button onClick={() => this.openCheckout((parseFloat(parseFloat(this.state.bid_price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue)} className='btn-main style1 w-100'> Proceed to payment</button>
                                                    :
                                                    <button onClick={() => this.openCheckout((parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue)} className='btn-main style1 w-100'> Proceed to payment</button>
                                            }
                                        </div>



                                    </div>

                                </div>

                                {this.state.getListItem.nft_type == 'Physical NFT' ?
                                    <div className="sec" data-sec="edit-password" style={{ display: 'none' }}>
                                        <div className="be-large-post mb-4">
                                            <br />
                                            <div className="info-block-shipping style-1">
                                                <div className="be-large-post-align"><h3 className="info-block-label">Shipping Address</h3></div>
                                            </div>
                                            <div className="be-large-post-align">
                                                <div className="row">
                                                    <div className="input-col col-xs-12 col-sm-12">
                                                        <div className='shipping-address'>
                                                            <div className="form-group focus-2">
                                                                <div className="form-label-shipping">Mobile Number</div>
                                                                <input className="form-control" type="text" placeholder="Mobile Number" autoComplete='off'
                                                                    name="mobile_number" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.mobile_number} />
                                                            </div>&nbsp;
                                                            <div className="form-group focus-2">
                                                                <div className="form-label-shipping">Pin code</div>
                                                                <input className="form-control" type="text" placeholder="Pin code"
                                                                    name="pin_code" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.pin_code} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="input-col col-xs-12 col-sm-12">
                                                        <div className='shipping-address'>
                                                            <div className="form-group focus-2">
                                                                <div className="form-label-shipping">Locality</div>
                                                                <input className="form-control" type="text" placeholder="Locality"
                                                                    name="locality" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.locality} />
                                                            </div>&nbsp;
                                                            <div className="form-group focus-2">
                                                                <div className="form-label-shipping">Address</div>
                                                                <input className="form-control" type="text" placeholder="Shipping Address"
                                                                    name="shipping_address" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.shipping_address} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="input-col col-xs-12 col-sm-12">
                                                        <div className='shipping-address'>
                                                            <div className="form-group focus-2">
                                                                <div className="form-label-shipping">City</div>
                                                                <input className="form-control" type="text" placeholder="City"
                                                                    name="city" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.city} />
                                                            </div>&nbsp;

                                                            <div className="form-group focus-2">
                                                                <div className="form-label-shipping">State</div>
                                                                <input className="form-control" type="text" placeholder="State"
                                                                    name="state" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.state} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="input-col col-xs-12 col-sm-12">
                                                        <div className="form-group focus-2">
                                                            <div className="form-label-shipping">Landmark</div>
                                                            <input className="form-control" type="text" placeholder="Landmark"
                                                                name="landmark_address" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.landmark_address} />
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-12">
                                                        {this.state.processButton === '' ?
                                                            <a className="btn color-1 size-2 hover-1 btn-right"
                                                                disabled={!this.state.getShippingAddress.mobile_number || !this.state.getShippingAddress.shipping_address || !this.state.getShippingAddress.city || !this.state.getShippingAddress.locality || !this.state.getShippingAddress.pin_code || !this.state.getShippingAddress.state} onClick={this.handleSubmitShippingAddress}>Update Address</a>
                                                            : <a className="btn color-1 size-2 hover-1 btn-right"
                                                                disabled>Processing...</a>


                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : ""}
                            </div>






                            <div className={this.state.etherClickActive == 1 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 1 ? 'block' : 'none' }}>

                                <div className='checkout'>
                                    <div className='row align-items-center'>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Item

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div className="checklist">
                                                <ul>
                                                    <li>{this.state.getListItem?.name} </li>
                                                    <li>
                                                        {this.state.getListItem?.image === undefined || this.state.getListItem?.image === '' || this.state.getListItem?.image === null ? '' :
                                                            this.state.getListItem?.file_type === 'image' ?

                                                                <ModalImage
                                                                    small={`${config.imageUrl}${this.state.getListItem?.image}`}
                                                                    large={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                                    medium={`${config.imageUrl1}${this.state.getListItem?.local_image}`}
                                                                    width="100%" className='productimage'
                                                                    showRotate
                                                                    imageBackgroundColor
                                                                />

                                                                :
                                                                this.state.getListItem?.file_type === 'video' ?
                                                                    <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">

                                                                        {/* <Player src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='productimage' /> */}
                                                                        <div onClick={this.targetData.bind(this, this.state.getListItem)}>
                                                                            <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                        </div>
                                                                    </Link> :

                                                                    this.state.getListItem?.file_type === 'audio' ?
                                                                        <Link to={`${config.baseUrl}ipfs/${this.state.getListItem?.image}`} target="_blank">
                                                                            <ReactAudioPlayer
                                                                                src={`${config.imageUrl}${this.state.getListItem?.image}`} width="100%" className='productimage'

                                                                                controls
                                                                            />
                                                                        </Link> : ''

                                                        }
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Price

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>INR {this.state.getListItem?.price}<br />  </div>

                                        </div>
                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Quantity

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right '>
                                            <div className="form-group fg_icon focus-2 mb-2">
                                                <div className="col-12 mt-3">
                                                    {this.state.getListItem?.sell_type_name === 'Price' ?
                                                        <>

                                                            <div className="row">

                                                                <div className='col-md-4'></div>
                                                                <div className="col-md-7">
                                                                    <div className="input-group">
                                                                        <span className="input-group-btn" style={{ marginRight: '31px' }}>
                                                                            <button type="button" onClick={this.minusQuantity.bind(this)} className="btn btn-primary btn-number plus-minus" data-type="minus" data-field="quant[2]">
                                                                                <span className="glyphicon glyphicon-minus"></span>
                                                                            </button>
                                                                        </span>
                                                                        <input type="text" onKeyPress={(event) => {
                                                                            if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }} className="form-control border-form" name="purchased_quantity" placeholder="Quantity" value={this.state.purchased_quantity}
                                                                            onChange={this.onChange} style={{ fontSize: '12px', height: '32px', width: '53px' }} />

                                                                        <span className="input-group-btn">
                                                                            <button type="button" onClick={this.plusQuantity.bind(this)} className="btn btn-primary btn-number plus-minus" data-type="plus" data-field="quant[2]">
                                                                                <span className="glyphicon glyphicon-plus"></span>
                                                                            </button>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            {this.state.errorAvailable === '1' ?
                                                                <p style={{ color: 'red' }}>Quantity must be less than Edition</p>
                                                                :
                                                                this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                                                    ''
                                                            }


                                                        </>
                                                        :
                                                        <strong>Your offer must be greater than: INR {this.state.getListItem?.max_bid}</strong>
                                                    }

                                                </div>
                                            </div>

                                        </div>

                                        <div className='col-md-12 '>
                                            <hr />
                                        </div>


                                    </div>
                                    <div className='row align-items-center'>

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Subtotal

                                        </div>
                                        {this.state.getListItem?.sell_type_name === 'Price' ?
                                            <>
                                                <div className='col-md-8 col-xs-9 text-right mb-3'>
                                                    <div>
                                                        <div className='input-label'>
                                                            INR {parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)}
                                                        </div>

                                                    </div>

                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className='col-md-8 col-xs-9 text-right mb-3'>
                                                    <input type="text" className="form-control currency  ccbid-price"
                                                        placeholder="Offer amount" onKeyPress={(event) => {
                                                            if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }} id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" />
                                                </div>
                                            </>
                                        }

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            DigiPhy coin
                                            <br />
                                            (Max Use {(this.state.getListItem?.price * this.state.getListItem?.coin_percentage / 100) / this.state.coinValue} )

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>
                                                <div className='input-label'>
                                                    <input className='form-control' onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} type='text' onChange={this.onChange} name='percentageList' value={this.state.percentageList} />
                                                    {this.state.maxToken === '1' ?
                                                        <p style={{ color: 'red' }}>You have only use {(this.state.getListItem?.price * this.state.getListItem?.coin_percentage / 100) / this.state.coinValue} DigiPhy Coin</p>
                                                        : ''
                                                    }


                                                </div>

                                            </div>
                                        </div>

                                        <div className='col-md-4 col-xs-3 mb-3'>
                                            Total amount
                                            <br />
                                            1 DiGiphy Coin = INR {this.state.coinValue}

                                        </div>
                                        <div className='col-md-8 col-xs-9 text-right mb-3'>
                                            <div>
                                                <div className='input-label'>
                                                    {this.state.percentageList} coin +
                                                    INR&nbsp;
                                                    {this.state.getListItem?.sell_type_name === 'Price' ?
                                                        <>
                                                            {parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2) - this.state.percentageList * this.state.coinValue}
                                                        </>
                                                        :
                                                        (parseFloat(parseFloat(this.state.bid_price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue}
                                                </div>

                                            </div>
                                        </div>
                                        <h4 style={{ marginLeft: '15px' }}>Pay with Crypto</h4>
                                        <br />

                                        {this.state.paymentType == 1 ?

                                            <>
                                                <div className='col-md-12 col-xs-12' style={{ marginTop: '10px' }}>
                                                    <div className='row'>
                                                        <div className="col-md-6 col-12">
                                                            <label id="payment_btn">
                                                                <input type="radio" name="paymentType" value="ETH" onChange={this.changesubPaymentType.bind(this, 'ETH')} />&nbsp;ETH
                                                            </label>
                                                        </div>


                                                        <div className="col-md-6 col-12">
                                                            <label id="payment_btn">
                                                                <input type="radio" name="paymentType" value="BNB" onChange={this.changesubPaymentType.bind(this, 'BNB')} />&nbsp;BNB
                                                            </label>
                                                        </div>

                                                        <div className="col-md-6 col-12 mt-3">
                                                            <label id="payment_btn">
                                                                <input type="radio" name="paymentType" value="Matic" onChange={this.changesubPaymentType.bind(this, "MATIC")} />&nbsp;Matic
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='col-md-12 col-xs-12'>
                                                    {this.state.maxToken == '1' ?
                                                        <button style={{ cursor: 'not-allowed' }} className='btn-main style1 w-100 mt-2'> Proceed to payment</button>
                                                        :
                                                        this.state.subpaymentType == false ?
                                                            <button style={{ cursor: 'not-allowed' }} className='btn-main style1 w-100'> Proceed to payment</button>

                                                            :
                                                            <button onClick={() => this.handlePayment(this.state.subpaymentType, (parseFloat(parseFloat(this.state.getListItem?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)) - this.state.percentageList * this.state.coinValue)} className='btn-main style1 w-100'> Proceed to payment</button>

                                                    }

                                                </div>
                                            </>

                                            : ''

                                        } </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal>
                <div className='modal-unblock'>
                    <Modal center visible={this.state.revealModel} effect="fadeInUp" onClickAway={() => this.closeModal4()} styles={{ width: "100%", margin: "25px" }}>
                        <div className='header_modal creditcard'>
                            <div className='modal-header text-right d-flex pt-4 pb-4'>
                                <h1 className="ant-typography title text-center">Unlockable Content</h1>
                                <button className='close mt-1' onClick={() => this.closeModal4()}><span>x</span></button>
                            </div>
                            <div className='modal-body text-left p-5'>
                                <div className=''>

                                    <form role="form">
                                        <div className="form-group">
                                            {this.state.getListItem?.created_by == this.loginData?.data?.id ?
                                                <input
                                                    readOnly
                                                    type="text"
                                                    className="form-control" value={this.state.getListItem.unlockable_content}
                                                /> :
                                                <>
                                                    <CodeShimmer style={{ marginTop: "1rem", background: 'rgb(241 241 241)' }} rounded={"20px"} size={{ height: 550, width: 500 }} />
                                                    <p style={{ color: 'red' }}>“You need to be the owner of this NFT to access unlockable content”</p>
                                                </>
                                            }

                                        </div>


                                        <button className="subscribe btn" style={{ background: "#353840", border: "2px solid #353840" }} onClick={this.closeModal4.bind(this)} type="button">
                                            close
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
                <Footer />
            </>
        )
    }
}