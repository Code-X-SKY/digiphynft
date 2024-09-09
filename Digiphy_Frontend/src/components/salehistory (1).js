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
         userItemData15: '',
         searchDataList: [],
         InrWith: ''
      }
      this.withdraw = this.withdraw.bind(this)
      this.onChange = this.onChange.bind(this)
      this.coinTransferAPI = this.coinTransferAPI.bind(this)
      this.coinTransferToMetaMaskAPI = this.coinTransferToMetaMaskAPI.bind(this)

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
      this.getWalletHistoryAPI()
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
               searchDataList: response.data.response.filter((item) => (item.id != 1 && item.id != this.loginData.data.id))
            })

         }
         else if (response.data.success === false) {
         }
      }).catch(err => {
         this.setState({
            searchDataList: []
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
               processing: ''
            })
         });


   }

   //========================================  Wallet history API  ===================================

   async getWalletHistoryAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getWalletTransaction`,
         headers: { "Authorization": this.loginData?.Token },
         data: { "email": this.loginData.data.user_email, 'user_id': this.loginData.data.id }
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
      else if (id == '8') {
         window.location.href = `${config.baseUrl}bulk_nft`
      }

   }



   openModal6(item) {
      this.setState({
         revealModel: true,
         userItemData6: item
      });
   }

   closeModal6() {
      this.setState({

         revealModel: false
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


   async coinTransferAPI() {
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


   async coinTransferToMetaMaskAPI() {

      if(!this.state.external_wallet_address && this.state.external_wallet_address==''){
         toast.error("Please Enter wallet address")
         return;
      }
      if(!this.state.transfer_token && this.state.transfer_token==''){
         toast.error("Please Enter Token for transfer")
        
         return;
      }
      if(parseInt(this.state.transfer_token) > parseInt(this.state.getWalletDetailAPIData.token_balance)){
         toast.error("insufficient funds for transfer")
         this.setState({
            revealModel: false
         });
         return;
      }else{
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
                  revealModel: false
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
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '4')} to={`${config.baseUrl}yourpurchase`}>Bids</Link></li>
                                    <li className="edit-ln active" ><Link onClick={this.loading.bind(this, '5')} to={`${config.baseUrl}paymentsetting`}>Wallet</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '7')} to={`${config.baseUrl}royalty`}>Royalty</Link></li>
                                    <li className="edit-ln" ><Link onClick={this.loading.bind(this, '8')} to={`${config.baseUrl}bulk_nft`}>Bulk Nft List</Link></li>

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


                                       <button className='btn btn-primary' disabled={this.state.getWalletDetailAPIData?.token_balance > 0 ? false : true} type='submit' onClick={this.openModal4.bind(this, this.state.getWalletDetailAPIData)}>Transfer DigiPhy Coins
                                       </button>

                                       <button className='btn btn-primary' disabled={this.state.getWalletDetailAPIData?.inr_balance > 0 ? false : true} type='submit' onClick={this.openModal5.bind(this, this.state.getWalletDetailAPIData)}>Withdraw INR
                                       </button>

                                       <button className='btn btn-primary' disabled={this.state.getWalletDetailAPIData?.token_balance > 0 ? false : true} type='submit' onClick={this.openModal6.bind(this, this.state.getWalletDetailAPIData)}>Transfer DigiPhy Coins to wallet
                                       </button>
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

                           <div className=" be-large-post mb-0 pb-0">
                              <div class="info-block style-1 royaltyHeader">
                                 <div class="be-large-post-align "><h3 class="info-block-label">Withdrawal History</h3></div></div>
                              <div className=" p-5">

                                 <div className="">


                                    <ReactDatatable
                                       config={this.config}
                                       records={this.state.getWalletTransactionAPIData}
                                       columns={this.columns}
                                    />

                                 </div>




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

                           <button disabled={(this.state.getWalletDetailAPIData?.token_balance > 0 && this.state.getWalletDetailAPIData?.token_balance > this.state.token && this.state.token && this.state.searchData) ? false : true} className='btn btn-primary' type="submit" onClick={this.coinTransferAPI} style={{
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


            <Modal visible={this.state.revealModel} width="500" effect="fadeInUp" onClickAway={() => this.closeModal4()}>
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

                           <button disabled={(this.state.getWalletDetailAPIData?.token_balance > 0 && this.state.getWalletDetailAPIData?.token_balance > this.state.transfer_token && this.state.transfer_token && this.state.external_wallet_address) ? false : true} className='btn btn-primary' type="submit" onClick={this.coinTransferToMetaMaskAPI} style={{
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
            <Footer />
         </>
      )
   }
}
