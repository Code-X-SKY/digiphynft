import React, { useEffect, useState } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'
import axios from 'axios';
import config from '../config/config';
import useRazorpay from "react-razorpay";
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'

export default function Swapdigiphy() {
    const [secondAmount, setsecondAmount] = useState(0);
    const [coinValue, setCoinvalue] = useState('0')
    const [isDialogOpen, setisDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        price: 0,
        secondAmount: 0,
        curreny_sel: 'INR'
    });
    const [loginData, setloginData] = useState((!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend')))
    const { price, curreny_sel } = formData;
    const [priceValue, setPriceValue] = useState('')
    const [toAddress, settoAddress] = useState('')


    const Razorpay = useRazorpay();
    const handlePayment = async (type) => {
        // const order = await createOrder(params); //  Create order on your backend
        if (type == 'INR') {
            const options = {
                key: config.razorPayId, // Enter the Key ID generated from the Dashboard
                amount: formData.price * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                name: loginData.data.full_name,
                description: "Test Transaction",
                image: "https://example.com/your_logo",
                // order_id: "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
                handler: function (response) {
                    console.log(response.razorpay_payment_id);
                    console.log(response.razorpay_order_id);
                    console.log(response.razorpay_signature);
                    swapDigiphyCoinAPI(response)
                },
                prefill: {
                    name: loginData.data.full_name,
                    email: loginData.data.user_email,
                    contact: "9999999999",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
            };
            const rzp1 = new Razorpay(options);
            rzp1.on("payment.failed", function (response) {
                console.log(response.error.code);
                console.log(response.error.description);
                console.log(response.error.source);
                console.log(response.error.step);
                console.log(response.error.reason);
                console.log(response.error.metadata.order_id);
                console.log(response.error.metadata.payment_id);
            });
            rzp1.open();
        }
        else if (type == 'BNB') {
            if (window.ethereum) {
                setisDialogOpen(true)
                var web3 = '';
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                let currentNetwork = await web3.currentProvider.chainId;
                console.log(currentNetwork, curreny_sel);
                web3.eth.defaultAccount = accounts[0];
                var from_address = accounts[0];
                try {
                    if (curreny_sel == 'BNB') {

                        if (currentNetwork != config.BNBChainId) {
                            toast.error(config.chainMessageBNB);
                            setisDialogOpen(false)

                            return false;
                        }
                        var chainId = config.BNBChainId;
                    }

                    var to_address = toAddress;
                    var trx_amount = parseInt(formData.price * (10 ** 18));

                    var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
                    var currentBal = parseFloat(getBalace).toFixed(6)

                    if (currentBal < formData.price) {
                        toast.error(`Insufficient fund for transfer`);
                        setisDialogOpen(false)
                        return false;
                    }

                    let gasPrice = await web3.eth.getGasPrice();
                    let gasLimit = await web3.eth.estimateGas({
                        gasPrice: web3.utils.toHex(gasPrice),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                        chainId: chainId,
                    });

                    const txData = await web3.eth.sendTransaction({
                        gasPrice: web3.utils.toHex(gasPrice),
                        gas: web3.utils.toHex(gasLimit),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                        chainId: chainId,
                    });
                    console.log(txData.transactionHash);

                    if (txData.transactionHash) {
                        let data = {
                            'from_address': from_address,
                            'hash': txData.transactionHash
                        }
                        swapDigiphyCoinAPI(data)
                    }

                } catch (error) {
                    toast.error(`Something went wrong! Please try again.`, {

                    });
                    setisDialogOpen(false)

                    return false;
                }
            }
            else {
                toast.error(`Please connect your MetaMask wallet!`, {

                });
                this.setState({
                    isDialogOpen: false
                })
                return false;
            }
        }
        else if (type == 'ETH') {
            if (window.ethereum) {
                setisDialogOpen(true)
                var web3 = '';
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                let currentNetwork = await web3.currentProvider.chainId;
                console.log(currentNetwork, curreny_sel);
                web3.eth.defaultAccount = accounts[0];
                var from_address = accounts[0];
                try {
                    if (curreny_sel == 'ETH') {

                        if (currentNetwork != config.ETHChainId) {
                            toast.error(config.chainMessageETH);
                            setisDialogOpen(false)

                            return false;
                        }
                        var chainId = config.ETHChainId;
                    }

                    var to_address = toAddress;
                    var trx_amount = parseInt(formData.price * (10 ** 18));

                    var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
                    var currentBal = parseFloat(getBalace).toFixed(6)

                    if (currentBal < formData.price) {
                        toast.error(`Insufficient fund for transfer`);
                        setisDialogOpen(false)
                        return false;
                    }

                    let gasPrice = await web3.eth.getGasPrice();
                    let gasLimit = await web3.eth.estimateGas({
                        gasPrice: web3.utils.toHex(gasPrice),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                        chainId: chainId,
                    });

                    const txData = await web3.eth.sendTransaction({
                        gasPrice: web3.utils.toHex(gasPrice),
                        gas: web3.utils.toHex(gasLimit),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                        chainId: chainId,
                    });
                    console.log(txData.transactionHash);

                    if (txData.transactionHash) {
                        let data = {
                            'from_address': from_address,
                            'hash': txData.transactionHash
                        }
                        swapDigiphyCoinAPI(data)
                    }

                } catch (error) {
                    toast.error(`Something went wrong! Please try again.`, {

                    });
                    setisDialogOpen(false)

                    return false;
                }
            }
            else {
                toast.error(`Please connect your MetaMask wallet!`, {

                });
                this.setState({
                    isDialogOpen: false
                })
                return false;
            }
        }
        else if (type == 'MATIC') {
            if (window.ethereum) {
                setisDialogOpen(true)
                var web3 = '';
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                let currentNetwork = await web3.currentProvider.chainId;
                console.log(currentNetwork, curreny_sel);
                web3.eth.defaultAccount = accounts[0];
                var from_address = accounts[0];
                try {
                    if (curreny_sel == 'MATIC') {

                        if (currentNetwork != config.chainId) {
                            toast.error(config.chainMessage);
                            setisDialogOpen(false)

                            return false;
                        }
                        var chainId = config.chainId;
                    }

                    var to_address = toAddress;
                    var trx_amount = parseInt(formData.price * (10 ** 18));

                    var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
                    var currentBal = parseFloat(getBalace).toFixed(6)

                    if (currentBal < formData.price) {
                        toast.error(`Insufficient fund for transfer`);
                        setisDialogOpen(false)
                        return false;
                    }

                    let gasPrice = await web3.eth.getGasPrice();
                    let gasLimit = await web3.eth.estimateGas({
                        gasPrice: web3.utils.toHex(gasPrice),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                        chainId: chainId,
                    });

                    const txData = await web3.eth.sendTransaction({
                        gasPrice: web3.utils.toHex(gasPrice),
                        gas: web3.utils.toHex(gasLimit),
                        to: to_address,
                        from: from_address,
                        value: web3.utils.toHex(trx_amount),
                        chainId: chainId,
                    });
                    console.log(txData.transactionHash);

                    if (txData.transactionHash) {
                        let data = {
                            'from_address': from_address,
                            'hash': txData.transactionHash
                        }
                        swapDigiphyCoinAPI(data)
                    }

                } catch (error) {
                    toast.error(`Something went wrong! Please try again.`, {

                    });
                    setisDialogOpen(false)

                    return false;
                }
            }
            else {
                toast.error(`Please connect your MetaMask wallet!`, {

                });
                this.setState({
                    isDialogOpen: false
                })
                return false;
            }
        }
    };

    useEffect(() => {
        getDigiCoin()
        livePriceAPI()
    }, [])

    const onChange = (e) => {

        let newSecondAmount = formData.secondAmount;
        let newPrice = formData.price;
        let curreny_sel = formData.curreny_sel;

        if (e.target.name == 'curreny_sel') {
            curreny_sel = e.target.value;
        } else if (e.target.name == "secondAmount") {
            newSecondAmount = e.target.value;
        } else if (e.target.name == 'price') {
            newPrice = e.target.value;
        }


        if (e.target.name == 'price') {
            newSecondAmount = (curreny_sel == 'INR' ?
                parseFloat(newPrice / coinValue).toFixed(6) : curreny_sel == 'BNB' ?
                    parseFloat((priceValue[1].current_price) * (newPrice) / coinValue).toFixed(6) : curreny_sel == 'ETH' ?
                        parseFloat((priceValue[0].current_price) * (newPrice) / coinValue).toFixed(6) : curreny_sel == 'MATIC' ?
                            parseFloat((priceValue[2].current_price) * (newPrice) / coinValue).toFixed(6) : 0);
            setFormData({ ...formData, [e.target.name]: e.target.value, "secondAmount": newSecondAmount == 'DigiPhyNFT' ? 0 : newSecondAmount });
        }
        else if (e.target.name == "secondAmount") {
            newPrice = curreny_sel == 'INR' ?
                parseFloat(newSecondAmount * coinValue).toFixed(6) : curreny_sel == 'BNB' ?
                    parseFloat(coinValue / (priceValue[1].current_price) * (newSecondAmount)).toFixed(6) : curreny_sel == 'ETH' ?
                        parseFloat(coinValue / (priceValue[0].current_price) * (newSecondAmount)).toFixed(6) : curreny_sel == 'MATIC' ?
                            parseFloat(coinValue / (priceValue[2].current_price) * (newSecondAmount)).toFixed(6) : 0;

            setFormData({ ...formData, [e.target.name]: e.target.value, "price": newPrice == 'DigiPhyNFT' ? 0 : newPrice });
        } else {

            newPrice = curreny_sel == 'INR' ?
                parseFloat(newSecondAmount * coinValue).toFixed(6) : curreny_sel == 'BNB' ?
                    parseFloat(coinValue / (priceValue[1].current_price) * (newSecondAmount)).toFixed(6) : curreny_sel == 'ETH' ?
                        parseFloat(coinValue / (priceValue[0].current_price) * (newSecondAmount)).toFixed(6) : curreny_sel == 'MATIC' ?
                            parseFloat(coinValue / (priceValue[2].current_price) * (newSecondAmount)).toFixed(6) : 0;

            setFormData({ ...formData, [e.target.name]: e.target.value, "price": newPrice == 'DigiPhyNFT' ? 0 : newPrice });
        }
    }


    //===================================================  Get digiphy coin  =================================

    const getDigiCoin = async () => {
        await axios({
            method: 'post',
            url: config.apiUrl + 'getSettings',
            data: { "email": "admin@digiphynft.io", "user_id": 1 }
        })
            .then(response => {
                if (response.data.success == true) {
                    setCoinvalue(response.data.coin_value)
                    settoAddress(response.data.receive_address)
                }
            })
    }

    //===================================================  Live price  =================================

    const livePriceAPI = async () => {
        await axios({
            method: 'get',
            url: ' https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&ids=ethereum,binancecoin,matic-network&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        })
            .then(response => {

                console.log(response.data);
                setPriceValue(response.data)
            })
    }





    //===============================================  swapDigiphyCoin =========================================

    const swapDigiphyCoinAPI = async (data) => {
        let swapData = {
            "user_id": loginData.data.id,
            "transaction_type_id": '13',

            "amount": formData.curreny_sel == 'INR' ?
                formData.price : formData.curreny_sel == 'BNB' ?
                    parseFloat((priceValue[1].current_price) * (formData.price)) : formData.curreny_sel == 'ETH' ?
                        parseFloat((priceValue[0].current_price) * (formData.price)) : formData.curreny_sel == 'MATIC' ?
                            parseFloat((priceValue[2].current_price) * (formData.price)) : '',

            "from_address": data.from_address,
            "to_address": toAddress,
            "hash": curreny_sel == 'INR' ? data.razorpay_payment_id : data.hash,

            "token": formData.curreny_sel == 'INR' ?
                parseFloat(price / coinValue) : formData.curreny_sel == 'BNB' ?
                    parseFloat((priceValue[1].current_price) * (formData.price) / coinValue) : formData.curreny_sel == 'ETH' ?
                        parseFloat((priceValue[0].current_price) * (formData.price) / coinValue) : formData.curreny_sel == 'MATIC' ?
                            parseFloat((priceValue[2].current_price) * (formData.price) / coinValue) : '',

            "payment_currency": formData.curreny_sel,
            "payment_currency_amount": formData.price,
            "currency": 'DigiPhy',
            "status": 1
        }
        await axios({
            method: 'post',
            url: config.apiUrl + 'swapDigiphyCoin',
            data: swapData
        })
            .then(response => {
                if (response.data.success === true) {
                    toast.success(response.data.msg);
                    setisDialogOpen(false)
                    setTimeout(() => {
                        window.location.reload()
                    }, 100);
                } else {
                    toast.error(response.data.msg);
                    setisDialogOpen(false)
                }
            }).catch(err => {
                toast.error(err.response.data?.msg,
                );
                setisDialogOpen(false)
            })
    }





    // render() {
    return (

        <>
            <Header />

            <Dialog
                title="Warning"
                icon="warning-sign"
                style={{
                    color: 'red'
                }}
                isOpen={isDialogOpen}
                isCloseButtonShown={false}
            >
                <div className="text-center">
                    <BarLoader color="#e84747" height="2" />
                    <br />
                    <h4 style={{ color: '#000' }}>Transaction under process...</h4>
                    <p style={{ color: 'red' }}>
                        Please do not refresh page or close tab.
                    </p>
                    <div>
                    </div>
                </div>
            </Dialog>

            <Toaster />
            <div id="content-block" className='mt-5'>


                <section className="ptb-100 ">
                    <div className="container-fluid custom-container">
                        <div className="Toastify" />

                        <div className="container">
                            <div className="row justify-content-center">
                                <div className='col-sm-5'>
                                    <h3 className='text-white text-center'>Buy DigiPhy Coin</h3>

                                    <div className='swap_digiphycoin'>
                                        <div className='row'>
                                            <div className='col-sm-12'>


                                                <div className=" form-group">
                                                    <div className='swap-field'>
                                                        <div className='d-flex'>
                                                            <div className="asset-logo">
                                                                <img src={`images/${formData.curreny_sel == 'INR' ? 'rupees.png' : formData.curreny_sel == 'BNB' ? 'binance.png' : formData.curreny_sel == 'ETH' ? 'ether.jpeg' : formData.curreny_sel == 'MATIC' ? 'matic.webp' : ''}`} className="asset-logo__image" alt="Asset logo" />
                                                            </div>&nbsp;&nbsp;

                                                            <input type="text" onKeyPress={(event) => {
                                                                if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                    event.preventDefault();
                                                                }
                                                            }} className="form-control" onChange={onChange} name='price' value={formData.price} placeholder="0.00" />
                                                        </div>
                                                        <button type="button" className="currency-btn">
                                                            <span className="button__content">
                                                                <div className="">
                                                                    {/* <select>
                                                                            <option value="INR">INR</option>
                                                                            <option value="BNB">BNB</option>
                                                                            <option value="ETH">ETH</option>
                                                                            <option value="MATIC">MATIC</option>
                                                                        </select> */}
                                                                    <span className="token__symbol ellipsis"><select className="form-control" name='curreny_sel' value={curreny_sel} onChange={onChange}>
                                                                        <option value="INR">INR</option>
                                                                        <option value="BNB">BNB</option>
                                                                        <option value="ETH">ETH</option>
                                                                        <option value="MATIC">MATIC</option>
                                                                    </select></span>
                                                                </div>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <div className='swap-para'>
                                                        {/* <p className="swap-tokens-form-token__info">≈ ₹
                                                            {formData.curreny_sel == 'INR' ?
                                                                formData.price : formData.curreny_sel == 'BNB' ?
                                                                    parseFloat((priceValue[1].current_price) * (formData.price)).toFixed(6) : formData.curreny_sel == 'ETH' ?
                                                                        parseFloat((priceValue[0].current_price) * (formData.price)).toFixed(6) : formData.curreny_sel == 'MATIC' ?
                                                                            parseFloat((priceValue[2].current_price) * (formData.price)).toFixed(6) : ''}

                                                        </p> */}

                                                    </div>
                                                </div>




                                            </div>
                                            <div className='col-sm-12 text-center mb-5'>
                                                <button className='btn-main style-1 btn_exchange'>
                                                    <i className='fa fa-exchange'></i>
                                                </button>
                                                <br />

                                            </div>
                                            <div className='col-sm-12'>
                                                <div className=" form-group">
                                                    <div className='swap-field'>
                                                        <div className='d-flex'>
                                                            <div className="asset-logo">
                                                                <img src="images/favicon.png" className="asset-logo__image" alt="Asset logo" />
                                                            </div>&nbsp;&nbsp;

                                                            <input type="text" onKeyPress={(event) => {
                                                                if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                    event.preventDefault();
                                                                }
                                                            }} onChange={onChange} name="secondAmount" className="form-control" value=
                                                                {formData.secondAmount}

                                                                placeholder="0.00" />
                                                        </div>
                                                        <button type="button" className="currency-btn">
                                                            <span className="button__content">
                                                                <div className="">
                                                                    <span className="token__symbol ellipsis">DigiPhycoin <i className='fa fa-angle-right pl-2'></i></span>
                                                                </div>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    {/* <div className='swap-para'>
                                                        <p className="swap-tokens-form-token__info">≈ $ 0.00</p>
                                                        <p className="swap-tokens-form-token__info">Balance: 0.00</p>

                                                    </div> */}
                                                </div>

                                            </div>
                                            <div className='col-sm-12'>
                                                <button className='btn-main pt-2 pb-2 w-100' style={{ cursor: !formData.price && !formData.secondAmount ? 'not-allowed' : '' }} disabled={!formData.price && !formData.secondAmount} type='submit' onClick={e => handlePayment(formData.curreny_sel)}>Swap</button>
                                            </div>

                                        </div>

                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <br /><br />

            </div>



            <Footer />

        </>
    )
    // }
}