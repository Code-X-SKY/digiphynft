import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';

import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Swal from 'sweetalert2';
import DatePicker from 'react-date-picker';
import Web3 from 'web3';
import Loader from "react-loader-spinner";
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
import { PayPalButton } from "react-paypal-button-v2";

const headers = {
   'Content-Type': 'application/json'
};

export default class yourpurchase extends Component {


   constructor(props) {
      super(props)
      this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'));
      if (this.loginData.length === 0) {
         window.location.href = `${config.baseUrl}login`
      }
      this.state = {
         ConnectWalletAddress: this.loginData?.data?.address,
         talentStatusAPIData: '',
         getWalletDetailAPIData: '',
         getUserBidsData: [],
         getUserPurchaseData: [],
         defaultActive: 'Price',
         transactionDetailAPIData: [],
         sellItem: [],
         resellBtnText: false,
         paymentShow: 0,
         loaderShow: false,
         etherClickActive: 0,
         number: '',
         expMonth: '',
         expYear: '',
         cvv: '',
         paypalError: '',
         loadingStripe: 0,
         getData: '',
         resale_quantity: '1',
         errorAvailable: '0',
         transaction_ids: '',
         isDialogOpen: false,

      }

      this.columns = [
         {
            key: "Image",
            text: "Image",
            cell: (item) => {
               return (
                  <Link className="weak mr-2 d-inlne-block" to={`${config.baseUrl}${item.category_name}/${item.item_fullname?.split(' ').join('-')}/${item.item_edition_id}`}
                     target="_blank">
                     {item.file_type === 'image' ?
                        <img src={item.image === null || item.image === '' || item.image === undefined
                           ? 'images/team2.jpg'
                           :
                           `${config.imageUrl1}${item.local_image}`} style={{ width: '60px', height: '60px', borderRadius: '60px' }} /> :
                        item.file_type === 'video' ?
                           <a href={`${config.imageUrl1}${item.local_image}`} target="_blank">
                              <img className="video-css" src="images/youtube-logo2.jpg" />
                           </a> :
                           <a href={`${config.imageUrl1}${item.local_image}`} target="_blank">
                              <img className="video-css" src="images/pngtree-high-sound-vector-icon-png-image_470307.jpg" />
                           </a>
                     }

                  </Link>
               );
            }
         },
         {
            key: "item_name",
            text: "Name",
            sortable: true,
         },
         {
            key: "creator",
            text: "Creator",

         },
         {
            key: "bid_price",
            text: "Bid Amount",

            cell: (item) => {
               return (
                  <span>₹{parseFloat(item.bid_price).toFixed(6)}</span>
               );
            }
         },

         {
            key: "bid_datetime",
            text: "Date",
            cell: (item) => {
               return (

                  <span> {item.bid_datetime}</span>
               );
            }
         },
         {
            key: "status",
            text: "Status",

         },
         {
            key: "Action",
            text: "Action",
            cell: (item) => {
               return (
                  <>
                     {item.status === 'Pending' ?
                        <button onClick={this.bidCancel.bind(this, item)} style={{ textTransform: 'inherit' }} className="btn btn-danger cancel">Cancel</button> : ''

                     }
                     <Link to={`${config.baseUrl}purchasedetail/${item.transaction_id}`} target="_blank" style={{ textTransform: 'inherit' }} className="btn btn-primary">Detail</Link>
                  </>
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

      this.columns1 = [
         {
            key: "Image",
            text: "Image",
            cell: (item) => {
               return (
                  <Link className="weak mr-2 d-inlne-block" to="#"
                    >
                     {item.file_type === 'image' ?
                        <img src={item.image === null || item.image === '' || item.image === undefined
                           ? 'images/team2.jpg'
                           :
                           `${config.imageUrl1}${item.local_image}`} style={{ width: '60px', height: '60px', borderRadius: '60px' }} /> :
                        item.file_type === 'video' ?
                           <a href={`${config.imageUrl1}${item.local_image}`} target="_blank">
                              <img className="video-css" src="images/youtube-logo2.jpg" />
                           </a> :
                           <a href={`${config.imageUrl1}${item.local_image}`} target="_blank">
                              <img className="video-css" src="images/pngtree-high-sound-vector-icon-png-image_470307.jpg" />
                           </a>
                     }

                  </Link>
               );
            }
         },
         {
            key: "item_name",
            text: "Name",
            sortable: true,
            cell: (item) => {
               return (
                  <>
                     <span> {item.item_name}</span><br />
                     <span>Edition: {item.edition_text}</span>
                  </>
               );
            }
         },
         {
            key: "purchased_quantity",
            text: "Quantity",
            cell: (item) => {
               return (
                  <>
                     <div className="text-center">
                        <span>
                           {item.purchased_quantity === null || item.purchased_quantity === '' || item.purchased_quantity === undefined ?
                              1 : item.purchased_quantity
                           }
                        </span>

                     </div>

                  </>
               );
            }
         },
         {
            key: "creator",
            text: "Creator",

         },
         {
            key: "price",
            text: "Amount",

            cell: (item) => {
               return (
                  <span>₹{parseFloat(item.price).toFixed(6)}</span>
               );
            }
         },

         {
            key: "purchase_datetime",
            text: "Date",
            cell: (item) => {
               return (


                  <span> {item.purchase_datetime}</span>

               );
            }
         },


         {
            key: "Action",
            text: "Action",
            cell: (item) => {
               return (
                  <>
                     {/* {item.transfer_hash === null || item.transfer_hash === '' || item.transfer_hash === undefined ? '' :
                        <a target="_blank" href={item.transfer_hash} style={{ textTransform: 'inherit' }} className="btn btn-primary">Blockchain View</a>

                     } */}
                     {/* <br /> */}
                     <Link to={`${config.baseUrl}purchasedetail/${item.transaction_id}`} target="_blank" style={{ textTransform: 'inherit' }} className="btn btn-primary">Detail</Link>
                     {/* <a target="_blank" href={item.transfer_hash} style={{textTransform:'inherit'}} className="btn btn-primary">Resell</a> */}
                     {/* {item.resale_available > 0 ?
                        <a href="" onClick={this.clickResell11.bind(this, item)} className="btn btn-primary" data-toggle="modal" style={{ textTransform: 'inherit' }} data-target="#modalLoginForm">Resell</a>
                        : ''

                     } */}
                  </>
               );
            }
         },
      ]

      this.config1 = {
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

      this.handleChangeExpiry = this.handleChangeExpiry.bind(this)
      this.onChange = this.onChange.bind(this)
      this.resellSubmit = this.resellSubmit.bind(this)
      this.resellSubmitAPI = this.resellSubmitAPI.bind(this)
      this.paymentStripeShow = this.paymentStripeShow.bind(this)
      this.paymentStripeWallet = this.paymentStripeWallet.bind(this)
      this.paymentNetsents = this.paymentNetsents.bind(this)
      this.afterPaypalSuccess = this.afterPaypalSuccess.bind(this);
      this.transactionCancel = this.transactionCancel.bind(this)
      this.approveNFTAdmin = this.approveNFTAdmin.bind(this)
   }


   clickResell11(id) {
      console.log(id.transaction_id);
      this.setState({
         transaction_ids: id.transaction_id,
         sellItem: id
      })
   }


   componentDidMount() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.getWalletDetailAPI()
      this.talentStatusAPI()
      this.getBidListAPI()
      this.getUserPurchaseAPI()

      if (Cookies.get('cryptoPaiment')) {
         if (Cookies.get('cryptoPaiment') === 'success') {
            this.resellSubmitFinal(Cookies.get('resellApiData'));
         } else {
            this.transactionCancel();
            this.cryptoPaymentFailed();
         }
         Cookies.set('resellItemItemProcess', '');
         Cookies.set('resellApiData', '');
         Cookies.set('cryptoPaiment', '');
      }




      // setTimeout(() => {
      //    if (window.ethereum) {
      //       const { ethereum } = window;
      //       this.setState({
      //          ConnectWalletAddress: ethereum.selectedAddress
      //       })
      //    }
      // }, 1000);

   }


   async getWalletDetailAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getSettings`,
         headers: { "Authorization": this.loginData?.Token },
         data: { 'email': 'admin@headlinesales.io', 'user_id': 1 }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getWalletDetailAPIData: result.data
               })
               console.log(this.state.getWalletDetailAPIData.public_key);
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }


   //=======================================  transactionCancel  =====================

   async transactionCancel() {
      let external_id = Cookies.get('external_id');
      await axios({
         method: 'post',
         url: `${config.apiUrl}cryptoTrxCanceled`,
         headers: { "Authorization": this.loginData?.Token },
         data: { "email": this.loginData.data.user_email, 'external_id': external_id }
      })
         .then(result => {
            if (result.data.success === true) {
               console.log('transaction canceled', external_id);


            }
            else if (result.data.success === false) {
            }
            Cookies.set('external_id', '');
         }).catch(err => {
         });
   }

   handleChangeExpiry(date) {
      console.log(date);
      this.setState({
         // start_date: new Date(date).setDate(new Date(date).getDate() + 1)
         expiry_date: date
      })
      console.log(this.state.expiry_date);
   }

   onChange = e => {
      this.setState({
         [e.target.name]: e.target.value
      })

      if (e.target.name === 'resale_quantity') {
         if (e.target.value > this.state.sellItem.resale_available) {
            this.setState({
               errorAvailable: '1'
            })

         }
         else if (e.target.value === '0' || e.target.value === '') {
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



   async connectMetasmask() {
      if (window.ethereum) {
         await window.ethereum.send('eth_requestAccounts');
         window.web3 = new Web3(window.ethereum);
         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
         this.setState({
            ConnectWalletAddress: accounts
         })
      }
      else {
         toast.error(`Please install MetaMask to use this dApp!`, {
            position: toast.POSITION.TOP_CENTER
         });
      }
   }




   async cryptoPaymentFailed() {
      var willSearch = await Swal.fire({
         title: 'Payment declined!',
         text: 'Something went wrong! please try again.',
         icon: 'error',
         width: 500,
         confirmButtonColor: '#00bfff',
         allowOutsideClick: false,
         confirmButtonText: 'Continue',
      });
   }

   async cryptoPaymentSucces() {
      var willSearch = await Swal.fire({
         title: 'Payment successful!',
         text: 'Congratulations, you are successfully completed the payment.',
         icon: 'success',
         width: 500,
         confirmButtonColor: '#00bfff',
         allowOutsideClick: false,
         confirmButtonText: 'View items',
      });

   }
   //=======================================  Bid details  =====================

   async getBidListAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getUserBids`,
         data: { "user_id": this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getUserBidsData: result.data.response,

               })

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }
   //=======================================  Bid details  =====================

   async getUserPurchaseAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getUserPurchase`,
         data: { "user_id": this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getData: result.data,
                  getUserPurchaseData: result.data.response,

               })

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }


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



   clickResell(item) {
      console.log(item);

      this.setState({
         sellItem: item
      })
   }

   async resellSubmit() {
      this.setState({
         resellBtnText: true
      })

      let getContractDeatils = await axios(`${config.apiUrl}getContractDeatils`);
      if (!getContractDeatils.data.blockchainNetwork) {
         toast.error('Contract details not found!', {
            position: toast.POSITION.TOP_CENTER
         });
         return false;
      }
      let blockchainNetwork = getContractDeatils.data.blockchainNetwork;
      let fromAddress = this.state.ConnectWalletAddress;
      let tokenId = this.state.sellItem.item_id;//332555;
      let amount = 1;
      let contractAddress = getContractDeatils.data.contractAddress;
      let to_address = getContractDeatils.data.adminAddress;
      let token_owner_address = fromAddress;


      var web3 = new Web3(window.ethereum);

      var currentNetwork = web3.currentProvider.chainId;
      if (currentNetwork !== '0x3' && blockchainNetwork == 'testnet') {
         toast.error(`Please select ropsten testnet network !`, {
            position: toast.POSITION.TOP_CENTER
         });
         this.setState({
            resellBtnText: false
         })
         return false;
      }

      if (currentNetwork !== '0x1' && blockchainNetwork == 'mainnet') {
         toast.error(`Please select Ethereum mainnet network !`, {
            position: toast.POSITION.TOP_CENTER
         });
         this.setState({
            resellBtnText: false
         })
         return false;
      }
      try {

         var chainId = currentNetwork;

         const contract = await new web3.eth.Contract(config.abi, contractAddress);
         let count = await web3.eth.getTransactionCount(fromAddress);

         web3.eth.defaultAccount = fromAddress;

         const tx_builder = await contract.methods.safeTransferFrom(token_owner_address, to_address, tokenId, amount, '0x7B502C3A1F48C8609AE212CDFB639DEE39673F5E');

         let encoded_tx = tx_builder.encodeABI();

         let gasPrice = await web3.eth.getGasPrice();

         let gasLimit = await web3.eth.estimateGas({
            from: fromAddress,
            nonce: web3.utils.toHex(count),
            gasPrice: web3.utils.toHex(gasPrice),
            to: contractAddress,
            data: encoded_tx,
            chainId: chainId,
         });



         let transactionObject = {
            nonce: web3.utils.toHex(count),
            from: fromAddress,
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex(gasLimit),
            to: contractAddress,
            data: encoded_tx,
            value: 0,
            chainId: chainId,
         };

         const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionObject],
         });
         if (txHash) {
            this.resellSubmitAPI(txHash);
         }
      } catch (e) {

         toast.error(e.message, {
            position: toast.POSITION.TOP_CENTER
         });

         this.setState({
            resellBtnText: false
         })
      }
   }


   // async resellSubmitAPI(e) {
   //    // e.preventDefault()
   //    // this.setState({
   //    //    paymentShow: 1
   //    // })
   //    if (window.ethereum) {
   //       this.setState({
   //          isDialogOpen: true,
   //          popupData: false,
   //       })
   //       var web3 = '';
   //       web3 = new Web3(window.ethereum);
   //       const accounts = await web3.eth.getAccounts();
   //       let currentNetwork = await web3.currentProvider.chainId;
   //       web3.eth.defaultAccount = await accounts[0];
   //       var from_address = accounts[0];

   //       var chainId = config.chainId;
   //       if (currentNetwork != chainId) {
   //          toast.error(config.chainMessage);
   //          this.setState({
   //             isDialogOpen: false,
   //          })
   //          return false;
   //       }

   //       try {



   //          var trx_amount = parseInt(this.state.getWalletDetailAPIData.resale_charges * (10 ** 18));

   //          var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
   //          var currentBal = parseFloat(getBalace).toFixed(6)

   //          if (currentBal < this.state.getWalletDetailAPIData.resale_charges) {
   //             toast.error(`Insufficient fund for transfer`);
   //             this.setState({
   //                buyBtnText: 'buy'
   //             })
   //             return false;
   //          }

   //          console.log(this.state.getWalletDetailAPIData.receive_address, from_address, trx_amount, chainId);
   //          let gasPrice = await web3.eth.getGasPrice();
   //          console.log('>>>', gasPrice);
   //          let gasLimit = await web3.eth.estimateGas({
   //             gasPrice: web3.utils.toHex(gasPrice),
   //             to: this.state.getWalletDetailAPIData.receive_address,
   //             from: from_address,
   //             value: web3.utils.toHex(trx_amount),
   //             chainId: chainId,
   //          });
   //          console.log('>>><<<<');
   //          console.log(gasLimit);
   //          const txData = await web3.eth.sendTransaction({
   //             gasPrice: web3.utils.toHex(gasPrice),
   //             gas: web3.utils.toHex(gasLimit),
   //             to: this.state.getWalletDetailAPIData.receive_address,
   //             from: from_address,
   //             value: web3.utils.toHex(trx_amount),
   //             chainId: chainId,
   //          });
   //          console.log(txData.transactionHash);
   //          if (txData.transactionHash) {
   //             this.resellSubmitFinal()
   //          }







   //       } catch (err) {
   //          if (err.message.toString().split('insufficient funds')[1]) {
   //             toast.error('Transaction reverted : ' + err.message)
   //          } else {
   //             if (err.toString().split('execution reverted:')[1]) {
   //                toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

   //             } else {
   //                toast.error(err.message);
   //             }
   //          }
   //          this.setState({
   //             isDialogOpen: false
   //          })

   //          return false;
   //       }
   //    }
   //    else {
   //       toast.error(`Please connect your MetaMask wallet!`, {

   //       });
   //       this.setState({
   //          isDialogOpen: false
   //       })
   //       return false;
   //    }
   // }

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


   //==========================================  Delete Post  ================================

   async bidCancel(id) {

      confirmAlert({
         title: 'Confirm to submit',
         message: 'Are you sure to delete this.',
         buttons: [
            {
               label: 'Yes',
               onClick: () =>
                  axios({
                     method: 'post',
                     url: `${config.apiUrl}rejectBid`,
                     headers: { "Authorization": this.loginData?.Token },
                     data: { "email": this.loginData.data.user_email, 'bid_id': id.bid_id, "address": this.state.ConnectWalletAddress, }
                  }).then((res) => {
                     this.componentDidMount()

                  }).catch((error) => {
                  })
            },
            {
               label: 'No',
            }
         ]
      });

   }


   //===================================================== strpe payment ======================================

   async paymentStripeShow() {
      this.setState({
         isDialogOpen: true,
         loadingStripe: 1,
         loaderShow: true
      })
      await axios({
         method: 'post',
         url: `${config.apiUrl}circleResalePayment`,
         headers: { "Authorization": this.loginData?.Token },
         data: {
            "email": this.loginData.data.user_email, "user_id": this.loginData.data.id, 'amount': parseFloat(parseFloat(this.state.getData?.resale_charges).toFixed(2) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2)), "number": this.state.number, "expMonth": this.state.expMonth,
            "expYear": this.state.expYear, "cvv": this.state.cvv, 'item_id': this.state.sellItem?.item_id, 'item_edition_id': this.state.sellItem?.item_edition_id,
            'resale_quantity': this.state.resale_quantity
         }
      })
         .then(result => {
            if (result.data.success === true) {
               // this.setState({
               //    getListUser: result.data.response,
               // })
               this.setState({
                  isDialogOpen: false,
                  loadingStripe: 0,
                  loaderShow: false,
                  transaction_ids: result.data.transaction_id
               })
               this.resellSubmitFinal()

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {

            this.setState({
               paypalError: err?.response?.data?.msg,
               loadingStripe: 0,
               loaderShow: false
            })
         });
   }



   //====================================================  wallet API ===============================================

   async paymentStripeWallet() {
      console.log(this.state.sellItem);

      if (parseFloat(this.state.getData?.resale_charges) > parseFloat(this.state.getListUser?.wallet_balance_usd)) {
         this.setState({
            paypalError: 'Insufficient balance in your wallet'
         })
      }
      else {
         this.setState({
            loadingStripe: 1,
            loaderShow: true
         })
         await axios({
            method: 'post',
            url: `${config.apiUrl}walletResalePayment`,
            headers: { "Authorization": this.loginData?.Token },
            data: {
               "email": this.loginData.data.user_email, "user_id": this.loginData.data.id, 'amount': parseFloat(parseFloat(this.state.getData?.resale_charges).toFixed(2) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2)),
               'resale_quantity': this.state.resale_quantity,
               'item_id': this.state.sellItem?.item_id, 'item_edition_id': this.state.sellItem?.item_edition_id
            }
         })
            .then(result => {
               if (result.data.success === true) {

                  this.setState({
                     loadingStripe: 0,
                     loaderShow: false
                  })
                  this.resellSubmitFinal()


               }
               else if (result.data.success === false) {
                  this.setState({
                     loadingStripe: 0,
                     loaderShow: false
                  })
               }
            }).catch(err => {
               this.setState({
                  loadingStripe: 0,
                  loaderShow: false
               })
            });
      }

   }


   //===================================   give approval    =============================

   async paymentNetsents() {

      this.setState({
         loaderShow: true
      })
      var Netcensts = {};
      Netcensts.user_id = this.loginData.data.id;
      Netcensts.user_address = this.loginData?.data?.user_address;
      Netcensts.item_edition_id = this.state.sellItem.item_edition_id;
      Netcensts.price = this.state.price;
      Netcensts.expiry_date = this.state.expiry_date;
      Netcensts.price_eth = this.state.getData?.resale_charges_eth
      Netcensts.email = this.loginData.data.user_email
      Netcensts.item_id = this.state.sellItem?.item_id
      Netcensts.resale_available = this.state.sellItem?.resale_available
      Netcensts.transaction_id = this.state.sellItem?.transaction_id
      Netcensts.resale_quantity = this.state.resale_quantity



      await axios({
         method: 'post',
         url: `${config.apiUrl}resaleTrxStart`,
         headers: { "Authorization": this.loginData?.Token },
         // 'amount': this.state.getData?.resale_charges
         data: {
            "email": this.loginData.data.user_email, 'user_address': this.state.ConnectWalletAddress, 'user_id': this.loginData.data.id,
            'amount': parseFloat(parseFloat(this.state.getData?.resale_charges).toFixed(2) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2)),
            'item_id': this.state.sellItem?.item_id, 'item_edition_id': this.state.sellItem?.item_edition_id,
            'resale_quantity': this.state.resale_quantity
         }
      })
         .then(result => {
            if (result.data.success === true) {
               Netcensts.external_id = result.data.external_id;
               Cookies.set('external_id', result.data.external_id)
               Cookies.set('resellApiData', Netcensts);
               Cookies.set('resellItemItemProcess', 'yes');
               // setTimeout(() => {
               window.location.href = `https://merchant.net-cents.com/widget/payment/currencies?data=${result.data.token}`
               // }, 3000);

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
            this.setState({
               loaderShow: false
            })
         });
   }




   async approveNFTAdmin() {
      // console.log(this.state.getWalletDetailAPIData.public_key)
      console.log(localStorage.getItem('walletType'));
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
      console.log(fromAddress, to_address);
      let myToken = await contract.methods.isApprovedForAll(fromAddress, to_address).call();
      console.log(myToken);

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
               this.resellSubmitAPI()

            } else {
               toast.error(`Approval failed please try again!!!`);
               return 0
            }
         } catch (err) {
            console.log(err.message.toString().split('gas required exceeds allowance (0)')[1])
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
         this.resellSubmitAPI()
      }


   }













   async resellSubmitAPI() {

      var API_DATA = {
         "user_address": localStorage.getItem('walletType'), 'user_id': this.loginData.data.id, "item_edition_id": this.state.sellItem.item_edition_id, "price": this.state.price, "expiry_date": this.state.expiry_date, 'price_eth': this.state.getData?.resale_charges_eth, "email": this.loginData.data.user_email, 'transaction_id': this.state.transaction_ids,
         'item_id': this.state.sellItem?.item_id,
         'resale_quantity': this.state.resale_quantity
      };

      this.setState({
         isDialogOpen: true,
      })

      await axios({
         method: 'post',
         url: `${config.apiUrl}resaleNFT`,
         headers: { "Authorization": this.loginData?.Token },
         data: API_DATA
      })
         .then(async result => {
            if (result.data.success === true) {
               var willSearch = await Swal.fire({
                  title: 'Payment successful!',
                  text: 'Congratulations, Your NFT has been published for resell!',
                  icon: 'success',
                  width: 500,
                  confirmButtonColor: '#00bfff',
                  allowOutsideClick: false,
                  confirmButtonText: 'View Resell Item',
               });
               this.setState({
                  isDialogOpen: false,
                  loaderShow: false,
                  loadingStripe: 0

               })
               window.location.href = `${config.baseUrl}${result.data.category_name}/${result.data.item_fullname}/${result.data.item_edition_id}`

            }
            else if (result.data.success === false) {
               this.setState({
                  isDialogOpen: false,
               })
            }
         }).catch(err => {
            this.setState({
               isDialogOpen: false,
            })
         });
   }


   loadingRemove() {
      setTimeout(() => {
         window.location.reload()
      });
   }


   async afterPaypalSuccess(paypalId) {
      this.setState({
         loadingStripe: 1,
         loaderShow: true
      })
      await axios({
         method: 'post',
         url: `${config.apiUrl}paypalResalePayment`,
         headers: { "Authorization": this.loginData?.Token },
         data: {
            "email": this.loginData.data.user_email,
            "user_id": this.loginData.data.id,
            'amount': parseFloat(parseFloat(this.state.getData?.resale_charges).toFixed(2) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2)),
            'resale_quantity': this.state.resale_quantity,
            "paymentId": paypalId,
            'item_id': this.state.sellItem?.item_id, 'item_edition_id': this.state.sellItem?.item_edition_id
         }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  loadingStripe: 0,
                  loaderShow: false
               })
               this.resellSubmitFinal()
            }
            else if (result.data.success === false) {
               toast.error((!result.data.msg) ? 'Something went wrong! Please try again later.' : result.data.msg, {
                  position: toast.POSITION.TOP_CENTER,
               })
            }
         }).catch(err => {
            this.setState({
               paypalError: err?.response?.data?.msg,
               loadingStripe: 0,
               loaderShow: false
            })
         });
   }


   plusQuantity() {
      var qty = parseInt(this.state.resale_quantity) + parseInt(1)
      this.setState({
         'resale_quantity': qty
      })
      if (qty > this.state.sellItem.resale_available) {
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
      var qty = parseInt(this.state.resale_quantity) - parseInt(1)
      if (this.state.resale_quantity > 1) {
         this.setState({
            'resale_quantity': qty
         })
      }

      console.log(this.state.resale_quantity);
      console.log(qty);

      console.log(this.state.sellItem.resale_available);
      if (qty > this.state.sellItem.resale_available) {
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

   render() {
      return (

         <>

            <Header />
            <div className="page-login">

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
               <ToastContainer />
               <div id="content-block">
                  <div className="container be-detail-container your-purchase-bid">
                     <h3 className=" text-white mb-4">Bids</h3>
                     <div className="row">
                        <div className="left-feild col-xs-12 col-sm-3">
                           <div className="be-vidget">
                              <div className="creative_filds_block">
                                 <ul className="ul nav">
                                    {this.state.talentStatusAPIData?.telent_status === 1 ?
                                       <li className="edit-ln" ><Link onClick={this.loading.bind(this, '6')} to={`${config.baseUrl}featurescreator/${this.loginData.data.id}`}>My Profile</Link></li>
                                       : ''

                                    }
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '1')} to={`${config.baseUrl}authoredit`}>Account Setting</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '2')} to={`${config.baseUrl}about`}>About</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '3')} to={`${config.baseUrl}salehistory`}>Sale history</Link></li>
                                    <li className="edit-ln active" ><Link onClick={this.loading.bind(this, '4')} to={`${config.baseUrl}yourpurchase`}>Buy History</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '5')} to={`${config.baseUrl}paymentsetting`}>Wallet</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '7')} to={`${config.baseUrl}royalty`}>Royalty</Link></li>
                                    {/* <li className="edit-ln" ><Link onClick={this.loading.bind(this,'8')} to={`${config.baseUrl}bulk_nft`}>Bulk Nft List</Link></li> */}

                                 </ul>
                              </div>
                           </div>
                        </div>
                        
                        <div className="col-xs-12 col-sm-9 yourPurchases" >
                           <div className="tab-wrapper style-1">
                              <div className="tab-nav-wrapper">
                                 <div className="nav-tab  clearfix">
                                    <div className={`nav-tab-item ${(this.state.defaultActive === 'Price') ? 'active' : ''}`}>
                                       <span>Your Purchases</span>
                                    </div>
                                    <div className={`nav-tab-item ${(this.state.defaultActive !== 'Price') ? 'active' : ''}`}>
                                       <span>Your Bids</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="tabs-content clearfix">
                                 <div className={`tab-info ${(this.state.defaultActive === 'Price') ? 'active' : ''}`}>
                                    <div className="row">
                                       <div className="col-ml-12 col-xs-12 col-sm-12" style={{ marginTop: '-25px' }}>
                                          <div className="">
                                           
                                                
                                                   
                                                      {this.state.getUserPurchaseData.length === 0 ?
                                                         <div className="col-sm-12 background-shadow p-5">

                                                            <div className="row">
                                                               <div className="col-sm-12 text-center">
                                                                  <h5 className="weak text-white">You don't have any collected creations available for Purchase.</h5>
                                                               </div>
                                                            </div>

                                                         </div> :
                                                         <ReactDatatable
                                                            config={this.config1}
                                                            records={this.state.getUserPurchaseData}
                                                            columns={this.columns1}
                                                         />}
                                                   
                                                
                                            
                                          </div>
                                       </div>

                                    </div>
                                 </div>
                                 <div className={`tab-info ${(this.state.defaultActive !== 'Price') ? 'active' : ''}`}>
                                    <div className="row">
                                       <div className="col-md-12 col-xs-12 col-sm-12" style={{ marginTop: '-25px' }}>
                                          <div className="">
                                             {this.state.getUserBidsData.length === 0 ?
                                                <div className="col-sm-12 background-shadow p-5">

                                                   <div className="row">
                                                      <div className="col-sm-12 text-center">
                                                         <h5 className="weak text-white">You don't have any collected creations available for Bid.</h5>
                                                      </div>
                                                   </div>

                                                </div> :
                                                <ReactDatatable
                                                   config={this.config}
                                                   records={this.state.getUserBidsData}
                                                   columns={this.columns}
                                                />
                                             }
                                          </div>
                                       </div>

                                    </div>
                                 </div>

                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <br /><br />
            </div>
            <Footer />

            <div className="modal fade" id="modalLoginForm" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
               aria-hidden="true" style={{ background: 'rgba(0, 0, 0,0.7)' }}>
               <div className="modal-dialog" role="document" style={{ boxShadow: "0px 0px 11px 0px #fff" }}>


                  <div className="modal-content">
                     <div className="modal-header text-center">
                        <h4 className="modal-title w-100 font-weight-bold" style={{ color: "#fff" }}><strong>Publish for Resell</strong> </h4>
                        <button type="button" className="close" onClick={this.loadingRemove.bind(this)} data-dismiss="modal" aria-label="Close" style={{ marginTop: '-23px' }}>
                           <span aria-hidden="true">&times;</span>
                        </button>
                     </div>
                     {this.state.paymentShow === 0 ?
                        <>
                           <div className="modal-body mx-3">


                              <div className="md-form ">
                                 {/* <i className="fas fa-envelope prefix grey-text"></i> */}
                                 <div data-error="wrong" className='mb-3' data-success="right" for="defaultForm-email" style={{ marginRight: "15px", textAlign: 'initial' }}>Resell Price (₹)<span className="error-asterick"> *</span></div>
                                 {/* <br /> */}
                                 <input type="text" onKeyPress={(event) => {
                                    if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                       event.preventDefault();
                                    }
                                 }} name="price" placeholder='Resell Price' onChange={this.onChange} value={this.state.price} className="form-control validate" />
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
                                          }} className="form-control border-form" name="resale_quantity" placeholder="Quantity" value={this.state.resale_quantity}
                                             onChange={this.onChange} style={{ fontSize: '12px', height: '28px', width: '20px', color: "#fff", zIndex: "0" }} />
                                          {console.log('errorAvailable', this.state.errorAvailable)}

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
                              <button type="submit" disabled={this.state.errorAvailable === '1' || !this.state.price} onClick={this.approveNFTAdmin} className="btn btn-primary col-sm-12 size-1" >Resale</button>

                           </div>
                        </>
                        :
                        <div className="tab-wrapper style-1" style={{ padding: '25px', minHeight: '347px' }}>
                           {(this.state.loaderShow) ?
                              <Loader className="paymentLoader"
                                 type="Bars"
                                 color="#00BFFF"
                                 height={80}
                                 width={80}
                              /> : ''}
                           <div className="tab-nav-wrapper" style={{ opacity: `${(this.state.loaderShow) ? '0.1' : '1'}` }}>
                              <div className="nav-tab  clearfix">
                                 {(this.state.loaderShow) ?
                                    <>
                                       <div className={(this.state.etherClickActive) == 0 ? "nav-tab-item active" : "nav-tab-item"} >
                                          <span>Paypal</span>
                                       </div>
                                       <div className={(this.state.etherClickActive) == 1 ? "nav-tab-item active" : "nav-tab-item"} >
                                          <span className="text-black">Crypto</span>
                                       </div>

                                       <div className={(this.state.etherClickActive) == 2 ? "nav-tab-item active" : "nav-tab-item"} >
                                          <span className="text-black">Wallet</span>
                                       </div>

                                       <div className={(this.state.etherClickActive) == 3 ? "nav-tab-item active" : "nav-tab-item"} >
                                          <span className="text-black">Circle payment</span>
                                       </div>
                                    </>
                                    :
                                    <>
                                       <div className={this.state.etherClickActive == 0 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'cc')}>
                                          <span>Paypal</span>
                                       </div>
                                       <div className={this.state.etherClickActive == 1 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'Ether')}>
                                          <span className="text-black">Crypto</span>
                                       </div>

                                       <div className={this.state.etherClickActive == 2 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'Wallet')}>
                                          <span className="text-black">Wallet</span>
                                       </div>

                                       <div className={this.state.etherClickActive == 3 ? "nav-tab-item active" : "nav-tab-item"} onClick={this.etherClick.bind(this, 'circlepayment')}>
                                          <span className="text-black">Circle payment</span>
                                       </div>
                                    </>
                                 }


                              </div>
                           </div>
                           <div className="tabs-content clearfix">
                              <div className={this.state.etherClickActive == 0 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 0 ? 'block' : 'none' }}>
                                 <div className="row">
                                    <div className="col-ml-12 col-xs-12 col-sm-12">
                                       <div className="col-12 mt-3">
                                          <p>Payable amount : {parseFloat(parseFloat(this.state.getData?.resale_charges_eth).toFixed(6) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2))} ETH ~ ${parseFloat(parseFloat(this.state.getData?.resale_charges).toFixed(2) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2))}</p>
                                       </div>

                                       {this.state.paypalError === '' ? '' : <p style={{ color: 'red' }}> {this.state.paypalError}</p>}
                                       <br />
                                       <PayPalButton
                                          //   amount="0.01"
                                          amount={parseFloat(parseFloat(this.state.getData?.resale_charges).toFixed(2) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2))}
                                          currency="USD"
                                          style={{
                                             layout: 'horizontal',
                                             tagline: 'false',
                                             color: 'red'
                                          }}
                                          shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                          onSuccess={(details, data) => {
                                             //  alert("Transaction completed by " + details.payer.name.given_name);
                                             console.log("successDetails", details);
                                             this.afterPaypalSuccess(data.orderID);
                                             // OPTIONAL: Call your server to save the transaction
                                          }}
                                          onCancel={(details, data) => {
                                             console.log("cancelDetails", details);
                                          }}

                                          options={{
                                             clientId: `${config.paypalClientId}`
                                          }}

                                          onError={(details, data) => {
                                             this.setState({
                                                paypalError: 'Something went wrong! Please try again later.'
                                             })
                                             console.log("errorDetails", details);
                                          }}
                                          catchError={(err) => {
                                             this.setState({
                                                paypalError: 'Transaction has been declined by Bank.'
                                             })
                                             console.log('catchError', err);
                                          }}
                                       />
                                    </div>
                                 </div>
                              </div>

                              <div class={this.state.etherClickActive == 1 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 1 ? 'block' : 'none' }}>

                                 <div className="col-12 nopadding">
                                    <p>Payable amount : {parseFloat(parseFloat(this.state.getData?.resale_charges_eth).toFixed(6) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2))} ETH ~ ${parseFloat(parseFloat(this.state.getData?.resale_charges).toFixed(2) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2))}</p>
                                    <div className="mt-2">
                                       You need to deposit selected Cryptocurrency to complete your purchase.</div>
                                 </div>
                                 <div className="mt-4">
                                    <div className="col-12 nopadding">
                                       <div className="col-12 nopadding">
                                          {(this.state.loaderShow == false) ?
                                             <button type="submit" className="btn btn-primary col-sm-12 size-1" onClick={this.paymentNetsents} >Pay With crypto</button> :
                                             <button type="submit" className="btn btn-primary col-sm-12 size-1" disabled >Processing...</button>
                                          }

                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div class={this.state.etherClickActive == 2 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 2 ? 'block' : 'none' }}>
                                 <div className="col-12 mt-3">
                                    <p>Payable amount : {parseFloat(parseFloat(this.state.getData?.resale_charges_eth).toFixed(6) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2))} ETH ~ ${parseFloat(parseFloat(this.state.getData?.resale_charges).toFixed(2) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2))}</p>
                                 </div>
                                 <div className="col-12 mt-3">

                                    <div className="input-group">
                                       Wallet Balance : {parseFloat(this.state.getData?.wallet_balance_eth).toFixed(6)} ETH ~ ${this.state.getData?.wallet_balance_usd}
                                    </div>
                                 </div>
                                 <div className="mt-4">
                                    {this.state.paypalError === '' ? '' : <p style={{ color: 'red' }}> {this.state.paypalError}</p>}
                                    <div className="col-12 nopadding">
                                       {this.state.loadingStripe === 0 ?
                                          <button type="submit" className="btn btn-primary col-sm-12 size-1" onClick={this.paymentStripeWallet} >Pay with wallet</button> :
                                          <button type="submit" className="btn btn-primary col-sm-12 size-1" disabled >Processing...</button>
                                       }

                                       {/* <span style={{color:'red',fontFamily:'cursive',textAlign:'center'}}>{this.state.ErrorMessage}</span> */}

                                       <div className="my-3 text-center">


                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div class={this.state.etherClickActive == 3 ? "tab-info" : "tab-info active"} style={{ display: this.state.etherClickActive == 3 ? 'block' : 'none' }}>
                                 <div className="col-12 mt-3">
                                    <p>Payable amount : {parseFloat(parseFloat(this.state.getData?.resale_charges_eth).toFixed(6) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2))} ETH ~ ${parseFloat(parseFloat(this.state.getData?.resale_charges).toFixed(2) * parseFloat(this.state.resale_quantity === '' ? 1 : this.state.resale_quantity).toFixed(2))}</p>
                                 </div>

                                 <div className="col-12 mt-3">
                                    <div className="input-group">
                                       <input type="text" className="form-control "
                                          placeholder="Card Number" onKeyPress={(event) => {
                                             if (!/^[0-9\b]+$/.test(event.key)) {
                                                event.preventDefault();
                                             }
                                          }} name="number" maxLength="16"
                                          onChange={this.onChange} value={this.state.number} />
                                    </div>
                                 </div>

                                 <div className="row">
                                    <div className="col-sm-4 mt-3 mb-2">
                                       <div className="input-group">
                                          <input type="text" className="form-control "
                                             placeholder="Exp Month" name="expMonth" onKeyPress={(event) => {
                                                if (!/^[0-9\b]+$/.test(event.key)) {
                                                   event.preventDefault();
                                                }
                                             }} onChange={this.onChange} maxLength="2"
                                             value={this.state.expMonth} />
                                          {/* <input type="date" className="form-control datepicker " placeholder="12/11/1997" name="Date" /> */}
                                       </div>
                                    </div>

                                    <div className="col-sm-4 mt-3 mb-2">
                                       <div className="input-group">
                                          <input type="text" className="form-control "
                                             placeholder="Exp Year" onKeyPress={(event) => {
                                                if (!/^[0-9\b]+$/.test(event.key)) {
                                                   event.preventDefault();
                                                }
                                             }} name="expYear" maxLength="4"
                                             onChange={this.onChange} value={this.state.expYear} />
                                          {/* <input type="date" className="form-control datepicker " placeholder="12/11/1997" name="Date" required=""/> */}
                                       </div>
                                    </div>



                                    <div className="col-sm-4 mt-3 mb-2">
                                       <div className="input-group">
                                          <input type="text" className="form-control " onKeyPress={(event) => {
                                             if (!/^[0-9\b]+$/.test(event.key)) {
                                                event.preventDefault();
                                             }
                                          }} placeholder="cvv" name="cvv" onChange={this.onChange} value={this.state.cvv} maxLength="3"
                                          />
                                       </div>
                                    </div>
                                 </div>


                                 {this.state.paypalError === '' ? '' : <p style={{ color: 'red' }}> {this.state.paypalError}</p>}

                                 <div className="col-12 mt-3">
                                    {this.state.loadingStripe === 0 ?
                                       <button type="submit" className="btn btn-primary col-sm-12 size-1 " disabled={!this.state.number || !this.state.expYear || !this.state.expMonth || !this.state.cvv} onClick={this.paymentStripeShow} >Pay with card</button> :
                                       <button type="submit" className="btn btn-primary col-sm-12 size-1 " disabled >Processing...</button>

                                    }

                                 </div>

                              </div>

                           </div>
                        </div>


                     }
                  </div>
               </div>
            </div>


         </>
      )
   }
}