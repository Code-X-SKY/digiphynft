import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ReactDatatable from '@ashvin27/react-datatable'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Modal from 'react-awesome-modal';
import Swal from 'sweetalert2'
import { Dialog } from "@blueprintjs/core";
import BarLoader from 'react-bar-loader'
import Web3 from 'web3';
import $ from 'jquery';

const headers = {
   'Content-Type': 'application/json'
};


export default class paymentsetting extends Component {

   constructor(props) {
      super(props)
      this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'));
      if (this.loginData.length === 0) {
         window.location.href = `${config.baseUrl}login`
      }
      this.state = {
         talentStatusAPIData: '',
         getWalletDetailAPIData: '',
         rece_address: '',
         amount: '',
         processing: '',
         getWalletTransactionAPIData: [],
         copied: false,
         revealModel: false,
         userItemData1: '',
         revealModel5: false,
         transferTokenModel6: false,
         revealModel6: false,
         userItemData15: '',
         searchDataList: [],
         usercheck: false,
         transfer_token: 0,
         external_wallet_address: "",
         InrWith: '',
         metaMaskTokenBalance: 0,
         getWithdrawInrData: [],
         getCoinTransferToUser: [],
         getWithdrawl: [],
         blockActive: 1,
         depositCoin: '',
         coinValue: '',
         from_address: '',
         transferTokenData6: '',
         walletAddress: localStorage.getItem('walletType')
      }
      this.withdraw = this.withdraw.bind(this)
      this.onChange = this.onChange.bind(this)
      this.coinTransferAPI = this.coinTransferAPI.bind(this)
      this.coinTransferToMetaMaskAPI = this.coinTransferToMetaMaskAPI.bind(this)
      this.depositCoinToAdmin = this.depositCoinToAdmin.bind(this)
      console.log('bbbbbbbbbb', this.state.walletAddress)
      this.columns = [


         // {
         //    key: "to_address",
         //    text: "Withdrawal Address",
         //    cell: (item) => {
         //       return (
         //          <>
         //             <span title={item.to_address}>{item?.to_address.toString().substring(0, 8) + '...' + item?.to_address.toString().substr(item?.to_address.length - 8)}

         //                &nbsp; <CopyToClipboard text={item.to_address}
         //                   onCopy={() => this.setState({ copied: true })}>
         //                   <img src="images/copy-link.png" style={{ cursor: 'pointer' }} className="link-copy" />

         //                </CopyToClipboard>
         //                {this.state.copied ? <div className="mt-1 d-block">Copied!</div> : ''}
         //             </span>


         //          </>
         //       )
         //    }

         // },

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
            key: "transaction_type",
            text: "Transaction Type",
            cell: (item) => {
               return (
                  <td style={{ width: '120px' }}>

                     <span> {item.transaction_type}</span>
                  </td>
               );
            }
         },



         {
            key: "amount",
            text: "Amount (₹)",
            cell: (item) => {
               return (
                  <span>{item.amount}</span>
               );
            }

         },
         {
            key: "token",
            text: "Token (DIGI)",
            cell: (item) => {
               return (
                  <span>{item.token}</span>
               );
            }

         },
         {
            key: "transaction_date",
            text: "Transaction Date",
            cell: (item) => {
               return (
                  <td style={{ width: '120px' }}>

                     <span> {item.transaction_date}</span>
                  </td>
               );
            }
         },


      ]

      this.columns1 = [


         {
            key: "transaction_id",
            text: "Transaction Id",
            sortable: true,
            cell: (item) => {
               return (
                  <>
                     <a href={config.redirectUrl + `nftdetail/${item.item_edition_id}`}>{item.transaction_id}</a>
                  </>
               )
            }
         },

         {
            key: "date",
            text: "Date",
            cell: (item) => {
               return (
                  <td style={{ width: '120px' }}>

                     <span> {item.date}</span>
                  </td>
               );
            }
         },
         {
            key: "email",
            text: "Email ",
            cell: (item) => {
               return (
                  <span>{item.email}</span>
               );
            }

         },
         {
            key: "user_name",
            text: "User Name",
            cell: (item) => {
               return (
                  <td style={{ width: '120px' }}>

                     <span> {item.user_name}</span>
                  </td>
               );
            }
         },


      ]

      this.columns2 = [


         {
            key: "transaction_id",
            text: "Transaction Id",
            sortable: true,
            cell: (item) => {
               return (
                  <>
                     <a href={config.redirectUrl + `nftdetail/${item.item_edition_id}`}>{item.transaction_id}</a>
                  </>
               )
            }
         },

         {
            key: "date",
            text: "Date",
            cell: (item) => {
               return (
                  <td style={{ width: '120px' }}>

                     <span> {item.date}</span>
                  </td>
               );
            }
         },
         {
            key: "email",
            text: "Email ",
            cell: (item) => {
               return (
                  <span>{item.email}</span>
               );
            }

         },
         {
            key: "user_name",
            text: "User Name",
            cell: (item) => {
               return (
                  <td style={{ width: '120px' }}>

                     <span> {item.user_name}</span>
                  </td>
               );
            }
         },


      ]

      this.columns3 = [


         // {
         //    key: "transaction_id",
         //    text: "Transaction Id",
         //    sortable: true,
         //    cell: (item) => {
         //       return (
         //          <>
         //             <a href={config.redirectUrl + `nftdetail/${item.item_edition_id}`}>{item.transaction_id}</a>
         //          </>
         //       )
         //    }
         // },
         // {
         //    key: "full_name",
         //    text: "Full Name ",
         //    cell: (item) => {
         //       return (
         //          <span>{item.full_name}</span>
         //       );
         //    }

         // },
         {
            key: "account_name",
            text: "Account Name ",
            cell: (item) => {
               return (
                  <span>{item.account_name}</span>
               );
            }

         },
         {
            key: "account_name",
            text: "Account Name ",
            cell: (item) => {
               return (
                  <span>{item.account_name}</span>
               );
            }

         },
         {
            key: "account_number",
            text: "Account Number ",
            cell: (item) => {
               return (
                  <span>{item.account_number}</span>
               );
            }

         },
         {
            key: "ifsc_code",
            text: "IFSC Code ",
            cell: (item) => {
               return (
                  <span>{item.ifsc_code}</span>
               );
            }

         },
         {
            key: "bank_name",
            text: "Bank Name ",
            cell: (item) => {
               return (
                  <span>{item.bank_name}</span>
               );
            }

         },
         // {
         //    key: "date",
         //    text: "Date",
         //    cell: (item) => {
         //       return (
         //          <td style={{ width: '120px' }}>

         //             <span> {item.date}</span>
         //          </td>
         //       );
         //    }
         // },
         {
            key: "email",
            text: "Email ",
            cell: (item) => {
               return (
                  <span>{item.email}</span>
               );
            }

         }

         // {
         //    key: "user_name",
         //    text: "User Name",
         //    cell: (item) => {
         //       return (
         //          <td style={{ width: '120px' }}>

         //             <span> {item.user_name}</span>
         //          </td>
         //       );
         //    }
         // },


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


   componentDidMount() {
      this.talentStatusAPI()
      this.getWalletDetailAPI()
      this.getWalletHistoryAPI('0')

      // this.metaMaskTokenBalance()
      this.getDigiCoin()
      setInterval(() => {
         this.metaMaskTokenBalance()
      }, 10000);
      this.getWithdrawInr()
      this.getCoinTransferToUser()
      this.getWithdrawl()
      // $('.royaltyHeader button').click(function(){
      //    $('.royaltyHeader button').removeClass('active').addClass('inactive');
      //     $(this).removeClass('inactive').addClass('active');
      // });
   }





   async allSearchAPI(id) {
      console.log(this.loginData.data.user_email)
      // e.preventDefault()
      await axios({
         method: 'post',
         url: `${config.apiUrl}allSearch`,
         headers: { "Authorization": this.loginData?.message },
         data: { "search": id }
      }).then(response => {
         if (response.data.success === true) {

            this.setState({
               searchDataList: response.data.response.filter((item) => (item.id != 1 && item.id != this.loginData.data.id)),
               usercheck: true,
            })

         }
         else if (response.data.success === false) {
         }
      }).catch(err => {
         this.setState({
            searchDataList: [],
            usercheck: false
         })


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

   loadingSearch(id) {
      console.log(id)
      this.setState({
         allsearchData: id,
         searchData: id.email,
         searchDataList: []
      })
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


   async getWalletDetailAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getWalletDetail`,
         headers: { "Authorization": this.loginData?.Token },
         data: { "email": this.loginData.data.user_email, 'user_id': this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getWalletDetailAPIData: result.data
               })
               // console.log('token_balance',this.state.getWalletDetailAPIData.token_balance)
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   async getWithdrawInr() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getWithdrawInr`,
         headers: { "Authorization": this.loginData?.Token },
         data: { "email": this.loginData.data.user_email, 'user_id': this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getWithdrawInrData: result.data.data,
               })
               // console.log("123", result.data.data);

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });

   }

   async getCoinTransferToUser() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getCoinTransferToUser`,
         headers: { "Authorization": this.loginData?.Token },
         data: { "email": this.loginData.data.user_email, 'user_id': this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getCoinTransferToUserData: result.data.data,
               })
               // console.log("123", result.data.data);

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });

   }

   async getWithdrawl() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getWithdrawl`,
         headers: { "Authorization": this.loginData?.Token },
         data: { "email": this.loginData.data.user_email, 'user_id': this.loginData.data.id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getWithdrawlData: result.data.data,
               })
               console.log("123", result.data.data);

            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });

   }


   async withdraw(event) {
      event.preventDefault();
      this.setState({
         processing: 1
      })
      await axios({
         method: 'post',
         url: `${config.apiUrl}userWithdraw`,
         headers: { "Authorization": this.loginData?.Token },
         data: { "email": this.loginData.data.user_email, 'user_id': this.loginData.data.id, "amount": this.state.InrWith, }
      })
         .then(result => {
            if (result.data.success === true) {
               toast.success('Withdraw successfully', {
                  position: toast.POSITION.TOP_CENTER
               });
               this.setState({
                  rece_address: '',
                  amount: '',
                  processing: ''
               })
               setTimeout(() => {
                  window.location.reload()
               }, 500);
            }
            else if (result.data.success === false) {
               this.setState({
                  processing: ''
               })
            }
         }).catch(err => {
            toast.error(err?.response?.data?.msg, {
               position: toast.POSITION.TOP_CENTER
            });
            this.setState({
               processing: '',
               revealModel5: false
            })
         });


   }


   metaMaskTokenBalance = async () => {

      this.setState({
         refreshBtn: false
      })

      if (window.ethereum) {

         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
         this.setState({
            ConnectWalletAddress: accounts[0]
         })
         localStorage.setItem('walletType', this.state.ConnectWalletAddress)
         var web3 = new Web3(window.ethereum);

         var currentNetwork = web3.currentProvider.chainId;

         //   if (currentNetwork != '56' && currentNetwork != '0x38') {
         //     // toast.error(`Please select BNB  network !`);

         //     return false;
         //   }




         console.log('accounts[0]',accounts[0])
         var from_address = accounts[0];
         const contract = await new web3.eth.Contract(config.DGB_ABI, config.DGB_Token);
         let decimals = await contract.methods.decimals().call();
         decimals = parseInt(decimals);

         //  var getMetaBalace = await contract.methods.balanceOf(from_address).call();




         var currentBal = await contract.methods.balanceOf(from_address).call() / (10 ** 18);


         //    var currentBalRUSD = await contract.methods.balanceOf(config.RUSD_POOL_ADDRESS).call()  / (10 ** 18);



         this.setState({
            metaMaskTokenBalance: currentBal,
            refreshBtn: true
         })


      }

   }

   //========================================  Wallet history API  ===================================

   async getWalletHistoryAPI(id) {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getWalletTransaction`,
         headers: { "Authorization": this.loginData?.Token },
         data: { "email": this.loginData.data.user_email, 'user_id': this.loginData.data.id, 'type_id': id }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getWalletTransactionAPIData: result.data.response
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
            this.setState({
               getWalletTransactionAPIData: []
            })
         });
   }

   loading(id) {
      // alert(id)
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
      // else if (id == '8') {
      //    window.location.href = `${config.baseUrl}bulk_nft`
      // }

   }



   openModal6(item) {
      this.setState({
         revealModel6: true,
         userItemData6: item
      });
   }

   closeModal6() {
      this.setState({

         revealModel6: false
      });
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


   openModal5(item) {
      this.setState({
         revealModel5: true,
         userItemData5: item
      });
   }

   closeModal5() {
      this.setState({

         revealModel5: false
      });
   }


   openModalTransferToken(item) {
      this.setState({
         transferTokenModel6: true,
         transferTokenData6: item
      });
   }

   closeModalTransferToken() {
      this.setState({

         transferTokenModel6: false
      });
   }

   async coinTransferAPI() {
      this.setState({
         isDialogOpen: true,
         revealModel: false
      })

      setTimeout(async () => {

         const response = await axios({
            method: 'post',
            url: `${config.apiUrl}coinTransfer`,
            headers: { "Authorization": this.loginData?.Token },
            data: {
               "user_id": this.loginData.data.id, "transfer_id": this.state.allsearchData.id,
               "token": this.state.token
            }
         })
            .then(async response => {

               if (response.data.success) {
                  this.setState({
                     isDialogOpen: false,
                     checkout: false,
                     revealModel: false
                  })
                  var willSearch = await Swal.fire({
                     title: 'successful!',
                     text: `Coins is transfered to ${this.state.allsearchData.email}`,
                     icon: 'success',
                     width: 500,
                     confirmButtonColor: '#3085d6',
                     allowOutsideClick: false,
                     // showCancelButton: true,
                     confirmButtonText: 'View items',
                     // cancelButtonText: 'No, keep it'
                  });
                  window.location.href = '/paymentsetting'
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
      }, 10000);


   }



   async coinTransferToMetaMaskAPI() {

      if (!this.state.external_wallet_address && this.state.external_wallet_address == '') {
         toast.error("Please Enter wallet address")
         this.setState({
            revealModel6: false
         });
         return;
      }
      if (!this.state.transfer_token && this.state.transfer_token == '' && this.state.transfer_token == 0) {
         toast.error("Please Enter Token for transfer")
         this.setState({
            revealModel6: false
         });
         return;
      }

      if (parseInt(this.state.transfer_token) > parseInt(this.state.getWalletDetailAPIData.token_balance)) {
         toast.error("insufficient funds for transfer")
         this.setState({
            revealModel6: false
         });
         return;

      } else {
         this.setState({
            isDialogOpen: true,
            revealModel6: false
         })
         const response = await axios({
            method: 'post',
            url: `${config.apiUrl}transferTokenToMetamaskWallet`,
            headers: { "Authorization": this.loginData?.Token },
            data: {
               "user_id": this.loginData.data.id, "to_address": this.state.external_wallet_address,
               "token": this.state.transfer_token
            }
         })
            .then(async response => {
               if (response.data.success) {
                  this.setState({
                     isDialogOpen: false,
                     checkout: false,
                     revealModel6: false
                  })
                  var willSearch = await Swal.fire({
                     title: 'successful!',
                     text: `Coins is transfered to your wallet address: ${this.state.external_wallet_address}`,
                     icon: 'success',
                     width: 500,
                     confirmButtonColor: '#3085d6',
                     allowOutsideClick: false,
                     // showCancelButton: true,
                     confirmButtonText: 'View items',
                     // cancelButtonText: 'No, keep it'
                  });
                  window.location.href = '/paymentsetting'

               } else {
                  toast.error((!response.data.msg) ? 'Something went wrong! Please try again later.' : response.data.msg, {
                     position: toast.POSITION.TOP_CENTER,
                  })
                  this.setState({
                     isDialogOpen: false,
                     revealModel6: false

                  })
               }
            }).catch(err => {

               this.setState({
                  errorMessageSripe: err?.response?.data?.msg,
                  isDialogOpen: false,
                  revealModel6: false

               })
            });
      }
   }


   async filterTransaction(id) {
      this.getWalletHistoryAPI(id)
      this.setState({
         filterTransaction: id,
         blockActive: 1
      });
   }

   block(id) {

      if (id == 1) {
         this.setState({
            blockActive: 1
         })
      }
      if (id == 2) {
         this.setState({
            blockActive: 2
         })
      }
      if (id == 3) {
         this.setState({
            blockActive: 3
         })
      }
      if (id == 4) {
         this.setState({
            blockActive: 4
         })
      }


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
                  coinValue: response.data.public_key
               })
            }
         })
   }


   async depositCoinToAdmin() {
      // transferTokenData6

      try {
         if (window.ethereum) {
            const to_address = this.state.coinValue;
            var web3 = '';
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            let currentNetwork = await web3.currentProvider.chainId;

            web3.eth.defaultAccount = accounts[0];

            this.setState({
               transferTokenModel6: false,
               from_address: accounts[0],
               isDialogOpen: true
            })
            var from_address = accounts[0];
            if (from_address === undefined) {
               toast.error("Please  connect to your wallet first");
               this.setState({
                  transferTokenModel6: false,
                  isDialogOpen: false

               })
               return;
            }
            const contract = await new web3.eth.Contract(config.DGB_ABI, config.DGB_Token);
            let decimals = await contract.methods.decimals().call();
            decimals = parseInt(decimals);
            let percentageListData = parseFloat(this.state.depositCoin).toFixed(6)

            percentageListData = parseFloat(percentageListData) * (10 ** decimals);
            percentageListData = percentageListData.toLocaleString('fullwide', { useGrouping: false });

            var getMetaBalace = await contract.methods.balanceOf(from_address).call();
            let tokenListData = parseFloat(getMetaBalace).toFixed(6)  //metamask


            if (parseFloat(percentageListData) > parseFloat(tokenListData)) {
               toast.error(`Insufficient Token for transfer`);

               this.setState({
                  transferTokenModel6: false,
                  isDialogOpen: false
               })

               return false;
            }
            var trx_amount = parseInt(this.state.depositCoin);
            trx_amount = (trx_amount * 10 ** 18).toString()

            let trx = await contract.methods.transfer(to_address, trx_amount);

            let encodeData = trx.encodeABI();
            let gasPrice1 = await web3.eth.getGasPrice();

            let gasLimit1 = await web3.eth.estimateGas({
               gasPrice: web3.utils.toHex(gasPrice1),
               to: config.DGB_Token,
               from: from_address,
               data: encodeData,
               // chainId: chainId,
            });
            const txData = await web3.eth.sendTransaction({
               gasPrice: web3.utils.toHex(gasPrice1),
               gas: web3.utils.toHex(gasLimit1),
               to: config.DGB_Token,
               from: from_address,
               data: encodeData,
               // chainId: chainId,
            });

            if (txData.transactionHash) {
               // let data = {
               //     'from_address': from_address,
               //     'hash': txData.transactionHash
               // }
               this.depositTokenAPI(txData.transactionHash)
            }
         }
      }
      catch (error) {
         console.log(error)
         toast.error(`Something went wrong! Please try again.`, {

         });
         this.setState({
            transferTokenModel6: false,
            isDialogOpen: false
         })

         return false;
      }
   }


   async depositTokenAPI(id) {

      await axios({
         method: 'post',
         url: `${config.apiUrl}depositToken`,
         headers: { "Authorization": this.loginData?.Token },
         data: {
            "user_id": this.loginData.data.id,
            "to_address": this.state.coinValue,
            "from_address": this.state.from_address,
            "token": this.state.depositCoin,
            "transactionHash": id
         }
      })
         .then(async response => {
            if (response.data.success) {
               this.setState({
                  isDialogOpen: false,
                  transferTokenModel6: false,
               })
               var willSearch = await Swal.fire({
                  title: 'Token Transfer!',
                  text: 'Congratulations, you successfully Transfer The Token',
                  icon: 'success',
                  width: 500,
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                  // showCancelButton: true,
                  confirmButtonText: 'Ok',
                  // cancelButtonText: 'No, keep it'
               });
               window.location.href = `${config.baseUrl}paymentsetting`
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


   render() {
      return (

         <>
            <Header />
            <div class="page-login" >
               <div id="content-block">
                  <div className="container be-detail-container your-purchase-bid">
                     <ToastContainer />
                     <div className="row">
                        <div className="left-feild col-xs-12 col-sm-3">

                           <div className="be-vidget" id="scrollspy">
                              {/* <h2 className=" mb-4">Wallet</h2> */}

                              <div className="creative_filds_block">
                                 <ul className="ul nav">
                                    {this.state.talentStatusAPIData?.telent_status === 1 ?
                                       <li className="edit-ln" ><Link onClick={this.loading.bind(this, '6')} to={`${config.baseUrl}featurescreator/${this.loginData.data.id}`}>My Profile</Link></li>
                                       : ''

                                    }
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '1')} to={`${config.baseUrl}authoredit`}>Account Setting</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '2')} to={`${config.baseUrl}about`}>About</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '3')} to={`${config.baseUrl}salehistory`}>Sale history</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '4')} to={`${config.baseUrl}yourpurchase`}>Buy history</Link></li>
                                    <li className="edit-ln active" ><Link onClick={this.loading.bind(this, '5')} to={`${config.baseUrl}paymentsetting`}>Wallet</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '7')} to={`${config.baseUrl}royalty`}>Royalty</Link></li>
                                    {/* <li className="edit-ln" ><Link onClick={this.loading.bind(this, '8')} to={`${config.baseUrl}bulk_nft`}>Bulk Nft List</Link></li> */}

                                    {/* <!-- <li className="edit-ln"><a href="#web-references">Web References</a></li> --> */}
                                 </ul>
                              </div>

                           </div>
                        </div>
                        <div className="col-xs-12 col-sm-9">

                           <div className=" be-large-post p-5">

                              <div className="row">
                                 <div className="col-sm-6">
                                    <div>
                                       <p style={{ color: '#fff' }}>DigiPhy Wallet :-</p>
                                       {/* <p style={{ color: '#fff' }}><strong>DigiPhy Coin Wallet :</strong> {this.state.getWalletDetailAPIData?.public}</p> */}
                                       {/* <br /> */}

                                       <p style={{ color: '#fff' }}><strong>Available INR Balance:  </strong>
                                          ₹ {this.state.getWalletDetailAPIData?.inr_balance}
                                       </p>

                                       <p style={{ color: '#fff' }}><strong>Available Token Balance:  </strong>
                                          {this.state.getWalletDetailAPIData?.token_balance} DGB
                                       </p>
                                       <p style={{ color: '#fff' }}><strong>Available Token in MetaMask Wallet :  </strong><br />
                                       {console.log('11111111111', parseFloat(this.state.metaMaskTokenBalance).toFixed(6))}
                                          {this.state.walletAddress ?
                                             parseFloat(this.state.metaMaskTokenBalance).toFixed(6) :
                                             <button className='btn btn-primary' type='submit' onClick={this.metaMaskTokenBalance.bind(this)}>Connect Wallet</button>
                                          }

                                       </p>



                                       <button className='btn btn-primary' disabled={this.state.getWalletDetailAPIData?.token_balance > 0 ? false : true} type='submit' onClick={this.openModal4.bind(this, this.state.getWalletDetailAPIData)}>Transfer DigiPhy Coins
                                       </button>

                                       <button className='btn btn-primary' disabled={this.state.getWalletDetailAPIData?.inr_balance > 0 ? false : true} type='submit' onClick={this.openModal5.bind(this, this.state.getWalletDetailAPIData)}>Withdraw INR
                                       </button>

                                       <button className='btn btn-primary' disabled={this.state.getWalletDetailAPIData?.token_balance > 0 ? false : true} type='submit' onClick={this.openModal6.bind(this, this.state.getWalletDetailAPIData)}>Transfer DigiPhy Coins to wallet
                                       </button>


                                       {(this.state.walletAddress) == null || this.state.walletAddress == "null" ? <button className='btn btn-primary' disabled>Deposit Token
                                       </button> : <button className='btn btn-primary' disabled={this.state.metaMaskTokenBalance > 0 ? false : true} type='submit' onClick={this.openModalTransferToken.bind(this, this.state.getWalletDetailAPIData)}>Deposit Token
                                       </button>}
                                    </div>
                                    {/* <div className='mt-5'>
                                       <p><strong>Crypto Wallet :</strong> {this.state.getWalletDetailAPIData?.public}</p>
                                       <br />
                                       <p>Available Balance:  

                                          {this.state.getWalletDetailAPIData?.eth_balance === null || this.state.getWalletDetailAPIData?.eth_balance === undefined || this.state.getWalletDetailAPIData?.eth_balance === '' ? 0 : this.state.getWalletDetailAPIData?.eth_balance} DG ~ INR 
                                          {this.state.getWalletDetailAPIData?.usd_balance === null || this.state.getWalletDetailAPIData?.usd_balance === undefined || this.state.getWalletDetailAPIData?.usd_balance === '' ? 0 : this.state.getWalletDetailAPIData?.usd_balance}</p>

                                          </div> */}
                                 </div>

                                 {/* <div className="col-sm-6">
                                       <p className='input-label'>Recepient wallet address: </p>
                                       <select className='form-control'>
                                       <option>
                                             INR
                                          </option>    
                                          <option>
                                             DigiPhy Coin
                                          </option>
                                          

                                       </select>
                                       
                                       <br />
                                       <p className='input-label'>Amount: </p>
                                       <div class="row">
                                          <div class="col-sm-8"> <input type="text" className="form-control" name="amount"
                                             onKeyPress={(event) => {
                                                if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                   event.preventDefault();
                                                }
                                             }} placeholder="DG" value={this.state.amount}
                                             onChange={this.onChange} /></div>

                                          <div class="col-sm-4"><div style={{ paddingTop: '5px', wordBreak: 'break-all' }}>~ INR {parseFloat(this.state.amount * this.state.getWalletDetailAPIData?.eth_usd_value).toFixed(2)}</div> </div>
                                       </div>
                                       <br />
                                       {this.state.processing === '' ?
                                          <button className="login100-form-btn" style={{ backgroundColor: '#0d58c8' }} onClick={this.withdraw}
                                             disabled={!this.state.rece_address || !this.state.amount}>Withdraw</button>
                                          :
                                          <button className="login100-form-btn" onClick={this.withdraw}
                                             disabled>Processing...</button>


                                       }
                                    </div> */}
                              </div>




                           </div>



                           <br />
                           {/* <button type='submit' class='btn btn-primary'>Save</button> */}
                           <select value={this.state.filterTransaction} name='filterTransaction' onChange={e => this.filterTransaction(e.target.value)} type="text" class="form-control mainselect" >
                              <option value='0'>ALL </option>
                              <option value='1'>Sell Product</option>
                              <option value='3'>Withdrawal</option>
                              <option value='10'>Adjustment Entry</option>
                              <option value='8'>Royalty Received</option>
                              <option value='12'>Bid Refund</option>
                              <option value='13'>Coin Purchased</option>
                              <option value='15'>Coin Transfer to user</option>
                              <option value='17'>Coin Transfer to Wallet</option>
                              <option value='18'>Deposit Token</option>


                           </select>
                           <div className=" be-large-post mb-0 pb-0">
                              <div class=" style-1 royaltyHeader">

                                 <ul className=''>
                                    <li onClick={this.block.bind(this, 1)}><button className={this.state.blockActive == 1 ? 'active' : ''}>Withdraw History</button></li>
                                    <li onClick={this.block.bind(this, 2)}><button className={this.state.blockActive == 2 ? 'active' : ''}>Coin Transfer to wallet </button></li>
                                    <li onClick={this.block.bind(this, 3)}><button className={this.state.blockActive == 3 ? 'active' : ''}>Coin Transfer to user</button></li>
                                    <li onClick={this.block.bind(this, 4)}><button className={this.state.blockActive == 4 ? 'active' : ''}>Withdraw INR</button></li>
                                 </ul>

                                 {/* <div class="row be-large-post-align "><h3 onClick={this.block.bind(this,1)} class="col-md-3 info-block-label">Withdraw History</h3>  
                                 <h3 class="col-md-2 info-block-label" onClick={this.block.bind(this,2)} >Withdraw INR</h3>

                                 <h3 class="col-md-3 info-block-label" onClick={this.block.bind(this,3)} >Coin Transfer to user</h3>
                                 <h3 class="col-md-4 info-block-label" onClick={this.block.bind(this,4)} >Coin Transfer to wallet</h3>
                                 </div> */}
                              </div>
                              <div className=" p-5">

                                 <div className="" style={{ display: this.state.blockActive == 1 ? 'block' : 'none' }}>


                                    <ReactDatatable
                                       config={this.config}
                                       records={this.state.getWalletTransactionAPIData}
                                       columns={this.columns}
                                    />
                                 </div>

                                 <div style={{ display: this.state.blockActive == 2 ? 'block' : 'none' }}>

                                    <ReactDatatable
                                       config={this.config}
                                       records={this.state.getWithdrawInrData}
                                       columns={this.columns1}
                                    />
                                 </div>
                                 <div style={{ display: this.state.blockActive == 3 ? 'block' : 'none' }}>
                                    <ReactDatatable
                                       config={this.config}
                                       records={this.state.getCoinTransferToUserData}
                                       columns={this.columns2}
                                    />
                                 </div>

                                 <div style={{ display: this.state.blockActive == 4 ? 'block' : 'none' }}>

                                    <ReactDatatable
                                       config={this.config}
                                       records={this.state.getWithdrawlData}
                                       columns={this.columns3}
                                    />

                                 </div>

                                 <Dialog
                                    title="Please Wait..."
                                    // icon="warning-sign"
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


                              </div>
                           </div>
                        </div>

                     </div>
                  </div>
               </div>

               <br />
               <br />
            </div>

            <Modal visible={this.state.revealModel} width="500" effect="fadeInUp" onClickAway={() => this.closeModal4()}>
               <div className='header_modal creditcard'>
                  <div className='modal-header text-right d-flex pt-4 pb-4'>
                     <h1 className="ant-typography title text-center">Transfer DigiPhy Coins</h1>
                     <button className='close mt-1' onClick={() => this.closeModal4()}><span>x</span></button>
                  </div>
                  <div className='modal-body text-left p-5'>
                     <div className=''>
                        <form className="input-search" onSubmit={(e => e.preventDefault())}>
                           <p>Search User By Email</p>
                           <input type="text" style={{ color: '#fff' }} autoComplete="off" className="form-control" value={this.state.searchData} name="searchData" onChange={this.onChange} placeholder="Search" />
                           <i className="fa fa-search"></i>

                           <ul className="search_ul" style={{ display: this.state.searchDataList.length === 0 ? 'none' : 'block', overflowX: 'hidden' }}>
                              {this.state.searchDataList.map((item, i) => {

                                 return (
                                    <>


                                       {/* <p style={{color:'#000'}}>People</p> */}
                                       <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.user_name} >
                                          <div onClick={this.loadingSearch.bind(this, item)}>
                                             <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                ? 'images/noimage.webp'
                                                :
                                                `${config.imageUrl1}${item.profile_pic}`} style={{ height: '35px', width: '35px', borderRadius: '50%' }} alt="" />
                                             <span data-id={item.id} style={{ marginLeft: "10px", position: "relative", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.user_name}</span>
                                             <br />
                                             <span data-id={item.id} style={{ marginLeft: "42px", position: "relative", top: "-15px", color: "rgba(0, 0, 0, 0.54)" }}>{item.email}</span>


                                          </div>
                                       </li></>


                                 )


                              })}
                           </ul>


                           <p>Tokens to be transfer</p>
                           <input type="text" style={{ color: '#fff' }} autoComplete="off" className="form-control" value={this.state.token} name="token" onChange={this.onChange} placeholder="Token" />
                           {/* <div className='col-md-4'> */}

                           <button disabled={(this.state.getWalletDetailAPIData?.token_balance > 0 && this.state.getWalletDetailAPIData?.token_balance > this.state.token && this.state.token && this.state.searchData && this.state.usercheck == true) ? false : true} className='btn btn-primary' type="submit" onClick={this.coinTransferAPI} style={{
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


            <Modal visible={this.state.revealModel6} width="500" effect="fadeInUp" onClickAway={() => this.closeModal4()}>
               <div className='header_modal creditcard'>
                  <div className='modal-header text-right d-flex pt-4 pb-4'>
                     <h1 className="ant-typography title text-center">Transfer DigiPhy Coins to Metamask wallet</h1>
                     <button className='close mt-1' onClick={() => this.closeModal6()}><span>x</span></button>
                  </div>
                  <div className='modal-body text-left p-5'>
                     <div className=''>
                        <form className="input-search" onSubmit={(e => e.preventDefault())}>
                           <p>Please Enter your wallet address</p>
                           <input type="text" style={{ color: '#fff' }} autoComplete="off" className="form-control" value={this.state.external_wallet_address} name="external_wallet_address" onChange={this.onChange} placeholder="Please Enter your wallet address" />



                           <p>Tokens to be transfer</p>
                           <input type="text" style={{ color: '#fff' }} autoComplete="off" className="form-control" value={this.state.transfer_token} name="transfer_token" onChange={this.onChange} placeholder="Token" />
                           {/* <div className='col-md-4'> */}
                           {/* disabled={(this.state.getWalletDetailAPIData?.token_balance > 0 && this.state.getWalletDetailAPIData?.token_balance > this.state.transfer_token && this.state.transfer_token && this.state.external_wallet_address) ? false : true} */}
                           <button className='btn btn-primary' type="submit" onClick={this.coinTransferToMetaMaskAPI} style={{
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


            <Modal visible={this.state.revealModel5} width="500" effect="fadeInUp" onClickAway={() => this.closeModal5()}>
               <div className='header_modal creditcard'>
                  <div className='modal-header text-right d-flex pt-4 pb-4'>
                     <h1 className="ant-typography title text-center">Withdraw INR</h1>
                     <button className='close mt-1' onClick={() => this.closeModal5()}><span>x</span></button>
                  </div>
                  <div className='modal-body text-left p-5'>
                     <div className=''>
                        <form className="input-search" onSubmit={(e => e.preventDefault())}>

                           <p>Withdraw Amount</p>
                           <input type="text" style={{ color: '#fff' }} autoComplete="off" className="form-control" value={this.state.InrWith} name="InrWith" onChange={this.onChange} placeholder="Withdraw Amount" />
                           {/* <div className='col-md-4'> */}

                           <button disabled={(this.state.InrWith && parseFloat(this.state.getWalletDetailAPIData?.inr_balance) > parseFloat(this.state.InrWith)) ? false : true} className='btn btn-primary' type="submit" onClick={this.withdraw} style={{
                              width: 'auto',
                              marginTop: '8px',
                              padding: '9px',
                              height: 'auto'
                           }}>Withdraw</button>

                           {/* </div> */}
                           {/* </datalist> */}
                        </form>
                     </div>




                  </div>

               </div>

            </Modal>


            <Modal visible={this.state.transferTokenModel6} width="500" effect="fadeInUp" onClickAway={() => this.closeModalTransferToken()}>
               <div className='header_modal creditcard'>
                  <div className='modal-header text-right d-flex pt-4 pb-4'>
                     <h1 className="ant-typography title text-center">Deposit Token</h1>
                     <button className='close mt-1' onClick={() => this.closeModalTransferToken()}><span>x</span></button>
                  </div>
                  <div className='modal-body text-left p-5'>
                     <div className=''>
                        <form className="input-search" onSubmit={(e => e.preventDefault())}>

                           <p>Deposit Coin</p>
                           <input type="text" style={{ color: '#fff' }} autoComplete="off" className="form-control" value={this.state.depositCoin} name="depositCoin" onChange={this.onChange} placeholder="Deposit Coin" />
                           {/* <div className='col-md-4'> */}

                           <button disabled={(this.state.depositCoin <= this.state.metaMaskTokenBalance) ? false : true} className='btn btn-primary' type="submit" onClick={this.depositCoinToAdmin} style={{
                              width: 'auto',
                              marginTop: '8px',
                              padding: '9px',
                              height: 'auto'
                           }}>Deposit</button>

                           {/* </div> */}
                           {/* </datalist> */}
                        </form>
                     </div>




                  </div>

               </div>

            </Modal>
            <Footer />
         </>
      )
   }
}
