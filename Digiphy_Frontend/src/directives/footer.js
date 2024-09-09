import { Component } from 'react';
import config from '../config/config'
import { Link } from 'react-router-dom'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import Cookies from 'js-cookie'
export default class footer extends Component {

   constructor(props) {
      super(props)
      this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))
      this.state = {
         getitemData: [],
         recentworkData: [],
         image_list: []
      }

   }
   componentDidMount() {
      this.getWebImageAPI()
      // this.getitemAPI()
      // this.recentworkAPI()

   }

   //=============================================  Web image =========================================================
   async getWebImageAPI() {
      axios.get(`${config.apiUrl}getWebImage`, {},)
         .then(response => {
            if (response.data.success === true) {
               this.setState({
                  image_list: response.data.response
               })
            }
            else if (response.data.success === false) {
            }
         })
         .catch(err => {
         })
   }

   //=======================================  getitem  =====================

   async getitemAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getCategoryById`,
         headers: { "Authorization": this.loginData?.msg },
         data: { 'item_category_id': '0', 'limit': 18 }
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  getitemData: result.data.response,
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   //=======================================  recent work  =====================

   async recentworkAPI() {
      await axios({
         method: 'get',
         url: `${config.apiUrl}getRecentWorks`,
         headers: { "Authorization": this.loginData?.msg },
      })
         .then(result => {
            if (result.data.success === true) {
               this.setState({
                  recentworkData: result.data.response,
               })
            }
            else if (result.data.success === false) {
            }
         }).catch(err => {
         });
   }

   loading() {
      setTimeout(() => {
         window.location.reload()
      });
   }


   //=========================================================  Check Login =================================

   loginClick() {
      if (this.loginData.length === 0) {
         window.location.href = config.baseUrl + 'login'
         return false;
      }
      else {
         window.location.href = config.baseUrl + 'create_an_item'
      }
   }

   render() {
      return (

         <>
            <footer>
               <Toaster />

               {/* <img src="images/section-shape-1.png" alt="Image" class="section-shape" /> */}
               <div className="footer_slider">
                  <div className="swiper-container" data-autoplay="0" data-loop="1" data-speed="500" data-center="0" data-slides-per-view="responsive" data-xs-slides="4" data-sm-slides="8" data-md-slides="14" data-lg-slides="19" data-add-slides="19">
                     <div className="swiper-wrapper">
                        {/* {this.state.getitemData.map(item => ( */}

                           <div className="swiper-slide" data-val="1">
                           {/* <Link to={`${config.baseUrl}`} style={{ zIndex: '1' }} >
                              <div className="brand-be">
                                 <img className="logo-c active be_logo" src={config.imageUrl1 + this.state.image_list[0]?.slider2 == undefined || this.state.image_list[0]?.slider2 == 'undefined' || !this.state.image_list[0]?.slider2 ? "/images/logoImage.png" : config.imageUrl1 + localStorage.getItem('image_list')} alt="logo" />

                              </div>
                           </Link> */}
                              {/* <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`}>
                                 <img src={item.image === null || item.image === '' || item.image === undefined
                                    ? 'images/noimage.webp'
                                    :
                                    `${config.imageUrl}${item.image}`} style={{ width: '71px', height: '71px' }} />
                              </Link> */}
                            
                           </div>
                        {/* ))} */}
                     </div>
                     <div className="pagination hidden"></div>
                  </div>
               </div>
               <div className="footer-main">
                  <div className="container custom-container">
                     <div className="row">
                        <div className="col-md-4 col-xl-4">
                        {/* imagelogo */}
                           <div className="footer-block">
                              {/* <img src={config.imageUrl1 + this.state.image_list[0]?.slider2 ? config.imageUrl1 + this.state.image_list[0]?.slider2 : "/images/logoImage.png"} className='logo' /> */}
                              <img src="images/logoImage.png" className='logo' />
                          
                              <p>Now you can buy your favourite products from the brands you love and get complimentary Metaverse NFTs and Crypto Reward.</p>
                              <ul className="soc_buttons">
                                 <li><a target="_blank" href="https://www.facebook.com/Digi-Phy-NFT-100258636005337/"><i className="fa fa-facebook"></i></a></li>
                                 <li><a target="_blank" href="https://twitter.com/DigiPhyNFT"><i className="fa fa-twitter"></i></a></li>
                                 {/* <li><a target="_blank" href="#"><i className="fa fa-google-plus"></i></a></li> */}
                                 {/* <li><a target="_blank" href="#"><i className="fa fa-pinterest-p"></i></a></li> */}
                                 <li><a target="_blank" href="https://www.instagram.com/DigiPhyNFT/"><i className="fa fa-instagram"></i></a></li>
                                 <li><a target="_blank" href="https://discord.gg/GuymFFY2NF"><img style={{ height: '15px', marginTop: '8px' }} src="images/discord.webp" /></a></li>
                                 <li><a target="_blank" href="https://www.linkedin.com/company/DigiPhyNFT"><i className="fa fa-linkedin"></i></a></li>
                                 <li><a target="_blank" href="https://www.reddit.com/r/DigiPhyNFT/"><i className="fa fa-reddit"></i></a></li>

                              </ul>
                           </div>
                        </div>
                        <div className="col-md-3 col-xl-2">
                           <div className="footer-block">
                              <h1 className="footer-title">Quick Links</h1>
                              <div className="row footer-list-footer">
                                 <div className="col-md-6">
                                    <ul className="link-list">
                                       {/* <li><a target="_blank" href="#about-us.html">Sell your Work</a></li> */}
                                       {/* <li><Link to={`${config.baseUrl}aboutus`} target="_blank" >About us</Link></li> */}

                                       <li><Link target="_blank" to={`${config.baseUrl}`}>Home</Link></li>
                                       <li><Link to={`${config.baseUrl}aboutus`} target="_blank" >About us</Link></li>
                                       <li><Link to={`${config.baseUrl}marketplace`} target="_blank" >Marketplace</Link></li>
                                       <li> <Link onClick={this.loginClick.bind(this)}>Mint an item</Link></li>
                                       {/* <li><Link target="_blank" >Profile</Link></li> */}
                                       {/* <li><Link target="_blank" >Account</Link></li> */}
                                       <li><Link target="_blank" to={`${config.baseUrl}faq`}>FAQ</Link></li>
                                       <li><Link target="_blank" to={`${config.baseUrl}support`}>Contact Us</Link></li>


                                       {/* <li><Link to={`${config.baseUrl}realstatelist`} >Real State</Link></li> */}
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="col-md-3 col-xl-2">
                           <div className="footer-block">
                              <h1 className="footer-title">Support & Help</h1>
                              <div className="row footer-list-footer">
                                 <div className="col-md-6">
                                    <ul className="link-list">
                                       {/* <li><a target="_blank" href="#about-us.html">Sell your Work</a></li> */}
                                       {/* <li><Link to={`${config.baseUrl}aboutus`} target="_blank" >About us</Link></li> */}

                                       {/* <li><Link to={`${config.baseUrl}faq`} target="_blank">FAQ</Link></li> */}
                                       {/* <li><Link target="_blank" to={`${config.baseUrl}support`}>Support</Link></li> */}
                                       <li><Link target="_blank" to={`${config.baseUrl}privacypolicy`}>Privacy Policy</Link></li>
                                       <li><Link target="_blank" to={`${config.baseUrl}termscondition`} >Terms & Services</Link></li>
                                       <li><Link target="_blank" to={`${config.baseUrl}product_pricing`} >Product Pricing</Link></li>
                                       <li><Link target="_blank" to={`${config.baseUrl}refund_pricing`} >Refund Policy</Link></li>


                                       {/* <li><Link target="_blank" >Suggestions</Link></li>
                                       <li><Link target="_blank" >Help Center</Link></li> */}
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>


                        <div className="col-md-2 col-xl-2">
                           <div className="footer-block">
                              <h1 className="footer-title">Social Links</h1>
                              <div className="row footer-list-footer">
                                 <div className="col-md-6">
                                    <ul className="link-list">
                                       <li><a target="_blank" href="https://www.instagram.com/DigiPhyNFT/">Instagram</a></li>
                                       <li><a target="_blank" href="https://www.youtube.com/channel/UC878bT4K6sZqjqKarlZa8Qw">Youtube</a></li>
                                       <li><a target="_blank" href="https://twitter.com/DigiPhyNFT">Twitter</a></li>
                                       <li><a target="_blank" href="https://discord.gg/GuymFFY2NF">Discord</a></li>
                                       <li><a target="_blank" href="https://www.facebook.com/Digi-Phy-NFT-100258636005337/">Facebook</a></li>
                                       <li><a target="_blank" href="https://www.linkedin.com/company/DigiPhyNFT">Linkedin</a></li>

                                       <li><a target="_blank" href="https://www.reddit.com/r/DigiPhyNFT/">Reddit</a></li>

                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* 
                        <div className="col-md-4 galerry">
                           <div className="footer-block">
                              <h1 className="footer-title">Recent Works</h1>
                              {this.state.recentworkData.map(item => (

                                 <Link onClick={this.loading.bind(this)} to={`${config.baseUrl}itemdetails/${item.item_edition_id}`}>
                                    <img src={item.image === null || item.image === '' || item.image === undefined
                                       ? 'images/noimage.webp'
                                       :
                                       `${config.imageUrl}${item.image}`} style={{ width: '50px', height: '50px' }} />
                                 </Link>
                              ))}
                           </div>
                        </div> */}


                        {/*   <div className="col-md-3">
                     <div className="footer-block">
                        <h1 className="footer-title">Subscribe On Our News</h1>
                        <form action="./" className="subscribe-form">
                           <input type="text" placeholder="Yout Name" required>
                           <div className="submit-block">
                              <i className="fa fa-envelope-o"></i>
                              <input type="submit" value>
                           </div>
                        </form>
                        <div className="soc-activity">
                           <div className="soc_ico_triangle">
                              <i className="fa fa-twitter"></i>
                           </div>
                           <div className="message-soc">
                              <div className="date">16h ago</div>
                              <a href="##" className="account">@faq</a> vestibulum accumsan est <a href="##" className="heshtag">#malesuada</a> sem auctor, eu aliquet nisi ornare leo sit amet varius egestas.
                           </div>
                        </div>
                     </div>
                     </div>  */}
                     </div>
                  </div>
               </div>
               <div className="footer-bottom">
                  <div className="container-fluid custom-container">
                     <div className="col-md-12 footer-end clearfix">
                        <div className="text-center">
                           <span className="copy">Copyright 2022 <span className="white"><a href="#">DiGiphyNFT Marketplace</a></span></span>
                           {/* <span className="created">Created by <span className="white"><a href="##"> Espsofttech pvt ltd</a></span></span> */}
                        </div>
                        {/*  <div className="right">
                     <a className="btn color-7 size-2 hover-9">About Us</a>
                     <a className="btn color-7 size-2 hover-9">Help</a>
                     <a className="btn color-7 size-2 hover-9">Privacy Policy</a>
                     </div>  */}
                     </div>
                  </div>
               </div>
            </footer>
         </>
      )
   }
}