import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ReactDatatable from '@ashvin27/react-datatable';
import $ from 'jquery';
import Web3 from 'web3';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const headers = {
    'Content-Type': 'application/json'
};

export default class royalty extends Component {

    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'));
        this.state = {
            talentStatusAPIData: '',
            getWalletDetailAPIData: '',
            payout_address: '',
            item_list: [],
        }


        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },
            {
                key: "edition_text",
                text: "Edition",
                sortable: true
            },
            {
                key: "name",
                text: "Name",
                cell: (row) => {
                    return (
                        <a target="_blank" href={config.redirectUrl + '' + row.item_edition_id}>{row.name}</a>
                    )
                }
            },
            {
                key: "image",
                text: "Image",
                cell: (item) => {
                    return (
                        <>
                            {!item.local_image ?
                                ""
                                :
                                <img width="80px" src={`${config.imageUrl1}` + item.folder_name + '/images/' + item.local_image} />
                            }
                        </>
                    );
                }
            },
            {
                key: "owner_name",
                text: "NFT Owner",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl}featurescreator/` + item.owner_id} target="_blank" >
                                {item.owner_name}
                            </a>

                        </>
                    );
                }
            },
            {
                key: "creator_name",
                text: "NFT Creator",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl}featurescreator/` + item.creator_id} target="_blank" >
                                {item.creator_name}
                            </a>

                        </>
                    );
                }
            },
            {
                key: "item_category",
                text: "Category Name",
                sortable: true
            },

            {
                key: "price",
                text: "Price(₹)",
                cell: (item) => {
                    return (
                        <>
                            <span>{item.price}</span>
                        </>
                    )
                }
            },
            {
                key: "id",
                text: "Action",
                cell: (item) => {
                    return (
                        <>
                            {item.bulkNFT == 0 ?
                                <button id={'mintId' + item.id} onClick={this.createNftConfirmAPI.bind(this, item)} className="btn-sm btn btn-primary">Mint</button> : ''
                            }
                        </>
                    );
                }
            },
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50,],
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
        this.getItemAPI()
    }


    async createNftConfirmAPI(nftData) {
        $('#mintId' + nftData.id).text('Processing...');
        $("#mintId" + nftData.id).prop("disabled", true);
        const token = this.token
        var localImage = './uploads/' + nftData.folder_name + '/images/' + nftData.local_image
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to mint?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>

                        axios({
                            method: 'post',
                            url: `${config.apiUrl}getLocalImageHash`,
                            headers: { authorization: token },
                            data: { "user_id": this.loginData?.id, 'email': this.loginData?.user_email, 'localImage': localImage, "id": nftData.id }
                        }).then(response => {
                            if (response.data.success === true) {
                                nftData.ipfsHash = response.data.response
                                this.componentDidMount()
                            } else {
                                toast.error(response.data.msg,
                                );
                                $('#mintId' + nftData.id).text('Mint');
                                $("#mintId" + nftData.id).prop("disabled", false);
                            }
                        }).catch(err => {
                            toast.error(err.response.data?.msg,
                            );
                            $('#mintId' + nftData.id).text('Mint');
                            $("#mintId" + nftData.id).prop("disabled", false);
                        })

                },
                {
                    label: 'No',
                    onClick: () => {
                        $('#mintId' + nftData.id).text('Mint');
                        $("#mintId" + nftData.id).prop("disabled", false);
                    }
                }
            ]
        });
    }




    async approveNFTAdmin(item) {

        if (item.approve_by_admin == 0) {
            toast.error('To put on sale your Nft firstly Admin has to be approved this')
            return
        }
        let ConnectWalletAddress = localStorage.getItem('walletType')
        let fromAddress = ConnectWalletAddress; // get buyeraddress from order table
        let to_address = this.state.getWalletDetailAPIData.public_key; // get admin address
        var web3 = new Web3(window.ethereum);
        var currentNetwork = web3.currentProvider.chainId;
        var chainId = config.chainId;
        this.setState({
            isDialogOpen: true,
        })
        if (currentNetwork != config.chainId) {
            toast.error(config.chainMessage);
            this.setState({
                isDialogOpen: false,
            })
            return false;
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const contractAddress = config.marketplaceContract;
        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        var from_address = accounts[0];
        web3.eth.defaultAccount = from_address;
        let myToken = await contract.methods.isApprovedForAll(fromAddress, to_address).call();
        if (myToken == false) {
            var web3 = new Web3(window.ethereum);
            var currentNetwork = web3.currentProvider.chainId;
            var chainId = config.chainId;
            this.setState({
                isDialogOpen: true,
            })
            if (currentNetwork != config.chainId) {
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
                    this.updateonMarket(item)

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
            this.updateonMarket(item)
        }
    }

    //============================  update item ==========================================
    async updateonMarket(item) {
        this.setState({
            isDialogOpen: true,
        })
        await axios({
            method: 'post',
            url: `${config.apiUrl}updateItemMarket`,
            data: { 'item_id': item.item_id }
        }).then(response => {
            if (response.data.success === true) {

                toast.success('Item is on sale');
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        })
    }

    async getItemAPI() {
        axios.post(`${config.apiUrl}getBulkNFT`, { user_id: this.loginData.data.id },)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list: response.data.response //.filter(item => item.created_by != 1)
                    })
                }
                else if (response.data.success === false) {
                }
            })
            .catch(err => {
            })
    }
    //=======================================  Bid details  =====================

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

    render() {
        return (

            <>
                <Header />
                <body class="page-login">
                    <div id="content-block">
                        <div className="container be-detail-container your-purchase-bid">
                            <ToastContainer />
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
                                                <li className="edit-ln" ><Link onClick={this.loading.bind(this, '2')} to={`${config.baseUrl}about`}>About</Link></li>
                                                <li className="edit-ln" ><Link onClick={this.loading.bind(this, '3')} to={`${config.baseUrl}salehistory`}>Sale history</Link></li>
                                                <li className="edit-ln" ><Link onClick={this.loading.bind(this, '4')} to={`${config.baseUrl}yourpurchase`}>Purchase and Bids</Link></li>
                                                <li className="edit-ln" ><Link onClick={this.loading.bind(this, '5')} to={`${config.baseUrl}paymentsetting`}>Wallet</Link></li>
                                                <li className="edit-ln" ><Link onClick={this.loading.bind(this, '7')} to={`${config.baseUrl}royalty`}>Royalty</Link></li>
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-9">
                                    <div style={{ width: '100%' }}>
                                        <ReactDatatable
                                            config={this.config}
                                            records={this.state.item_list}
                                            columns={this.columns}
                                        /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                </body>
                <Footer />
            </>
        )
    }
}
