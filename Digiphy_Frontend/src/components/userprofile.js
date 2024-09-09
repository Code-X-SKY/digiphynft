import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import { Link } from 'react-router-dom';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import Web3 from 'web3';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-awesome-modal';
import Swal from 'sweetalert2'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import DatePicker from 'react-date-picker';
import Loader from "react-loader-spinner";
const MAX_LENGTH = 20;

export default class userprofile extends Component {
    constructor(props) {
        super(props)
        const { match: { params } } = this.props;
        this.id = params.user_id
        this.state = {
            loaderImage: 0,
            userData: {},
            getWalletData: {},
            myNftData: [],
            collectionData: [],
            userData: [],
            isActive: 1,
            value: '',
            copied: false,
            userItemData: [],
            getWalletDetailAPIData: '',
            isDialogOpen: false,
            BuyItemData: [],
            ConnectWalletAddress: localStorage.getItem('walletType'),
            visible: false,
            revealModel: false,
            searchDataList: [],
            searchData: '',
            allsearchData: '',
            errorMessageSripe: '',
            userItemData1: '',
            sellItem: '',
            resale_quantity: '1',
            userItemData1Claim: "",
            sellItem11: '',
            sellItemBlockChain: "",
            userItemDataTransferNFT: '',
            userCheck: false,
            getBlockChainAPIData: [],
            getBlockChainAPIDataBlockFalse: [],
            cancelListingData: '',
            showBlockChain: localStorage.getItem('tabSelect2') ? localStorage.getItem('tabSelect2') : 0,
            showData: 0,
            showBlockChain1: localStorage.getItem('tabSelect') ? localStorage.getItem('tabSelect') : 0,
            showBlockChain2: localStorage.getItem('tabSelect1') ? localStorage.getItem('tabSelect1') : 0,

        };
        this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
        this.onChange = this.onChange.bind(this)
        this.paymentShowAPI = this.paymentShowAPI.bind(this)

        this.handleChangeExpiry = this.handleChangeExpiry.bind(this)

    }


    handleChangeExpiry(date) {

        this.setState({
            // start_date: new Date(date).setDate(new Date(date).getDate() + 1)
            expiry_date: date
        })

    }

    openModal4(item) {
        this.setState({
            revealModel: true,
            userItemData1: item
        });
    }

    closeModal4() {
        this.setState({

            revealModel: false
        });
    }



    openModalTransferNFT(item) {
        this.setState({
            revealModelTransferNFT: true,
            userItemDataTransferNFT: item
        });
    }

    closeModalTraopenModalTransferNFT() {
        this.setState({

            revealModelTransferNFT: false
        });
    }


    openModal5(item) {
        this.setState({
            revealModelClaim: true,
            userItemData1Claim: item
        });
    }

    closeModal5() {
        this.setState({

            revealModelClaim: false
        });
    }


    async allSearchAPI(id) {
        // e.preventDefault()
        await axios({
            method: 'post',
            url: `${config.apiUrl}allSearch`,
            headers: { "Authorization": this.loginData?.message },
            data: { "search": id }
        }).then(response => {
            if (response.data.success === true) {

                this.setState({
                    searchDataList: response.data.response.filter((item) => item.id != 1),
                    userCheck: true

                })

            }
            else if (response.data.success === false) {
            }
        }).catch(err => {
            this.setState({
                searchDataList: [],
                userCheck: false
            })


        })
    }


    async getUserDataAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserDetailData`,
            data: { "id": this.id }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    userData: response.data.response
                })
            }
        })
    }

    async getWalletDataAPI() {
        const token = this.token
        await axios({
            method: 'post',
            url: `${config.apiUrl}getWalletDetail`,
            headers: { authorization: token },
            data: { "user_id": this.id, 'email': this.loginData?.user_email }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    getWalletData: response.data
                })
            }
        })
    }



    //  ========================================== Portfolio API's Start==========================================

    async getMyNftAPI(nftType = null) {
        if (!nftType) {
            var nftType = 1
            this.setState({
                isActive: 1
            })
        } else {
            var nftType = nftType
            this.setState({
                isActive: nftType
            })
        }

        this.setState({
            'saleHistory': [],
            'nftType': nftType,
            'FavouritesHistory': []
        })

        const token = this.token
        await axios({
            method: 'post',
            url: `${config.apiUrl}portfolio`,
            headers: { authorization: token },
            data: { "user_id": this.id, 'email': this.loginData?.user_email, 'type': nftType, 'login_user_id': this.loginData.id }
            // data: { "user_id": 262, 'email': this.loginData?.user_email, 'type': nftType, 'login_user_id': 262 }
        }).then(response => {

            if (response.data.success === true) {
                this.setState({
                    myNftData: response.data.response,
                    saleHistory: response.data.response,
                    FavouritesHistory: response.data.response
                })
            }
        })
    }


    getTimeOfStartDate(dateTime) {
        var date = new Date(dateTime); // some mock date
        var milliseconds = date.getTime();
        return milliseconds;
    }

    CountdownTimer({ days, hours, minutes, seconds, completed }) {
        if (completed) {
            // Render a completed state
            return "Starting";
        } else {
            // Render a countdowns
            var dayPrint = (days > 0) ? days + 'd' : '';
            return <span>{dayPrint} {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s</span>;
        }
    };


    async likeCount(item) {
        if (this.loginData && this.loginData.id) {
            await axios({
                method: 'post',
                url: `${config.apiUrl}likeitem`,
                data: {
                    "user_id": this.loginData.id,
                    "item_id": item.item_id
                }
            }).then((res) => {
                if (res.data.success === true) {
                    this.getMyNftAPI(this.state.nftType)
                }

            }).catch((error) => {

            })
        } else {
            toast.error('Please Login First')
        }
    }


    // ==============================   user Owner Item API's Start =================================================

    async getUserOwnerDataAPI() {
        const token = this.token
        this.setState({
            isActive: 3
        })
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserownerItem`,
            headers: { authorization: token },
            data: { "user_id": this.id, 'email': this.loginData?.user_email }
            // data: { "user_id": 262, 'email': this.loginData?.user_email }
        }).then(response => {

            if (response.data.success === true) {
                this.setState({
                    BuyItemData: response.data.response.filter(item => (item.owner_id != item.created_by))
                })

            }
        })
    }

    // ==============================   usercollection API's Start =================================================

    async getCollectionDataAPI() {
        const token = this.token
        this.setState({
            isActive: 3
        })
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserCollection`,
            headers: { authorization: token },
            data: { "user_id": this.id, 'email': this.loginData?.user_email }
            // data: { "user_id": 262, 'email': this.loginData?.user_email }
        }).then(response => {

            if (response.data.success === true) {
                this.setState({
                    collectionData: response.data.response
                })
            }
        })
    }


    userShow(id) {

        setTimeout(() => {
            window.location.href = `${config.baseUrl}UserProfile/` + id.owner_id
        });
    }

    componentDidMount() {
        this.getUserDataAPI()
        this.getWalletDataAPI()
        this.getMyNftAPI()
        this.getCollectionDataAPI()
        this.getUserItemAPI()
        this.getWalletDetailAPI()
        this.getUserOwnerDataAPI()
        this.getBlockChainAPI()
        // setTimeout(() => {
        //     if (window.ethereum) {
        //         const { ethereum } = window;
        //         this.setState({
        //             ConnectWalletAddress: ethereum.selectedAddress
        //         })
        //         localStorage.setItem('walletType', this.state.ConnectWalletAddress)
        //     }
        // }, 1000);
    }



    openModal() {
        this.setState({
            visible: true
        });
    }


    closeModal() {
        this.setState({
            visible: false
        });
    }


    async connectMetasmask() {
        if (window.ethereum) {
            await window.ethereum.send('eth_requestAccounts');
            window.web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.setState({
                ConnectWalletAddress: accounts
            })
            if (this.state.ConnectWalletAddress) {
                this.setState({
                    visible: false
                })
            }

            localStorage.setItem('walletType', this.state.ConnectWalletAddress)
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        else {
            toast.error(`Please install MetaMask to use this dApp!`, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }








    BlockchainStatusAPI(id) {

        let data = {
            user_id: this.id,
            item_edition_id: id.item_edition_id,
            item_id: id.item_id,
            new_owner_address: localStorage.getItem('walletType'),
            claimQuantity: this.state.resale_quantity
        }

        // confirmAlert({
        //     title: 'Confirm to submit',
        //     message: 'Are you sure to Claim this NFT.',
        //     buttons: [
        //         {
        //             label: 'Yes',
        //             onClick: () =>


        axios({
            method: 'post',
            url: `${config.apiUrl}updateblockchainstatus`,
            headers: { "Authorization": this.loginData.Token },
            data: data
        })
            .then(response => {


                if (response.data.success === true) {
                    toast.success('Ownership changed successfully');
                    // this.componentDidMount()
                    this.setState({

                        revealModelClaim: false
                    });
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }

                else if (response.data.success === false) {

                }
                this.setState({
                    isDialogOpen: false,
                })
            })
            .catch(err => {
                toast.error(err.response.data.msg);
                this.setState({
                    isDialogOpen: false,
                    revealModelClaim: false
                })
            })

        //         },
        //         {
        //             label: 'No',
        //         }
        //     ]
        // });
    }



    getUserItemAPI(id, item) {

        this.setState({
            loaderImage: 0
        })
        axios({
            method: 'post',
            url: `${config.apiUrl}getUserItem`,
            headers: { "Authorization": this.loginData.Token },
            data: { 'user_collection_id': 0, 'user_id': this.id, 'limit': 0 }
        })
            .then(response => {


                if (response.data.success === true) {
                    this.setState({
                        userItemData: response.data.response.filter(item => item.bulkNFT == 1),
                        deleteShow: '',
                        loaderImage: 1
                    })

                }

                else if (response.data.success === false) {
                    this.setState({
                        userItemData: [],
                        deleteShow: 1,
                        loaderImage: 1
                    })
                }
            })
            .catch(err => {
                this.setState({
                    userItemData: [],
                    deleteShow: 1,
                    loaderImage: 1

                })
            })
    }


    async getWalletDetailAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getSettings`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': 'admin@digiphynft.io', 'user_id': 1 }
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

    //=====================================  BlockChain Nfts  ============================================

    async getBlockChainAPI() {
        await axios({
            method: 'get',
            // ${localStorage.getItem('walletType')}
            url: `${config.apiUrl}getNFTfromblockchain/${localStorage.getItem('walletType')}/${this.loginData.data.id}`,
        })
            .then(async result => {
                const filterData = await result.data.data.filter(item => (item?.media[0]?.raw.indexOf('https://digiphy.mypinata.cloud') > -1))
                if (result.data.success === true) {
                    this.setState({
                        getBlockChainAPIData: filterData.filter((item) => item.isDigiphyNFT == true),
                        getBlockChainAPIDataBlockFalse: result.data.data.filter((item) => item.isDigiphyNFT == false) && result.data.data.filter((item) => item.rawMetadata.metadata != '')

                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }


    async approveNFTAdmin(type) {

        const token_id = type == 1 ? this.state.sellItem.token_id : this.state.sellItem11.token_id;
        const item = type == 1 ? this.state.sellItem : this.state.sellItem11;

        let ConnectWalletAddress = localStorage.getItem('walletType')
        if (item.isClaimed == 0) {
            this.updateonMarket(type)
            return;
        }

        let fromAddress = ConnectWalletAddress; // get buyeraddress from order table
        let to_address = this.state.getWalletDetailAPIData.public_key; // get admin address


        var web3 = new Web3(window.ethereum);
        var currentNetwork = web3.currentProvider.chainId;
        var chainId = config.chainId;
        this.setState({
            isDialogOpen: true,
        })

        if (currentNetwork != web3.utils.toHex(config.chainId)) {

            toast.error(config.chainMessage);
            this.setState({
                isDialogOpen: false,
            })
            return false;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const contractAddress = item.contractAddress;
        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        var from_address = accounts[0];
        web3.eth.defaultAccount = from_address;

        let balance = await contract.methods.balanceOf(fromAddress, token_id).call();

        if (balance == 0 && item.isClaimed == 1) {
            toast.error("You dont have balance of NFT ID : " + token_id);
            this.setState({
                isDialogOpen: false,
            })
            return false;

        }
        let myToken = await contract.methods.isApprovedForAll(fromAddress, to_address).call();

        if (myToken == false && item.isClaimed == 1) {
            var web3 = new Web3(window.ethereum);
            var currentNetwork = web3.currentProvider.chainId;
            var chainId = config.chainId;
            this.setState({
                isDialogOpen: true,
            })
            if (currentNetwork != web3.utils.toHex(config.chainId)) {


                toast.error(config.chainMessage);
                this.setState({
                    isDialogOpen: false,
                })
                return false;
            }
            try {

                var chainId = currentNetwork;
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                let count = await web3.eth.getTransactionCount(fromAddress);
                web3.eth.defaultAccount = fromAddress;
                const tx_builder = await contract.methods.setApprovalForAll(to_address, true);
                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();
                gasPrice = parseInt(gasPrice) + 200000000;
                let gasLimit = await web3.eth.estimateGas({
                    from: fromAddress,
                    nonce: web3.utils.toHex(count),
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    data: encoded_tx,
                    chainId: chainId,
                });

                let gas_fee = ((parseInt(gasLimit) * parseInt(gasPrice)) / 10 ** 18).toFixed(6)

                const txData = await web3.eth.sendTransaction({
                    nonce: web3.utils.toHex(count),
                    from: fromAddress,
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    data: encoded_tx,
                    value: 0,
                    chainId: chainId,
                });



                if (txData.transactionHash) {
                    this.updateonMarket(type, gas_fee, fromAddress, to_address, txData.transactionHash)

                } else {
                    toast.error(`Approval failed please try again!!!`);
                    return 0
                }
            } catch (err) {

                this.setState({
                    isDialogOpen: false,
                })
                if (err.message.toString().split('insufficient funds')[1]) {
                    toast.error('Transaction reverted : ' + err.message)
                } if (err.message.toString().split('gas required exceeds allowance (0)')[1]) {
                    toast.error('Transaction reverted : ' + 'gas required exceeds allowance')
                }

                else {
                    if (err.toString().split('execution reverted:')[1]) {
                        toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

                    } else {

                        toast.error(err.message);
                    }
                }
                return 0
            }
        }



    }


    //============================  update item ==========================================

    async updateonMarket(item, gas_fee, fromAddress, to_address, transactionHash) {

        this.setState({
            isDialogOpen: true,
        })
        await axios({
            method: 'post',
            url: `${config.apiUrl}updateItemMarket`,
            data: { 'item_id': item == 1 ? this.state.sellItem.item_id : this.state.sellItem11.item_id, 'user_id': this.loginData.data.id, 'quantity': this.state.resale_quantity, 'price': this.state.price, 'sell_type': this.state.sellItem11.sell_type, 'gas_fee': gas_fee, 'sender_wallet': fromAddress, 'receiver_wallet': to_address, 'transaction_hash': transactionHash }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    isDialogOpen: false,
                })
                toast.success('Item is on sale');
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        })
    }


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

        if (e.target.name === 'searchData') {
            this.allSearchAPI(e.target.value)
        }

    }

    loading(id) {

        this.setState({
            allsearchData: id,
            searchData: id.email,
            searchDataList: []
        })
    }


    async paymentShowAPI() {
        if (this.state.userItemData1.is_approved == 0) {
            toast.error('To put on sale your Nft firstly Admin has to be approved this')
            return
        }
        const response = await axios({
            method: 'post',
            url: `${config.apiUrl}itemPurchase`,
            headers: { "Authorization": this.loginData?.Token },
            data: {
                "email": this.state.allsearchData.email ? this.state.allsearchData.email : this.state.searchData, "user_id": this.state.allsearchData.id ? this.state.allsearchData.id : 0,
                "amount": this.state.userItemData1.price ? this.state.userItemData1.price : this.state.userItemData1Claim.price, "sell_type": this.state.userItemData1.sell_type ? this.state.userItemData1.sell_type == 1 ? 'Price' : 'Bid' : this.state.userItemDataTransferNFT.sell_type == 1 ? 'Price' : 'Bid',

                "item_edition_id": this.state.userItemData1.item_edition_id ? this.state.userItemData1.item_edition_id : this.state.userItemDataTransferNFT.item_edition_id,
                "item_id": this.state.userItemData1.item_id ? this.state.userItemData1.item_id : this.state.userItemDataTransferNFT.item_id,
                "user_address": this.state.allsearchData.address,
                "purchased_quantity": this.state.resale_quantity,
                "token_owner_address": this.state.userItemData1.user_address ? this.state.userItemData1.user_address : this.state.userItemDataTransferNFT.user_address,
                "coin_percentage": 0,
                "transferNft": 1
            }
        })
            .then(async response => {
                if (response.data.success) {
                    this.setState({
                        isDialogOpen: false,
                        checkout: false,
                        revealModel: false,
                        revealModelTransferNFT: false
                    })
                    var willSearch = await Swal.fire({
                        title: 'successful!',
                        text: `NFT is transfered to ${this.state.allsearchData.email ? this.state.allsearchData.email : this.state.searchData}`,
                        icon: 'success',
                        width: 500,
                        confirmButtonColor: '#3085d6',
                        allowOutsideClick: false,
                        // showCancelButton: true,
                        confirmButtonText: 'View items',
                        // cancelButtonText: 'No, keep it'
                    });
                    window.location.reload()
                } else {
                    toast.error((!response.data.msg) ? 'Something went wrong! Please try again later.' : response.data.msg, {
                        position: toast.POSITION.TOP_CENTER,
                    })
                    this.setState({
                        isDialogOpen: false,
                        revealModel: false

                    })
                }
            }).catch(err => {

                this.setState({
                    errorMessageSripe: err?.response?.data?.msg,
                    isDialogOpen: false,
                    revealModel: false

                })
            });
    }

    openModalForWallet() {
        this.setState({
            visibleForWallet: true
        });
    }

    closeModalForWallet() {
        this.setState({
            visibleForWallet: false
        });
    }


    clickResell11(id) {

        this.setState({
            transaction_ids: id.transaction_id,
            sellItem: id
        })
    }

    clickResell12(id) {

        this.setState({
            transaction_ids: id.transaction_id,
            sellItem11: id
        })
    }

    //=========================================  BlockChain ====================================

    clickResellBlockChain(id) {
        this.setState({
            sellItemBlockChain: id
        })
    }


    loadingRemove() {
        setTimeout(() => {
            window.location.reload()
        });
    }

    //======================================  Card and ether popup dynamic through state =================

    etherClick(id) {
        if (id === 'cc') {
            this.setState({
                etherClickActive: 0,
                bid_price: '',
                paypalError: ''
            })
        }
        else if (id === 'Ether') {
            this.setState({
                etherClickActive: 1,
                bid_price: '',
                number: '',
                expMonth: '',
                expYear: '',
                cvv: '',
                paypalError: ''
            })
        }
        else if (id === 'Wallet') {
            this.setState({
                etherClickActive: 2,
                bid_price: '',
                number: '',
                expMonth: '',
                expYear: '',
                cvv: '',
                paypalError: ''
            })
        }
        else if (id === 'circlepayment') {
            this.setState({
                etherClickActive: 3,
                bid_price: '',
                number: '',
                expMonth: '',
                expYear: '',
                cvv: '',
                paypalError: ''
            })
        }
    }

    plusQuantity(id) {
        if (id == 1) {
            var qty = parseInt(this.state.resale_quantity) + parseInt(1)
            this.setState({
                'resale_quantity': qty
            })
            if (qty > this.state.sellItem.remainingForSale) {
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
        else if (id == 3) {
            var qty = parseInt(this.state.resale_quantity) + parseInt(1)
            this.setState({
                'resale_quantity': qty
            })
            if (qty > this.state.sellItem11.totalStock) {
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
        else {
            var qty = parseInt(this.state.resale_quantity) + parseInt(1)
            this.setState({
                'resale_quantity': qty
            })
            if (qty > this.state.sellItem.remainingForSale) {
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

    }


    minusQuantity(id) {
        if (id == 1) {
            var qty = parseInt(this.state.resale_quantity) - parseInt(1)
            if (this.state.resale_quantity > 1) {
                this.setState({
                    'resale_quantity': qty
                })
            }


            if (qty > this.state.sellItem.remainingForSale) {
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
        else if (id == 3) {
            var qty = parseInt(this.state.resale_quantity) - parseInt(1)
            if (this.state.resale_quantity > 1) {
                this.setState({
                    'resale_quantity': qty
                })
            }


            if (qty > this.state.sellItem11.totalStock) {
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
        else {
            var qty = parseInt(this.state.resale_quantity) - parseInt(1)
            if (this.state.resale_quantity > 1) {
                this.setState({
                    'resale_quantity': qty
                })
            }


            if (qty > this.state.sellItem.remainingForSale) {
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

    }





    plusQuantityTransferNFT(id) {

        var qty = parseInt(this.state.resale_quantity) + parseInt(1)
        this.setState({
            'resale_quantity': qty
        })
        if (qty > this.state.userItemDataTransferNFT.totalStock) {
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


    minusQuantityTransferNFT(id) {

        var qty = parseInt(this.state.resale_quantity) - parseInt(1)
        if (this.state.resale_quantity > 1) {
            this.setState({
                'resale_quantity': qty
            })
        }


        if (qty > this.state.userItemDataTransferNFT.totalStock) {
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


    //=====================================  BlockChain  ================================

    plusQuantityBlock(id) {

        var qty = parseInt(this.state.resale_quantity) + parseInt(1)
        this.setState({
            'resale_quantity': qty
        })
        if (qty > this.state.sellItemBlockChain.balance) {
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


    minusQuantityBlock(id) {

        var qty = parseInt(this.state.resale_quantity) - parseInt(1)
        if (this.state.resale_quantity > 1) {
            this.setState({
                'resale_quantity': qty
            })
        }


        if (qty > this.state.sellItemBlockChain.balance) {
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


    plusQuantityClaim() {
        var qty = parseInt(this.state.resale_quantity) + parseInt(1)
        this.setState({
            'resale_quantity': qty
        })
        if (qty > this.state.userItemData1Claim.unclaimedNFT) {
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


    minusQuantityClaim() {
        var qty = parseInt(this.state.resale_quantity) - parseInt(1)
        if (this.state.resale_quantity > 1) {
            this.setState({
                'resale_quantity': qty
            })
        }


        if (qty > this.state.userItemData1Claim.unclaimedNFT) {
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


    //===================================== Nft cancel listing ========================================

    plusQuantityCancelListing(id) {

        var qty = parseInt(this.state.resale_quantity) + parseInt(1)
        this.setState({
            'resale_quantity': qty
        })
        if (qty > this.state.cancelListingData.totalStock) {
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


    minusQuantityCancelListing(id) {

        var qty = parseInt(this.state.resale_quantity) - parseInt(1)
        if (this.state.resale_quantity > 1) {
            this.setState({
                'resale_quantity': qty
            })
        }


        if (qty > this.state.cancelListingData.totalStock) {
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




    //===================================================  blockchain  ====================================

    async approveNFTAdminBlockChain(type) {

        let wallet_address = localStorage.getItem('walletType')
        const token_id = this.state.sellItemBlockChain.tokenId
        const item = this.state.sellItemBlockChain


        let to_address = this.state.getWalletDetailAPIData.public_key; // get admin address


        var web3 = new Web3(window.ethereum);
        var currentNetwork = web3.currentProvider.chainId;
        var chainId = config.chainId;
        this.setState({
            isDialogOpen: true,
        })

        if (currentNetwork != web3.utils.toHex(config.chainId)) {

            toast.error(config.chainMessage);
            this.setState({
                isDialogOpen: false,
            })
            return false;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const contractAddress = item.contract.address;
        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        var from_address = accounts[0];
        if (wallet_address.toUpperCase() != from_address.toUpperCase()) {
            toast.error("Please connect with this wallet : " + wallet_address);
            this.setState({
                isDialogOpen: false,
            })
            return false;
        }

        web3.eth.defaultAccount = from_address;
        let balance = await contract.methods.balanceOf(from_address, token_id).call();

        if (balance == 0) {
            toast.error("You dont have balance of NFT ID : " + token_id);
            this.setState({
                isDialogOpen: false,
            })
            return false;

        }




        let myToken = await contract.methods.isApprovedForAll(from_address, to_address).call();

        if (myToken == false) {
            var web3 = new Web3(window.ethereum);
            var currentNetwork = web3.currentProvider.chainId;
            var chainId = config.chainId;
            this.setState({
                isDialogOpen: true,
            })
            if (currentNetwork != web3.utils.toHex(config.chainId)) {


                toast.error(config.chainMessage);
                this.setState({
                    isDialogOpen: false,
                })
                return false;
            }
            try {

                var chainId = currentNetwork;
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                let count = await web3.eth.getTransactionCount(from_address);
                web3.eth.defaultAccount = from_address;
                const tx_builder = await contract.methods.setApprovalForAll(to_address, true);
                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();
                gasPrice = parseInt(gasPrice) + 200000000;
                let gasLimit = await web3.eth.estimateGas({
                    from: from_address,
                    nonce: web3.utils.toHex(count),
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    data: encoded_tx,
                    chainId: chainId,
                });

                let gas_fee = ((parseInt(gasLimit) * parseInt(gasPrice)) / 10 ** 18).toFixed(6)

                const txData = await web3.eth.sendTransaction({
                    nonce: web3.utils.toHex(count),
                    from: from_address,
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    data: encoded_tx,
                    value: 0,
                    chainId: chainId,
                });



                if (txData.transactionHash) {
                    this.updateonMarketBlockChain(type, gas_fee)

                } else {
                    toast.error(`Approval failed please try again!!!`);
                    return 0
                }
            } catch (err) {

                this.setState({
                    isDialogOpen: false,
                })
                if (err.message.toString().split('insufficient funds')[1]) {
                    toast.error('Transaction reverted : ' + err.message)
                } if (err.message.toString().split('gas required exceeds allowance (0)')[1]) {
                    toast.error('Transaction reverted : ' + 'gas required exceeds allowance')
                }

                else {
                    if (err.toString().split('execution reverted:')[1]) {
                        toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

                    } else {

                        toast.error(err.message);
                    }
                }
                return 0
            }
        }
        else {
            this.updateonMarketBlockChain(type)
        }


    }


    //============================  update item ==========================================

    async updateonMarketBlockChain(item, gas_fee) {
        let user_address = localStorage.getItem('walletType')
        this.setState({
            isDialogOpen: true,
        })
        await axios({
            method: 'post',
            url: `${config.apiUrl}updateWalletItemMarket`,
            data: { 'item_id': this.state.sellItemBlockChain.tokenId, 'user_id': this.loginData.data.id, 'quantity': this.state.resale_quantity, 'price': this.state.price, 'sell_type': this.state.sellItem11.sell_type, 'gas_fee': gas_fee, 'user_address': user_address }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    isDialogOpen: false,
                })
                toast.success('Item is on sale');
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        })
    }


    cancelListingClick(id) {

        this.setState({
            cancelListingData: id
        })
    }


    async cancelListingAPI() {
        let user_address = localStorage.getItem('walletType')
        this.setState({
            isDialogOpen: true,
        })
        await axios({
            method: 'post',
            url: `${config.apiUrl}cancelListing`,
            data: { 'item_id': this.state.cancelListingData.item_id, 'owner_id': this.loginData.data.id, 'quantity': this.state.resale_quantity }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    isDialogOpen: false,
                })
                toast.success('Item is cancel from listing');
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
        })
    }

    openBlockchain(id) {
        if (id == 0) {
            this.setState({
                showBlockChain: 0,
            })
        }
        else if (id == 1) {
            this.setState({
                showBlockChain: 1,

            })
        }
        localStorage.setItem('tabSelect2', id)

    }

    showBlockChain1Click(id) {
        
        if (id == 0) {
            this.setState({
                showBlockChain1: 0
            })
        }
        else if (id == 1) {
            this.setState({
                showBlockChain1: 1
            })
        }
        else if (id == 2) {
            this.setState({
                showBlockChain1: 2
            })
        }
        
        localStorage.setItem('tabSelect', id)
    }

    showBlockChain2Click(id) {
        if (id == 0) {
            this.setState({
                showBlockChain2: 0
            })
        }
        if (id == 1) {
            this.setState({
                showBlockChain2: 1
            })
        }
        localStorage.setItem('tabSelect1', id)

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
                <Toaster />

                <Dialog
                    title="Warning"
                    icon="warning-sign"
                    style={{
                        color: 'red'
                    }}
                    isOpen={this.state.isDialogOpen}
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

                {this.state.loaderImage === 0 ?
                    <div className="row _post-container_" style={{ height: '366px', marginTop: '260px' }}>
                        <div className="caroselHeight loaderBars">
                            <Loader type="Bars" color="#00BFFF" height={40} width={40} />
                        </div>
                    </div> :
                    <>
                        <div id="content-block" className='mt-0'>


                            <div id="content-block" className='mt-5'>
                                <section id="profile_banner" aria-label="section" className="text-light" style={{
                                    backgroundImage: !this.state.userData.banner || this.state.userData.banner === '' || this.state.userData.banner === null || this.state.userData.banner === undefined || this.state.userData.banner === 'null'
                                        ?
                                        `url(images/breadcrumb-2.jpg)` :
                                        `url(${config.imageUrl1}${this.state.userData.banner})`
                                }} />
                                <section aria-label="section" className="d_coll no-top userprofile-page">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-12 col-xs-12">
                                                <div className="d_profile" style={{ marginBottom: '0px', backgroundSize: 'cover' }}>
                                                    <div className="profile_avatar">
                                                        <div className="d_profile_img"> <img src={this.state.userData.profile_pic != null ?
                                                            config.imageUrl1 + this.state.userData.profile_pic :
                                                            "images/default-user-icon.jpg"} alt="" /><i className="fa fa-check" /></div>
                                                        <div className="profile_name">
                                                            <h4>
                                                                {this.state.userData && this.state.userData.full_name ? this.state.userData.full_name : ''}
                                                                <div className="clearfix" />


                                                                <div className="social-icons mt-0" style={{ backgroundSize: 'cover' }}>
                                                                    {/* <h5 /> */}

                                                                    {!this.state.userData.facebook ? '' : <a target="_blank" href={this.state.userData && this.state.userData.facebook}><img src="https://digiphynft.shop/images/email/facebook.png" className="social-icons-collection" /></a>}
                                                                    {!this.state.userData.twitter ? '' :
                                                                        <a target="_blank" href={this.state.userData && this.state.userData.twitter}><img src="https://digiphynft.shop/images/email/twitter.png" className="social-icons-collection" /></a>}
                                                                    {!this.state.userData.discord ? '' :
                                                                        <a target="_blank" href={this.state.userData && this.state.userData.discord}>
                                                                            <span className=''>
                                                                                <img src="https://digiphynft.shop/images/email/discord.png" style={{ width: '36px', marginTop: '15px', marginRight: '5px' }} /></span></a>}
                                                                    {!this.state.userData.insta ? '' :
                                                                        <a target="_blank" href={this.state.userData && this.state.userData.insta}><img src="https://digiphynft.shop/images/email/instagram.png" className="social-icons-collection" /></a>}
                                                                    {!this.state.userData.telegram ? '' :
                                                                        <a target="_blank" href={this.state.userData && this.state.userData.telegram}><img src="images/telegram.png" className="social-icons-collection" /></a>}
                                                                </div>
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 col-xs-12">
                                                <div className="tab-wrapper style-2 mt-5">
                                                    <div className="tab-nav-wrapper">
                                                        <div className='row justify-content-center'>
                                                            <div className="nav-tab  clearfix">
                                                                <div className={this.state.showBlockChain == 0 ? "nav-tab-item active" : "nav-tab-item "} onClick={this.openBlockchain.bind(this, 0)}>
                                                                    <span>DigiPhy NFTs</span>
                                                                </div>
                                                                <div className={this.state.showBlockChain == 1 ? "nav-tab-item active" : "nav-tab-item "} onClick={this.openBlockchain.bind(this, 1)}>

                                                                    <span>Blockchain NFTs</span>
                                                                </div>



                                                            </div>
                                                        </div>


                                                        <div className='row justify-content-center'>
                                                            <div className="nav-tab  clearfix">
                                                                {/* <div className="nav-tab-item active">
                                                                <span>Owned</span>
                                                            </div>
                                                            <div className="nav-tab-item ">

                                                                <span>Created</span>
                                                            </div> */}
                                                                {this.state.showBlockChain == 0 ?
                                                                    <>
                                                                        <div className={this.state.showBlockChain1 == 0 ? "nav-tab-item active" : "nav-tab-item "} onClick={this.showBlockChain1Click.bind(this, 0)}>

                                                                            <span>Created NFTs</span>
                                                                        </div>
                                                                        <div className={this.state.showBlockChain1 == 1 ? "nav-tab-item active" : "nav-tab-item "} onClick={this.showBlockChain1Click.bind(this, 1)} >

                                                                            <span>Bought NFTs</span>
                                                                        </div>
                                                                        <div className={this.state.showBlockChain1 == 2 ? "nav-tab-item active" : "nav-tab-item "} onClick={this.showBlockChain1Click.bind(this, 2)}>
                                                                            <span>Created Collection</span>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div className={this.state.showBlockChain2 == 0 ? "nav-tab-item active" : "nav-tab-item "} onClick={this.showBlockChain2Click.bind(this, 0)}>
                                                                            <span>Created NFTs</span>
                                                                        </div>

                                                                        <div className={this.state.showBlockChain2 == 1 ? "nav-tab-item active" : "nav-tab-item "} onClick={this.showBlockChain2Click.bind(this, 1)}>
                                                                            <span>Collected NFTs</span>
                                                                        </div></>
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="tabs-content clearfix">

                                                        {this.state.showBlockChain == 0 ?
                                                            <>
                                                                <div className={this.state.showBlockChain1 == 0 ? "tab-info active" : "tab-info "}>

                                                                    <div className="row _post-container_">
                                                                        {this.state.userItemData.length === 0 ?
                                                                            <div className='col-sm-12 mb-5' style={{ textAlign: 'center' }}>
                                                                                <img style={{ width: '150px', height: '150px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU' /><br /><br />
                                                                                <p className='text-center text-white'>No NFTS Yet</p>
                                                                            </div>
                                                                            :
                                                                            this.state.userItemData.map((item) => (

                                                                                <div className='col-md-4 col-sm-6 col-xs-12  mb-5'>
                                                                                    <div className="auction-card">
                                                                                        <div className="auction-img">

                                                                                            <div className='buttons_edit_putonsale'>
                                                                                                {(item.remainingForSale > 0) && (item.owner_id == this.loginData?.data?.id) ?
                                                                                                    <>
                                                                                                        {item.unclaimedNFT > 0 ?
                                                                                                            <button className='button_Edit btn btn-primary' style={{ left: '20px' }} type='submit' onClick={this.openModal4.bind(this, item)}>Transfer NFT
                                                                                                            </button> : ''
                                                                                                        }
                                                                                                        {item.unclaimedNFT > 0 ?

                                                                                                            this.state.ConnectWalletAddress ?

                                                                                                                <button className='button_Edit btn btn-primary' style={{ left: '135px' }} type='submit' onClick={this.openModal5.bind(this, item)}>Claim
                                                                                                                </button>
                                                                                                                :
                                                                                                                <button style={{ left: '135px' }} onClick={() => this.openModalForWallet()} className='button_Edit btn btn-primary'>Claim</button> : ''
                                                                                                        }




                                                                                                        <button onClick={this.clickResell11.bind(this, item)} className="button_Edit btn btn-primary" data-toggle="modal" style={{ left: '180px' }} data-target="#modalLoginForm">Put on sale</button>

                                                                                                        {item.totalStock > 0 ?
                                                                                                            <>
                                                                                                                <button onClick={this.cancelListingClick.bind(this, item)} className="button_Edit btn btn-primary" data-toggle="modal" style={{ left: '119px' }} data-target="#modalcancellisting">Cancel Listing</button></> : ''
                                                                                                        }



                                                                                                    </>
                                                                                                    : ''
                                                                                                }
                                                                                            </div>

                                                                                            <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}${item.collection_name.split(' ').join('-')}/${item.name.split(' ').join('-')}/${item.item_edition_id}`}>

                                                                                                {item.file_type === 'audio' ?
                                                                                                    <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                                                                }

                                                                                                {item.file_type === 'image' ?
                                                                                                    <img style={{
                                                                                                        width: '318px',
                                                                                                        height: '258px',
                                                                                                        objectFit: 'contain'
                                                                                                    }} src={`${config.imageUrl1}${item.local_image}`} alt="omg" /> :
                                                                                                    item.file_type === 'video' ?
                                                                                                        // <Player className="preview_image_data" style={{
                                                                                                        //     width: '318px',
                                                                                                        //     height: '258px',
                                                                                                        //     objectFit: 'contain'
                                                                                                        // }} src={`${config.imageUrl1}${item.local_image}`} />
                                                                                                        
                                                                                                        <div onClick={this.targetData.bind(this, item)}>
                                                                                                        <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                                                    </div>
                                                                                                        
                                                                                                        :
                                                                                                        <ReactAudioPlayer
                                                                                                            src={`${config.imageUrl1}${item.local_image}`}

                                                                                                            controls
                                                                                                        />
                                                                                                }
                                                                                                {item.sell_type == 1 ?
                                                                                                    '' :
                                                                                                    <div className="timer2">

                                                                                                        <Countdown
                                                                                                            date={this.getTimeOfStartDate(item.expiry_date)}
                                                                                                            renderer={this.CountdownTimer}
                                                                                                        />
                                                                                                    </div>
                                                                                                }

                                                                                            </Link>
                                                                                        </div>
                                                                                        <div className="auction-info-wrap">

                                                                                            <div className="auction-stock" style={{ margin: '0px' }}>
                                                                                                <p>{item.remainingForSale} In Stock</p>
                                                                                                <h6>INR {item.price} </h6>
                                                                                            </div>
                                                                                            <div className="auction-stock">
                                                                                                <p>{item.totalStock} In Marketplace</p>

                                                                                            </div>
                                                                                            <div className="auction-title">
                                                                                                <h3 title={item.name}>
                                                                                                    <Link to={`${config.baseUrl}${item.collection_name}/${item.name}/${item.item_edition_id}`}> {item.name.length > MAX_LENGTH ?
                                                                                                        (
                                                                                                            `${item.name.substring(0, MAX_LENGTH)}...`
                                                                                                        ) :
                                                                                                        item.name
                                                                                                    }</Link>
                                                                                                </h3>
                                                                                            </div>
                                                                                            {/* <Link to={`${config.baseUrl}${item.item_edition_id}`}>
                                                                        <button
                                                                            type="button"
                                                                            className="btn style5"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#placeBid"
                                                                        >
                                                                            {item.sell_type === 1 ? 'Purchase' : 'Place Bid'}

                                                                        </button>
                                                                    </Link> */}

                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            ))}

                                                                    </div>



                                                                </div>


                                                                <div className={this.state.showBlockChain1 == 1 ? "tab-info active" : "tab-info "}>

                                                                    <div className="row _post-container_">
                                                                        {this.state.BuyItemData.length === 0 ?
                                                                            <div className='col-sm-12 mb-5' style={{ textAlign: 'center' }}>
                                                                                <img style={{ width: '150px', height: '150px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU' /><br /><br />
                                                                                <p className='text-center text-white'>No NFTS Yet</p>
                                                                            </div>
                                                                            :
                                                                            this.state.BuyItemData.map((item) => (

                                                                                <div className='col-md-4 col-sm-6 col-xs-12 mb-5'>
                                                                                    <div className="auction-card">
                                                                                        <div className="auction-img">
                                                                                            <div className='buttons_edit_putonsale'>
                                                                                                {item.unclaimedNFT > 0 ?

                                                                                                    this.state.ConnectWalletAddress ?

                                                                                                        <button className='button_Edit btn btn-primary' style={{ left: '135px' }} type='submit' onClick={this.openModal5.bind(this, item)}>Claim
                                                                                                        </button>
                                                                                                        :
                                                                                                        <button style={{ left: '135px' }} onClick={() => this.openModalForWallet()} className='button_Edit btn btn-primary'>Claim</button> : ''
                                                                                                }

                                                                                                {item.isClaimed != 1 && item.is_on_sale == 0 ?
                                                                                                    <>

                                                                                                        <button className='button_Edit btn btn-primary' style={{ left: '20px' }} type='submit' onClick={this.openModalTransferNFT.bind(this, item)}>Transfer NFT
                                                                                                        </button>
                                                                                                    </>

                                                                                                    : ''}



                                                                                                <button onClick={this.clickResell11.bind(this, item)} className="button_Edit btn btn-primary" data-toggle="modal" style={{ left: '200px' }} data-target="#modalLoginForm">Put on sale</button>

                                                                                                {item.totalStock > 0 ?
                                                                                                    <>
                                                                                                        <br />
                                                                                                        <button onClick={this.cancelListingClick.bind(this, item)} className="button_Edit btn btn-primary" data-toggle="modal" style={{ left: '119px', marginTop: '30px' }} data-target="#modalcancellisting">Cancel Listing</button></> : ''
                                                                                                }
                                                                                            </div>
                                                                                            <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}${item.collection_name.split(' ').join('-')}/${item.name ? item.name.split(' ').join('-') : item.item_name.split(' ').join('-')}/${item.item_edition_id}`}>

                                                                                                {item.file_type === 'audio' ?
                                                                                                    <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                                                                }

                                                                                                {item.file_type === 'image' ?
                                                                                                    <img style={{
                                                                                                        width: '318px',
                                                                                                        height: '258px',
                                                                                                        objectFit: 'contain'
                                                                                                    }} src={`${config.imageUrl1}${item.local_image}`} alt="omg" /> :
                                                                                                    item.file_type === 'video' ?
                                                                                                        // <Player className="preview_image_data" src={`${config.imageUrl1}${item.local_image}`} /> 

                                                                                                        <div onClick={this.targetData.bind(this, item)}>
                                                                                                        <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                                                    </div>
                                                                                                        
                                                                                                        :
                                                                                                        <ReactAudioPlayer
                                                                                                            src={`${config.imageUrl1}${item.local_image}`}

                                                                                                            controls
                                                                                                        />
                                                                                                }
                                                                                                {item.sell_type == 1 ?
                                                                                                    '' :
                                                                                                    <div className="timer2">

                                                                                                        <Countdown
                                                                                                            date={this.getTimeOfStartDate(item.expiry_date)}
                                                                                                            renderer={this.CountdownTimer}
                                                                                                        />
                                                                                                    </div>
                                                                                                }

                                                                                            </Link>
                                                                                        </div>
                                                                                        <div className="auction-info-wrap">
                                                                                            {/* <div className="auction-author-info">
                <div className="author-info">
                    <div className="author-img">
                        {item.profile_pic ?
                            <img src={config.imageUrl1 + item.profile_pic} alt="Image" /> :
                            <img src="images/noimage.webp" alt="Image" />
                        }
                    </div>
                    <div className="author-name">
                        <h6>
                            <Link to={`${config.baseUrl}userprofile/${item.owner_id}`}>{item.full_name}</Link>
                        </h6>
                    </div>
                </div>
                <div className="auction-bid">
                    <span className="item-popularity">
                        <i className="flaticon-heart" />
                        {item.like_count}
                    </span>
                </div>
            </div> */}
                                                                                            <div className="auction-stock" style={{ margin: '0px' }}>

                                                                                                <p>{item.remainingForSale} In Stock</p>
                                                                                                <h6>INR {item.price} </h6>
                                                                                            </div>
                                                                                            <div className="auction-stock">
                                                                                                <p>{item.totalStock} In Marketplace</p>

                                                                                            </div>
                                                                                            <div className="auction-title">
                                                                                                <h3 title={item.name}>
                                                                                                    <Link to={`${config.baseUrl}${item.collection_name.split(' ').join('-')}/${item.name ? item.name.split(' ').join('-') : item.item_name.split(' ').join('-')}/${item.item_edition_id}`}>{item.name ? item.name : item.item_name.length > MAX_LENGTH ?
                                                                                                        (
                                                                                                            `${item.name ? item.name : item.item_name.substring(0, MAX_LENGTH)}...`
                                                                                                        ) :
                                                                                                        item.name ? item.name : item.item_name
                                                                                                    } </Link>
                                                                                                </h3>
                                                                                            </div>
                                                                                            {/* <Link to={`${config.baseUrl}${item.item_edition_id}`}>
                        <button
                            type="button"
                            className="btn style5"
                            data-bs-toggle="modal"
                            data-bs-target="#placeBid"
                        >
                            {item.sell_type === 1 ? 'Purchase' : 'Place Bid'}

                        </button>
                    </Link> */}
                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            ))}

                                                                    </div>



                                                                </div>

                                                                <div className={this.state.showBlockChain1 == 2 ? "tab-info active" : "tab-info "}>
                                                                    <div className="row _post-container_ trending-collection">
                                                                        {this.state.collectionData.length > 0 ?
                                                                            this.state.collectionData.map((item) => (
                                                                                <div className="col-lg-4 col-md-6 mb-5">
                                                                                    <div className="auction-list box-hover-effect">
                                                                                        <div className="auction-img">
                                                                                            {!item.profile_pic ?
                                                                                                <Link to={`${config.baseUrl}collectiondetail/${item.name}`}>
                                                                                                    <img src="images/author-item-1.jpg" alt="" />
                                                                                                </Link>
                                                                                                :
                                                                                                <Link to={`${config.baseUrl}collectiondetail/${item.name}`}>
                                                                                                    <img src={`${config.imageUrl1}` + item.profile_pic} alt="" />
                                                                                                </Link>
                                                                                            }
                                                                                        </div>
                                                                                        <div className="chakra-stack css-1wdu7zf">
                                                                                            <div className="d-flex">
                                                                                                <div className="seaflightImage">
                                                                                                    <div
                                                                                                        aria-label="Sea Flights"
                                                                                                        role="image"
                                                                                                        className="sea-img"
                                                                                                        style={{
                                                                                                            backgroundImage: !item.profile_pic
                                                                                                                ?
                                                                                                                `url(images/author-item-1.jpg)` :
                                                                                                                `url(${config.imageUrl1}${item.profile_pic})`


                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="bottom">
                                                                                            <div className="chakra-stack css-1npz8pa">
                                                                                                <h3 className="chakra-text css-1yfa4pt mb-2">
                                                                                                    <a href="#">{item.name}</a>
                                                                                                </h3>
                                                                                                <svg
                                                                                                    viewBox="0 0 24 24"
                                                                                                    focusable="false"
                                                                                                    className="chakra-icon chakra-icon css-100vr6x"
                                                                                                >
                                                                                                    <path d="" fill="currentColor" />
                                                                                                </svg>
                                                                                                <div className="css-17xejub" />
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                            :
                                                                            <div style={{ textAlign: 'center', marginLeft: '44%' }}>
                                                                                <img style={{ width: '150px', height: '150px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU' /><br /><br />
                                                                                <p className='text-white'><b>No Collection To Display</b></p>
                                                                            </div>}


                                                                    </div>

                                                                </div>

                                                            </>
                                                            :
                                                            <>

                                                                {/* //======================= BlockChain NFTs */}

                                                                <div className={this.state.showBlockChain2 == 0 ? "tab-info active" : "tab-info "}>

                                                                    <div className="row _post-container_">
                                                                        {this.state.getBlockChainAPIData.length === 0 ?
                                                                            <div className='col-sm-12 mb-5' style={{ textAlign: 'center' }}>
                                                                                <img style={{ width: '150px', height: '150px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU' /><br /><br />
                                                                                <p className='text-center text-white'>No NFTS Yet</p>
                                                                            </div>
                                                                            :
                                                                            this.state.getBlockChainAPIData.map((item) => (

                                                                                <div className='col-md-4 col-sm-6 col-xs-12 mb-5'>
                                                                                    <div className="auction-card">
                                                                                        <div className="auction-img">
                                                                                            {item.balance > 0 ?
                                                                                                <div className='buttons_edit_putonsale'>




                                                                                                    <button onClick={this.clickResellBlockChain.bind(this, item)} className="button_Edit btn btn-primary" data-toggle="modal" style={{ left: '200px' }} data-target="#modalLoginFormBlockChain">Put on sale</button>
                                                                                                    : ''

                                                                                                </div> : ''
                                                                                            }

                                                                                            <Link
                                                                                                to=
                                                                                                {item.file_type === 'video' ?
                                                                                                    '#/'
                                                                                                    : "#/"}
                                                                                            >

                                                                                                {item.file_type === 'audio' ?
                                                                                                    <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                                                                }

                                                                                                {item.file_type === 'image' ?
                                                                                                    <img style={{
                                                                                                        width: '318px',
                                                                                                        height: '258px',
                                                                                                        objectFit: 'contain'
                                                                                                    }} src={item.rawMetadata.image} alt="omg" />
                                                                                                    :
                                                                                                    item.file_type === 'video' ?
                                                                                                        // <Player className="preview_image_data" src={`${item.rawMetadata.image}`} /> 
                                                                                                        <div onClick={this.targetData.bind(this, item.rawMetadata)}>
                                                                                                        <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                                                    </div>
                                                                                                        :
                                                                                                        <img style={{
                                                                                                            width: '318px',
                                                                                                            height: '258px',
                                                                                                            objectFit: 'contain'
                                                                                                        }} src={item.rawMetadata.image} alt="omg" />
                                                                                                }


                                                                                            </Link>
                                                                                        </div>
                                                                                        <div className="auction-info-wrap">
                                                                                            {/* <div className="auction-author-info">
                <div className="author-info">
                    <div className="author-img">
                        {item.profile_pic ?
                            <img src={config.imageUrl1 + item.profile_pic} alt="Image" /> :
                            <img src="images/noimage.webp" alt="Image" />
                        }
                    </div>
                    <div className="author-name">
                        <h6>
                            <Link to={`${config.baseUrl}userprofile/${item.owner_id}`}>{item.full_name}</Link>
                        </h6>
                    </div>
                </div>
                <div className="auction-bid">
                    <span className="item-popularity">
                        <i className="flaticon-heart" />
                        {item.like_count}
                    </span>
                </div>
            </div> */}
                                                                                            <div className="auction-stock">
                                                                                                <p>{item.balance ? item.balance : 0} In Stock</p>
                                                                                                {/* <h6>INR {item.price} </h6> */}
                                                                                            </div>
                                                                                            <div className="auction-title">
                                                                                                <h3 title={item.rawMetadata.name}>
                                                                                                    <Link to="#"
                                                                                                    // {`${config.baseUrl}${item.collection_name.split(' ').join('-')}/${item.name ? item.name.split(' ').join('-') : item.item_name.split(' ').join('-')}/${item.item_edition_id}`}
                                                                                                    >
                                                                                                        {item?.rawMetadata?.name > MAX_LENGTH ?
                                                                                                            (
                                                                                                                `${item.rawMetadata.name ? item.rawMetadata.name : item.rawMetadata.name.substring(0, MAX_LENGTH)}...`

                                                                                                            ) :
                                                                                                            item.rawMetadata.name ? item.rawMetadata.name : item.rawMetadata.name
                                                                                                        } </Link>
                                                                                                </h3>
                                                                                            </div>
                                                                                            {/* <Link to={`${config.baseUrl}${item.item_edition_id}`}>
                        <button
                            type="button"
                            className="btn style5"
                            data-bs-toggle="modal"
                            data-bs-target="#placeBid"
                        >
                            {item.sell_type === 1 ? 'Purchase' : 'Place Bid'}

                        </button>
                    </Link> */}
                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            ))}

                                                                    </div>



                                                                </div>

                                                                <div className={this.state.showBlockChain2 == 1 ? "tab-info active" : "tab-info "}>

                                                                    <div className="row _post-container_">
                                                                        {this.state.getBlockChainAPIDataBlockFalse.length === 0 ?
                                                                            <div className='col-sm-12 mb-5' style={{ textAlign: 'center' }}>
                                                                                <img style={{ width: '150px', height: '150px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU' /><br /><br />
                                                                                <p className='text-center text-white'>No NFTS Yet</p>
                                                                            </div>
                                                                            :
                                                                            this.state.getBlockChainAPIDataBlockFalse.map((item) => (

                                                                                <div className='col-md-4 col-sm-6 col-xs-12 mb-5'>
                                                                                    <div className="auction-card">
                                                                                        <div className="auction-img">
                                                                                        {item.balance > 0 ?
                                                                                                <div className='buttons_edit_putonsale'>




                                                                                                    <button onClick={this.clickResellBlockChain.bind(this, item)} className="button_Edit btn btn-primary" data-toggle="modal" style={{ left: '200px' }} data-target="#modalLoginFormBlockChain">Put on sale</button>
                                                                                                    : ''

                                                                                                </div> : ''
                                                                                            }
                                                                                            {/* {item.balance > 0 ?
                                                                                            <div className='buttons_edit_putonsale'>




                                                                                                <button onClick={this.clickResellBlockChain.bind(this, item)} className="button_Edit btn btn-primary" data-toggle="modal" style={{ left: '200px' }} data-target="#modalLoginFormBlockChain">Put on sale</button>
                                                                                                : ''

                                                                                            </div> : ''
                                                                                        } */}
                                                                                            {item.file_type === 'video' ?

                                                                                                // <Player className="preview_image_data" src={`${item.rawMetadata.image}`} />
                                                                                                <div onClick={this.targetData.bind(this, item.rawMetadata)}>
                                                                                                <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                                            </div>

                                                                                                :
                                                                                                <img style={{
                                                                                                    width: '318px',
                                                                                                    height: '258px',
                                                                                                    objectFit: 'contain'
                                                                                                }} src={
                                                                                                    (item.media[0]?.gateway) ? item.media[0]?.gateway
                                                                                                        :
                                                                                                        ((item.rawMetadata?.image) ? item.rawMetadata?.image?.replace('https://ipfs.io/ipfs/', "ipfs://") : item.rawMetadata?.image_url?.replace('https://ipfs.io/ipfs/', "ipfs://"))} alt="omg" />

                                                                                            }


                                                                                            {/* <Link
                                                                                            to=
                                                                                            {item.file_type === 'video' ?
                                                                                                '#/'
                                                                                                : "#/"}
                                                                                        >

                                                                                            {item.file_type === 'audio' ?
                                                                                                <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                                                            }

                                                                                            {item.file_type === 'image' ?
                                                                                                <img style={{
                                                                                                    width: '318px',
                                                                                                    height: '258px',
                                                                                                    objectFit: 'contain'
                                                                                                }} src={item.rawMetadata.image} alt="omg" />
                                                                                                :
                                                                                                item.file_type === 'video' ?
                                                                                                    <Player className="preview_image_data" src={`${item.rawMetadata.image}`} /> :
                                                                                                    <img style={{
                                                                                                        width: '318px',
                                                                                                        height: '258px',
                                                                                                        objectFit: 'contain'
                                                                                                    }} src={item.rawMetadata.image} alt="omg" />
                                                                                            }


                                                                                        </Link> */}
                                                                                        </div>
                                                                                        <div className="auction-info-wrap">
                                                                                            {/* <div className="auction-author-info">
                <div className="author-info">
                    <div className="author-img">
                        {item.profile_pic ?
                            <img src={config.imageUrl1 + item.profile_pic} alt="Image" /> :
                            <img src="images/noimage.webp" alt="Image" />
                        }
                    </div>
                    <div className="author-name">
                        <h6>
                            <Link to={`${config.baseUrl}userprofile/${item.owner_id}`}>{item.full_name}</Link>
                        </h6>
                    </div>
                </div>
                <div className="auction-bid">
                    <span className="item-popularity">
                        <i className="flaticon-heart" />
                        {item.like_count}
                    </span>
                </div>
            </div> */}
                                                                                            <div className="auction-stock">
                                                                                                <p>{item.balance == null ? 1 : item.balance} In Stock</p>
                                                                                                {/* <h6>INR {item.price} </h6> */}
                                                                                            </div>
                                                                                            <div className="auction-title">
                                                                                                <h3 title={item.rawMetadata.name}>
                                                                                                    <a target="_blank" href={`https://opensea.io/assets/matic/${item.contract.address}/${item.tokenId}`}
                                                                                                    // {`${config.baseUrl}${item.collection_name.split(' ').join('-')}/${item.name ? item.name.split(' ').join('-') : item.item_name.split(' ').join('-')}/${item.item_edition_id}`}
                                                                                                    >
                                                                                                        {item?.rawMetadata?.name > MAX_LENGTH ?
                                                                                                            (
                                                                                                                `${item.rawMetadata.name ? item.rawMetadata.name : item.rawMetadata.name.substring(0, MAX_LENGTH)}...`

                                                                                                            ) :
                                                                                                            item.rawMetadata.name ? item.rawMetadata.name : item.rawMetadata.name
                                                                                                        } </a>
                                                                                                </h3>
                                                                                            </div>
                                                                                            {/* <Link to={`${config.baseUrl}${item.item_edition_id}`}>
                        <button
                            type="button"
                            className="btn style5"
                            data-bs-toggle="modal"
                            data-bs-target="#placeBid"
                        >
                            {item.sell_type === 1 ? 'Purchase' : 'Place Bid'}

                        </button>
                    </Link> */}
                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            ))}

                                                                    </div>



                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </section>


                                <br /><br />


                                <Modal visible={this.state.visible} width="400" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                                    <div className='header_modal connect_wallet'>
                                        <div className='modal-header text-right'>
                                            <button className='close' onClick={() => this.closeModal()}><span>x</span></button>
                                        </div>
                                        <div className='modal-body'>
                                            <h1 class="ant-typography title">Connect Wallet</h1>
                                            <p class="desc">Please connect your wallet to continue. The system supports the following wallets</p>
                                            <br />
                                            <button type="button" class="ant-btn btn" onClick={this.connectMetasmask.bind(this)}>
                                                <img class="btn__icon-logo" src="images/meta.svg" />
                                                <span>MetaMask</span>
                                                <img class="btn__icon-right" src="images/right_arrow.svg" />
                                            </button>
                                            <button type="button" class="ant-btn btn">
                                                <img class="btn__icon-logo" src="images/torus.webp" />
                                                <span>Torus</span>
                                                <img class="btn__icon-right" src="images/right_arrow.svg" />
                                            </button>

                                        </div>

                                    </div>

                                </Modal>


                                <Modal visible={this.state.revealModel} width="500" effect="fadeInUp" onClickAway={() => this.closeModal4()}>
                                    <div className="">
                                        <div className='header_modal creditcard'>
                                            <div className='modal-header text-right d-flex pt-4 pb-4'>
                                                <h1 className="ant-typography title text-center">Transfer this NFT</h1>
                                                <button className='close mt-1' onClick={() => this.closeModal4()}><span>x</span></button>
                                            </div>
                                            <div className='modal-body text-left p-5'>
                                                <form className="input-search" onSubmit={(e => e.preventDefault())}>
                                                    <div className=''>
                                                        <p>Search User By Email </p>
                                                        <input type="text" style={{ color: '#fff' }} autoComplete="off" className="form-control" value={this.state.searchData} name="searchData" onChange={this.onChange} placeholder="Search" />
                                                        <i className="fa fa-search"></i>

                                                        <ul className="search_ul" style={{ display: this.state.searchDataList.length === 0 ? 'none' : 'block', overflowX: 'hidden' }}>
                                                            {this.state.searchDataList.map((item, i) => {

                                                                return (
                                                                    <>


                                                                        {/* <p style={{color:'#000'}}>People</p> */}
                                                                        <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.user_name ? item.user_name : item.full_name} >
                                                                            <div onClick={this.loading.bind(this, item)}>
                                                                                <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                                                    ? 'images/noimage.webp'
                                                                                    :
                                                                                    `${config.imageUrl1}${item.profile_pic}`} style={{ height: '35px', width: '35px', borderRadius: '50%' }} alt="" />
                                                                                <span data-id={item.id} style={{ marginLeft: "10px", position: "relative", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.user_name ? item.user_name : item.full_name}</span>
                                                                                <br />
                                                                                <span data-id={item.id} style={{ marginLeft: "42px", position: "relative", top: "-15px", color: "rgba(0, 0, 0, 0.54)" }}>{item.email}</span>


                                                                            </div>
                                                                        </li></>


                                                                )


                                                            })}
                                                        </ul>
                                                        {/* <div className='col-md-4'> */}




                                                    </div>
                                                    <div className="md-form ">
                                                        <div data-error="wrong" data-success="right" for="defaultForm-pass" style={{ marginRight: '60px', marginTop: "10px" }}>Quantity<span className="error-asterick"> *</span></div>
                                                        <div className="col-md-12 mt-3" style={{ marginLeft: '-15px' }}>
                                                            <div class="input-group">
                                                                <span class="input-group-btn" style={{ marginRight: '31px' }}>
                                                                    <button type="button" onClick={this.minusQuantity.bind(this, 1)} class="btn btn-primary btn-number" data-type="minus" data-field="quant[2]">
                                                                        <span class="glyphicon glyphicon-minus"></span>
                                                                    </button>
                                                                </span>
                                                                <input type="text" onKeyPress={(event) => {
                                                                    if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }} disabled className="form-control border-form" name="resale_quantity" placeholder="Quantity" value={this.state.resale_quantity}
                                                                    onChange={this.onChange} style={{ fontSize: '12px', height: '50px', width: '20px', color: "#fff", zIndex: "0" }} />


                                                                <span class="input-group-btn">
                                                                    <button type="button" onClick={this.plusQuantity.bind(this, 1)} class="btn btn-primary btn-number" data-type="plus" data-field="quant[2]">
                                                                        <span class="glyphicon glyphicon-plus"></span>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {this.state.errorAvailable === '1' ?
                                                        <p style={{ color: 'red', textAlign: 'initial' }}>Quantity must be less than Edition</p>
                                                        :
                                                        this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                                            ''
                                                    }
                                                    {/* || this.state.userCheck == false */}
                                                    <button className='btn btn-primary' disabled={this.state.errorAvailable === '1' || !this.state.searchData} type="submit" onClick={this.paymentShowAPI} style={{
                                                        width: 'auto',
                                                        marginTop: '8px',
                                                        padding: '9px',
                                                        height: 'auto'
                                                    }}>Transfer</button>

                                                    {/* </div> */}
                                                    {/* </datalist> */}
                                                </form>
                                            </div>




                                        </div>

                                    </div>

                                </Modal>





                                <Modal visible={this.state.revealModelTransferNFT} width="500" effect="fadeInUp" onClickAway={() => this.closeModalTraopenModalTransferNFT()}>
                                    <div className="">
                                        <div className='header_modal creditcard'>
                                            <div className='modal-header text-right d-flex pt-4 pb-4'>
                                                <h1 className="ant-typography title text-center">Transfer this NFT</h1>
                                                <button className='close mt-1' onClick={() => this.closeModalTraopenModalTransferNFT()}><span>x</span></button>
                                            </div>
                                            <div className='modal-body text-left p-5'>
                                                <form className="input-search" onSubmit={(e => e.preventDefault())}>
                                                    <div className=''>
                                                        <p>Search User By Email</p>
                                                        <input type="text" style={{ color: '#fff' }} autoComplete="off" className="form-control" value={this.state.searchData} name="searchData" onChange={this.onChange} placeholder="Search" />
                                                        <i className="fa fa-search"></i>

                                                        <ul className="search_ul" style={{ display: this.state.searchDataList.length === 0 ? 'none' : 'block', overflowX: 'hidden' }}>
                                                            {this.state.searchDataList.map((item, i) => {

                                                                return (
                                                                    <>


                                                                        {/* <p style={{color:'#000'}}>People</p> */}
                                                                        <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.user_name ? item.user_name : item.full_name} >
                                                                            <div onClick={this.loading.bind(this, item)}>
                                                                                <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                                                    ? 'images/noimage.webp'
                                                                                    :
                                                                                    `${config.imageUrl1}${item.profile_pic}`} style={{ height: '35px', width: '35px', borderRadius: '50%' }} alt="" />
                                                                                <span data-id={item.id} style={{ marginLeft: "10px", position: "relative", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.user_name ? item.user_name : item.full_name}</span>
                                                                                <br />
                                                                                <span data-id={item.id} style={{ marginLeft: "42px", position: "relative", top: "-15px", color: "rgba(0, 0, 0, 0.54)" }}>{item.email}</span>


                                                                            </div>
                                                                        </li></>


                                                                )


                                                            })}
                                                        </ul>
                                                        {/* <div className='col-md-4'> */}




                                                    </div>
                                                    <div className="md-form ">
                                                        <div data-error="wrong" data-success="right" for="defaultForm-pass" style={{ marginRight: '60px' }}>Quantity<span className="error-asterick"> *</span></div>
                                                        <div className="col-md-12 mt-3" style={{ marginLeft: '-15px' }}>
                                                            <div class="input-group">
                                                                <span class="input-group-btn" style={{ marginRight: '31px' }}>
                                                                    <button type="button" onClick={this.minusQuantityTransferNFT.bind(this, 1)} class="btn btn-primary btn-number" data-type="minus" data-field="quant[2]">
                                                                        <span class="glyphicon glyphicon-minus"></span>
                                                                    </button>
                                                                </span>
                                                                <input type="text" onKeyPress={(event) => {
                                                                    if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }} disabled className="form-control border-form" name="resale_quantity" placeholder="Quantity" value={this.state.resale_quantity}
                                                                    onChange={this.onChange} style={{ fontSize: '12px', height: '50px', width: '20px', color: "#fff", zIndex: "0" }} />


                                                                <span class="input-group-btn">
                                                                    <button type="button" onClick={this.plusQuantityTransferNFT.bind(this, 1)} class="btn btn-primary btn-number" data-type="plus" data-field="quant[2]">
                                                                        <span class="glyphicon glyphicon-plus"></span>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {this.state.errorAvailable === '1' ?
                                                        <p style={{ color: 'red', textAlign: 'initial' }}>Quantity must be less than Edition</p>
                                                        :
                                                        this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                                            ''
                                                    }

                                                    <button className='btn btn-primary' disabled={this.state.errorAvailable === '1' || !this.state.searchData} type="submit" onClick={this.paymentShowAPI} style={{
                                                        width: 'auto',
                                                        marginTop: '8px',
                                                        padding: '9px',
                                                        height: 'auto'
                                                    }}>Transfer</button>

                                                    {/* </div> */}
                                                    {/* </datalist> */}
                                                </form>
                                            </div>




                                        </div>

                                    </div>

                                </Modal>




                                <Modal visible={this.state.visibleForWallet} width="400" effect="fadeInUp" onClickAway={() => this.closeModalForWallet()}>
                                    <div className='header_modal connect_wallet'>
                                        <div className='modal-header text-right'>
                                            <button className='close' onClick={() => this.closeModalForWallet()}><span>x</span></button>
                                        </div>
                                        <div className='modal-body'>
                                            <h1 class="ant-typography title">Connect Wallet</h1>
                                            <p class="desc">Please connect your wallet to continue. The system supports the following wallets</p>
                                            <br />
                                            <button type="button" class="ant-btn btn" onClick={this.connectMetasmask.bind(this)}>
                                                <img class="btn__icon-logo" src="images/meta.svg" />
                                                <span>MetaMask</span>
                                                <img class="btn__icon-right" src="images/right_arrow.svg" />
                                            </button>
                                            <button type="button" class="ant-btn btn">
                                                <img class="btn__icon-logo" src="images/torus.webp" />
                                                <span>Torus</span>
                                                <img class="btn__icon-right" src="images/right_arrow.svg" />
                                            </button>

                                        </div>

                                    </div>

                                </Modal>


                                <Modal visible={this.state.revealModelClaim} width="500" effect="fadeInUp" onClickAway={() => this.closeModal5()}>
                                    <div className="">
                                        <div className='header_modal creditcard'>
                                            <div className='modal-header text-right d-flex pt-4 pb-4'>
                                                <h1 className="ant-typography title text-center">Claim this NFT</h1>
                                                <button className='close mt-1' onClick={() => this.closeModal5()}><span>x</span></button>
                                            </div>
                                            <div className='modal-body text-left p-5'>
                                                <form className="input-search" onSubmit={(e => e.preventDefault())}>

                                                    <div className="md-form ">
                                                        <div data-error="wrong" data-success="right" for="defaultForm-pass" style={{ marginRight: '60px' }}>Quantity<span className="error-asterick"> *</span></div>
                                                        <div className="col-md-12 mt-3" style={{ marginLeft: '-15px' }}>
                                                            <div class="input-group">
                                                                <span class="input-group-btn" style={{ marginRight: '31px' }}>
                                                                    <button type="button" onClick={this.minusQuantityClaim.bind(this)} class="btn btn-primary btn-number" data-type="minus" data-field="quant[2]">
                                                                        <span class="glyphicon glyphicon-minus"></span>
                                                                    </button>
                                                                </span>
                                                                <input type="text" onKeyPress={(event) => {
                                                                    if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }} disabled className="form-control border-form" name="resale_quantity" placeholder="Quantity" value={this.state.resale_quantity}
                                                                    onChange={this.onChange} style={{ fontSize: '12px', height: '50px', width: '20px', color: "#fff", zIndex: "0" }} />


                                                                <span class="input-group-btn">
                                                                    <button type="button" onClick={this.plusQuantityClaim.bind(this)} class="btn btn-primary btn-number" data-type="plus" data-field="quant[2]">
                                                                        <span class="glyphicon glyphicon-plus"></span>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {this.state.errorAvailable === '1' ?
                                                        <p style={{ color: 'red', textAlign: 'initial' }}>Quantity must be less than Edition</p>
                                                        :
                                                        this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                                            ''
                                                    }

                                                    <button className='btn btn-primary' type="submit" disabled={this.state.errorAvailable === '1'} onClick={this.BlockchainStatusAPI.bind(this, this.state.userItemData1Claim)} style={{
                                                        width: 'auto',
                                                        marginTop: '8px',
                                                        padding: '9px',
                                                        height: 'auto'
                                                    }}>Claim</button>

                                                    {/* </div> */}
                                                    {/* </datalist> */}
                                                </form>
                                            </div>




                                        </div>

                                    </div>

                                </Modal>

                            </div>
                        </div>
                    </>
                }


                <Footer />


                <div className="modal fade" id="modalLoginForm" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true" style={{ background: 'rgba(0, 0, 0,0.7)' }}>
                    <div className="modal-dialog" role="document" style={{ boxShadow: "0px 0px 11px 0px #fff" }}>


                        <div className="modal-content">
                            <div className="modal-header text-center">
                                <h4 className="modal-title w-100 font-weight-bold" style={{ color: "#fff" }}><strong>Publish for Sell</strong> </h4>
                                <button type="button" className="close" onClick={this.loadingRemove.bind(this)} data-dismiss="modal" aria-label="Close" style={{ marginTop: '-23px' }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body mx-3">


                                <div className="md-form ">
                                    {/* <i className="fas fa-envelope prefix grey-text"></i> */}
                                    <div data-error="wrong" className='mb-3' data-success="right" for="defaultForm-email" style={{ marginRight: "15px", textAlign: 'initial' }}>Price (₹)<span className="error-asterick"> *</span></div>
                                    {/* <br /> */}
                                    <input type="text" onKeyPress={(event) => {
                                        if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }} name="price" placeholder='Price' onChange={this.onChange} value={this.state.price} className="form-control validate" />
                                </div>
                                <br />
                                {this.state.sellItem?.sell_type == 2 ?
                                    <div className="md-form">
                                        {/* <i className="fas fa-lock prefix grey-text"></i> */}
                                        <div data-error="wrong" className='mb-3' data-success="right" for="defaultForm-pass">Expiry Date<span className="error-asterick"> *</span></div>
                                        {/* <br /> */}
                                        <DatePicker calendarAriaLabel="true" isOpen="true" className="form-control" autoFocus="true"
                                            onChange={this.handleChangeExpiry.bind(this)}
                                            value={this.state.expiry_date} minDate={new Date()}
                                            name="expiry_date"
                                        />
                                    </div> : ''

                                }
                                <br />
                                <div className="row">
                                    <div className="md-form ">
                                        <div data-error="wrong" data-success="right" for="defaultForm-pass" style={{ marginRight: '60px' }}>Quantity<span className="error-asterick"> *</span></div>
                                        <div className="col-md-8 mt-3">
                                            <div class="input-group">
                                                <span class="input-group-btn" style={{ marginRight: '31px' }}>
                                                    <button type="button" onClick={this.minusQuantity.bind(this)} class="btn btn-primary btn-number" data-type="minus" data-field="quant[2]">
                                                        <span class="glyphicon glyphicon-minus"></span>
                                                    </button>
                                                </span>
                                                <input type="text" onKeyPress={(event) => {
                                                    if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }} disabled className="form-control border-form" name="resale_quantity" placeholder="Quantity" value={this.state.resale_quantity}
                                                    onChange={this.onChange} style={{ fontSize: '12px', height: '28px', width: '20px', color: "#fff", zIndex: "0" }} />


                                                <span class="input-group-btn">
                                                    <button type="button" onClick={this.plusQuantity.bind(this)} class="btn btn-primary btn-number" data-type="plus" data-field="quant[2]">
                                                        <span class="glyphicon glyphicon-plus"></span>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.errorAvailable === '1' ?
                                    <p style={{ color: 'red', textAlign: 'initial' }}>Quantity must be less than Edition</p>
                                    :
                                    this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                        ''
                                }
                                <br />
                                {/* <p>Payable amount : {this.state.getWalletDetailAPIData.resale_charges} ETH</p> */}
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button type="submit" disabled={this.state.errorAvailable === '1' || !this.state.price} onClick={this.approveNFTAdmin.bind(this, 1)} className="btn btn-primary col-sm-12 size-1" >Publish on Sale</button>

                            </div>

                        </div>
                    </div>
                </div>



                <div className="modal fade" id="modalLoginForm12" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true" style={{ background: 'rgba(0, 0, 0,0.7)' }}>
                    <div className="modal-dialog" role="document" style={{ boxShadow: "0px 0px 11px 0px #fff" }}>


                        <div className="modal-content">
                            <div className="modal-header text-center">
                                <h4 className="modal-title w-100 font-weight-bold" style={{ color: "#fff" }}><strong>Publish for Sell</strong> </h4>
                                <button type="button" className="close" onClick={this.loadingRemove.bind(this)} data-dismiss="modal" aria-label="Close" style={{ marginTop: '-23px' }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body mx-3">


                                <div className="md-form ">
                                    {/* <i className="fas fa-envelope prefix grey-text"></i> */}
                                    <div data-error="wrong" className='mb-3' data-success="right" for="defaultForm-email" style={{ marginRight: "15px", textAlign: 'initial' }}>Price (₹)<span className="error-asterick"> *</span></div>
                                    {/* <br /> */}
                                    <input type="text" onKeyPress={(event) => {
                                        if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }} name="price" placeholder='Price' onChange={this.onChange} value={this.state.price} className="form-control validate" />
                                </div>
                                <br />
                                {this.state.sellItem?.sell_type == 2 ?
                                    <div className="md-form">
                                        {/* <i className="fas fa-lock prefix grey-text"></i> */}
                                        <div data-error="wrong" className='mb-3' data-success="right" for="defaultForm-pass">Expiry Date<span className="error-asterick"> *</span></div>
                                        {/* <br /> */}
                                        <DatePicker calendarAriaLabel="true" isOpen="true" className="form-control" autoFocus="true"
                                            onChange={this.handleChangeExpiry.bind(this)}
                                            value={this.state.expiry_date} minDate={new Date()}
                                            name="expiry_date"
                                        />
                                    </div> : ''

                                }
                                <br />
                                <div className="row">
                                    <div className="md-form ">
                                        <div data-error="wrong" data-success="right" for="defaultForm-pass" style={{ marginRight: '60px' }}>Quantity<span className="error-asterick"> *</span></div>
                                        <div className="col-md-8 mt-3">
                                            <div class="input-group">
                                                <span class="input-group-btn" style={{ marginRight: '31px' }}>
                                                    <button type="button" onClick={this.minusQuantity.bind(this, 3)} class="btn btn-primary btn-number" data-type="minus" data-field="quant[2]">
                                                        <span class="glyphicon glyphicon-minus"></span>
                                                    </button>
                                                </span>
                                                <input type="text" onKeyPress={(event) => {
                                                    if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }} disabled className="form-control border-form" name="resale_quantity" placeholder="Quantity" value={this.state.resale_quantity}
                                                    onChange={this.onChange} style={{ fontSize: '12px', height: '28px', width: '20px', color: "#fff", zIndex: "0" }} />


                                                <span class="input-group-btn">
                                                    <button type="button" onClick={this.plusQuantity.bind(this, 3)} class="btn btn-primary btn-number" data-type="plus" data-field="quant[2]">
                                                        <span class="glyphicon glyphicon-plus"></span>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.errorAvailable === '1' ?
                                    <p style={{ color: 'red', textAlign: 'initial' }}>Quantity must be less than Edition</p>
                                    :
                                    this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                        ''
                                }
                                <br />
                                {/* <p>Payable amount : {this.state.getWalletDetailAPIData.resale_charges} ETH</p> */}
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button type="submit" disabled={this.state.errorAvailable === '1' || !this.state.price} onClick={this.approveNFTAdmin.bind(this, 2)} className="btn btn-primary col-sm-12 size-1" >Publish on Sale</button>

                            </div>

                        </div>
                    </div>
                </div>



                {/* //========================================  BlockChain NFTS  ============================================== */}

                <div className="modal fade" id="modalLoginFormBlockChain" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true" style={{ background: 'rgba(0, 0, 0,0.7)' }}>
                    <div className="modal-dialog" role="document" style={{ boxShadow: "0px 0px 11px 0px #fff" }}>


                        <div className="modal-content">
                            <div className="modal-header text-center">
                                <h4 className="modal-title w-100 font-weight-bold" style={{ color: "#fff" }}><strong>Publish for Sell</strong> </h4>
                                <button type="button" className="close" onClick={this.loadingRemove.bind(this)} data-dismiss="modal" aria-label="Close" style={{ marginTop: '-23px' }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body mx-3">


                                <div className="md-form ">
                                    {/* <i className="fas fa-envelope prefix grey-text"></i> */}
                                    <div data-error="wrong" className='mb-3' data-success="right" for="defaultForm-email" style={{ marginRight: "15px", textAlign: 'initial' }}>Price (₹)<span className="error-asterick"> *</span></div>
                                    {/* <br /> */}
                                    <input type="text" onKeyPress={(event) => {
                                        if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }} name="price" placeholder='Price' onChange={this.onChange} value={this.state.price} className="form-control validate" />
                                </div>
                                <br />
                                {this.state.sellItem?.sell_type == 2 ?
                                    <div className="md-form">
                                        {/* <i className="fas fa-lock prefix grey-text"></i> */}
                                        <div data-error="wrong" className='mb-3' data-success="right" for="defaultForm-pass">Expiry Date<span className="error-asterick"> *</span></div>
                                        {/* <br /> */}
                                        <DatePicker calendarAriaLabel="true" isOpen="true" className="form-control" autoFocus="true"
                                            onChange={this.handleChangeExpiry.bind(this)}
                                            value={this.state.expiry_date} minDate={new Date()}
                                            name="expiry_date"
                                        />
                                    </div> : ''

                                }
                                <br />
                                <div className="row">
                                    <div className="md-form ">
                                        <div data-error="wrong" data-success="right" for="defaultForm-pass" style={{ marginRight: '60px' }}>Quantity<span className="error-asterick"> *</span></div>
                                        <div className="col-md-8 mt-3">
                                            <div class="input-group">
                                                <span class="input-group-btn" style={{ marginRight: '31px' }}>
                                                    <button type="button" onClick={this.minusQuantityBlock.bind(this, 3)} class="btn btn-primary btn-number" data-type="minus" data-field="quant[2]">
                                                        <span class="glyphicon glyphicon-minus"></span>
                                                    </button>
                                                </span>
                                                <input type="text" onKeyPress={(event) => {
                                                    if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }} disabled className="form-control border-form" name="resale_quantity" placeholder="Quantity" value={this.state.resale_quantity}
                                                    onChange={this.onChange} style={{ fontSize: '12px', height: '28px', width: '20px', color: "#fff", zIndex: "0" }} />


                                                <span class="input-group-btn">
                                                    <button type="button" onClick={this.plusQuantityBlock.bind(this, 3)} class="btn btn-primary btn-number" data-type="plus" data-field="quant[2]">
                                                        <span class="glyphicon glyphicon-plus"></span>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.errorAvailable === '1' ?
                                    <p style={{ color: 'red', textAlign: 'initial' }}>Quantity must be less than Edition</p>
                                    :
                                    this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                        ''
                                }
                                <br />
                                {/* <p>Payable amount : {this.state.getWalletDetailAPIData.resale_charges} ETH</p> */}
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button type="submit" disabled={this.state.isDialogOpen == false ? this.state.errorAvailable === '1' || !this.state.price : true} onClick={this.approveNFTAdminBlockChain.bind(this, 2)} className="btn btn-primary col-sm-12 size-1" >{this.state.isDialogOpen == false ? 'Publish on Sale' : 'Loading...'}</button>

                            </div>

                        </div>
                    </div>
                </div>


                {/* //=================================== Cancel Listing =========================== */}

                <div className="modal fade" id="modalcancellisting" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
                    aria-hidden="true" style={{ background: 'rgba(0, 0, 0,0.7)' }}>
                    <div className="modal-dialog" role="document" style={{ boxShadow: "0px 0px 11px 0px #fff" }}>


                        <div className="modal-content">
                            <div className="modal-header text-center">
                                <h4 className="modal-title w-100 font-weight-bold" style={{ color: "#fff" }}><strong>Cancel For Listing</strong> </h4>
                                <button type="button" className="close" onClick={this.loadingRemove.bind(this)} data-dismiss="modal" aria-label="Close" style={{ marginTop: '-23px' }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body mx-3">

                                <div className="row">
                                    <div className="md-form ">
                                        <div data-error="wrong" data-success="right" for="defaultForm-pass" style={{ marginRight: '60px' }}>Quantity<span className="error-asterick"> *</span></div>
                                        <div className="col-md-8 mt-3">
                                            <div class="input-group">
                                                <span class="input-group-btn" style={{ marginRight: '31px' }}>
                                                    <button type="button" onClick={this.minusQuantityCancelListing.bind(this)} class="btn btn-primary btn-number" data-type="minus" data-field="quant[2]">
                                                        <span class="glyphicon glyphicon-minus"></span>
                                                    </button>
                                                </span>
                                                <input type="text" onKeyPress={(event) => {
                                                    if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }} disabled className="form-control border-form" name="resale_quantity" placeholder="Quantity" value={this.state.resale_quantity}
                                                    onChange={this.onChange} style={{ fontSize: '12px', height: '28px', width: '20px', color: "#fff", zIndex: "0" }} />


                                                <span class="input-group-btn">
                                                    <button type="button" onClick={this.plusQuantityCancelListing.bind(this)} class="btn btn-primary btn-number" data-type="plus" data-field="quant[2]">
                                                        <span class="glyphicon glyphicon-plus"></span>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.errorAvailable === '1' ?
                                    <p style={{ color: 'red', textAlign: 'initial' }}>Quantity must be less than Edition</p>
                                    :
                                    this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                        ''
                                }
                                <br />
                                {/* <p>Payable amount : {this.state.getWalletDetailAPIData.resale_charges} ETH</p> */}
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button type="submit" disabled={this.state.errorAvailable === '1'} onClick={this.cancelListingAPI.bind(this, 1)} className="btn btn-primary col-sm-12 size-1" >Cancel From Listing</button>

                            </div>

                        </div>
                    </div>
                </div>

            </>
        )
    }
}

