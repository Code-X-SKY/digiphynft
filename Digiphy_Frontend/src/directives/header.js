import { Component } from 'react';
import config from '../config/config'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import axios from 'axios';
import 'react-sticky-header/styles.css';
import Modal from 'react-awesome-modal';
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3';

const MAX_LENGTH = 25;

export default class header extends Component {

   constructor(props) {
      super(props)
      this.state = {
         visible: false,
         profileData: '',
         searchData: '',
         searchDataList: [],
         headerShowData: '',
         talentStatusAPIData: '',
         nftIndex: '',
         talentIndex: '',
         defaultImage: 0,
         cmn_toggle_switch: false,
         talentSHowHide: 0,
         image_list: [],
         ConnectWalletAddress: '',
      }
      this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))
      console.log('kkkkkkkkkkkkkkkkk', localStorage.getItem('walletType'))
   }


   componentDidMount() {
      this.getWebImageAPI()
      this.getProfilePicAPI()
      this.setState({
         cmn_toggle_switch: false
      })



      const { ethereum } = window;
      if (ethereum) {

         ethereum.on('accountsChanged', (add) =>

            this.metaMasklogout(add)

         );
         ethereum.on('networkChanged', (chainId) =>
            this.networkChanged(chainId)
         );

      }


      // setTimeout(() => {

      //    if (window.ethereum) {
      //       const { ethereum } = window;

      //       var web3 = new Web3(window.ethereum);

      //               var currentNetwork = web3.currentProvider.chainId;

      //             //   if (currentNetwork != '0x38'  && currentNetwork != '0x89' && currentNetwork != '0x1') {
      //             //    toast.error('Please select a network MATIC,BNB and ETH')
      //             //    localStorage.setItem('walletType', '')
      //             //       return;
      //             //   }
      //       this.setState({
      //          ConnectWalletAddress: ethereum.selectedAddress
      //       })
      //       localStorage.setItem('walletType', this.state.ConnectWalletAddress)
      //    }
      // }, 1000);

   }

   async networkChanged(chainId) {
      // if (chainId != '137'  && chainId != '56' && chainId != '1') {
      //    toast.error('Please select a network MATIC,BNB and ETH')
      //    localStorage.removeItem('walletType')
      //    this.metaMasklogout()
      //       return;
      //   }
      (chainId === '137' || chainId === '56' || chainId === '1') ?
         window.location.reload()
         :
         this.metaMasklogout()
   }


   //================================================  Connect metamask =============================================

   async connectMetasmask() {
      if (window.ethereum) {
         await window.ethereum.send('eth_requestAccounts');
         window.web3 = new Web3(window.ethereum);
         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
         var currentNetwork = window.web3.currentProvider.chainId;

         if (currentNetwork != '0x38' && currentNetwork != '0x89' && currentNetwork != '0x1') {

            toast.error('Please select a network MATIC,BNB and ETH')
            this.setState({
               visible: false
            });
            return;
         }
         this.setState({
            ConnectWalletAddress: accounts
         })
         console.log('ssssss', this.state.ConnectWalletAddress);
         localStorage.setItem('walletType', accounts)
         setTimeout(() => {

            window.location.reload()
         }, 100);

      }
      else {

         toast.error(`Please install MetaMask to use this dApp!`)
         this.setState({
            visible: false
         });
         return
      }
      // toast.error(`Please install MetaMask to use this dApp!`, {
      //    position: toast.POSITION.TOP_CENTER
      // });

   }




   //=============================================  Web image =========================================================

   async getWebImageAPI() {
      axios.get(`${config.apiUrl}getWebImage`, {},)
         .then(response => {
            if (response.data.success === true) {
               this.setState({
                  image_list: response.data.response
               })
               localStorage.setItem('image_list', this.state.image_list[0].slider2)
               var link = document.querySelector("link[rel~='icon']");
               if (!link) {
                  link = document.createElement('link');
                  link.rel = 'icon';
                  document.getElementsByTagName('head')[0].appendChild(link);
               }
               link.href = config.imageUrl1 + this.state.image_list[0]?.favicon;
            }
            else if (response.data.success === false) {
            }
         })
         .catch(err => {
         })
   }


   openToggle() {
      this.setState({
         cmn_toggle_switch: !this.state.cmn_toggle_switch,
      })
   }

   async getProfilePicAPI() {
      console.log(this.loginData)
      await axios({
         method: 'post',
         url: `${config.apiUrl}getProfilePic`,
         headers: { "Authorization": this.loginData.Token },
         data: { "email": this.loginData.data?.user_email ? this.loginData.data?.user_email : this.loginData.data?.email }
      }).then(response => {
         if (response.data.success === true) {
            this.setState({
               profileData: response.data.response,
               defaultImage: 1
            })

         }
      })
   }

   metaMasklogout() {

      localStorage.removeItem('walletType')
      this.setState({
         ConnectWalletAddress: ''
      })
      setTimeout(() => {

         window.location.reload()
      });

   }


   logout() {
      Cookies.remove('loginDigiphyFrontend')
      localStorage.removeItem('walletType')
      localStorage.removeItem('tabSelect')
      localStorage.removeItem('tabSelect1')
      localStorage.removeItem('tabSelect2')
      setTimeout(() => {
         window.location.href = `${config.baseUrl}`
      }, 200);
   }


   headerShow(id) {
      if (id === '1') {
         this.setState({
            headerShowData: '1'
         })
      }
      else if (id === '0') {
         this.setState({
            headerShowData: ''
         })
      }
   }



   state = {
      openModal: false
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

   //=========================================================  Check Login =================================

   loginClick(id) {
      if (this.loginData.length === 0) {
         window.location.href = config.baseUrl + 'login'
         return false;
      }
      else if (id == 1) {
         window.location.href = config.baseUrl + 'bulk_item'
      }
      else if (id == 2) {
         window.location.href = config.baseUrl + 'create_an_item'
      }
   }

   render() {
      return (

         <>


            <header >
               <Toaster />


               <div className="container custom-container">
                  <div className="row no_row row-header">
                     <Link to={`${config.baseUrl}`} style={{ zIndex: '1' }} >
                        <div className="brand-be">
                           {/* <img className="logo-c active be_logo" src={config.imageUrl1 + this.state.image_list[0]?.slider2 == undefined || this.state.image_list[0]?.slider2 == 'undefined' || !this.state.image_list[0]?.slider2 ? "/images/logoImage.png" : config.imageUrl1 + localStorage.getItem('image_list')} alt="logo" /> */}
                           <img className="logo-c active be_logo" src="images/logoImage.png" />
                        </div>
                     </Link>
                     <div className="header-menu-block">
                        <button onClick={this.openToggle.bind(this)} className={`cmn-toggle-switch cmn-toggle-switch__htx ${this.state.cmn_toggle_switch ? 'active' : ''}`}>
                           <i class="fa fa-bars" aria-hidden="true"></i>
                        </button>
                        <ul className="header-menu" id="one" style={{ display: (this.state.cmn_toggle_switch) ? 'block' : 'none' }}>
                           <div className="col-md-3 search-box-input" >

                           </div>
                           <li><Link to={`${config.baseUrl}`}>Home</Link></li>
                           <li><Link to={`${config.baseUrl}marketplace`}>Marketplace</Link></li>
                           {/* <li>
                              <Link onClick={this.loginClick.bind(this, 1)}>Bulk Nft</Link>

                           </li> */}

                           <li>
                              <Link onClick={this.loginClick.bind(this, 2)}>Create NFT</Link>

                           </li>




                           {this.loginData.length === 0 ?
                              <>

                                 <li className=" login header-btn"><Link to={`${config.baseUrl}login`} className="">Login</Link></li>
                                 <li className=" login header-btn"><Link to={`${config.baseUrl}register`} className="">Register</Link></li>

                                 <li className=" login header-btn"><a href='https://www.digiphynft.info/' target='_blank' className="">Know More</a></li>

                              </>
                              :
                              <>
                                 <li><Link to={`${config.baseUrl}swapdigiphy`}>Buy DigiPhy coin</Link></li>
                                 {
                                    (localStorage.getItem('walletType')) == null || localStorage.getItem('walletType') == "null" ?
                                       <li className='header-btn'><a href="javascript:void(0);" onClick={() => this.openModal()} >Connect wallet</a></li>
                                       :

                                       (localStorage.getItem('walletType')) ?
                                          <li className='header-btn'><a href={`${config.blockchinUrl}address/${localStorage.getItem('walletType')}`} >{localStorage.getItem('walletType').toString().substring(0, 4) + '...' + localStorage.getItem('walletType').toString().substr(localStorage.getItem('walletType').length - 4)}</a></li>

                                          :
                                          <li className='header-btn'><a href="javascript:void(0);" onClick={() => this.openModal()} >Connect wallet</a></li>

                                 }


                                 <div className="login-header-block user-dropprofile " onClick={this.headerShow.bind(this, this.state.headerShowData === '' ? '1' : '0')}>
                                    <div className="login_block">
                                       <div className="be-drop-down login-user-down">
                                          <span className="be-dropdown-content"> &nbsp; Hi, <span>{this.state.profileData.user_name ? (this.state.profileData.user_name.substring(0, MAX_LENGTH) + '......') : this.state.profileData.full_name ? (this.state.profileData.full_name.substring(0, MAX_LENGTH) + '......') : ''}</span></span>&nbsp;&nbsp;
                                          {this.state.defaultImage === 0 ?
                                             <img className="login-user" style={{ height: '40px', width: '40px' }} src="images/noimage.webp" alt="" /> :

                                             this.state.profileData.profile_pic === '' || this.state.profileData.profile_pic === null ?
                                                <img className="login-user" style={{ height: '40px', width: '40px' }} src="images/noimage.webp" alt="" /> : <img className="image-auth login-user" style={{ height: '40px', width: '40px' }} src={`${config.imageUrl1}${this.state.profileData.profile_pic}`} alt="" />
                                          }

                                          <div className="drop-down-list a-list">

                                             <Link to={`${config.baseUrl}userprofile/${this.loginData.data.id}`}>My Profile</Link>

                                             <Link to={`${config.baseUrl}authoredit`} >Account Setting</Link>
                                             <Link to={`${config.baseUrl}about`} >About</Link>
                                             <Link to={`${config.baseUrl}salehistory`} >Sale history</Link>
                                             <Link to={`${config.baseUrl}yourpurchase`} >Buy History</Link>
                                             <Link to={`${config.baseUrl}paymentsetting`} >Wallet</Link>
                                             <Link to={`${config.baseUrl}royalty`} >Royalty</Link>
                                             {/* <Link to={`${config.baseUrl}bulk_nft`} >Bulk NFT</Link> */}

                                             <Link to={`${config.baseUrl}`} onClick={this.logout.bind(this)}>Logout</Link>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </>
                           }

                        </ul>
                     </div>
                  </div>
               </div>

            </header>
            <div >

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
            </div>

         </>
      )
   }
}     