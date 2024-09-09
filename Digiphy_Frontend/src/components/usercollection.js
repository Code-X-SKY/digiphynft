import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Player } from 'video-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';



export default class usercollection extends Component {

    componentDidMount() {

    }


    constructor(props) {
        super(props)
        const { match: { params } } = this.props;
        this.collection_id = params.collection_id
        this.state = {
            collectionDetail: {},
            getWalletData: {},
            myNftData: [],
            collectionData: [],
            isActive: 1
        };
        this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));

    }

    // ==============================   Collections API's Start =================================================

    async getMyNftAPI(id) {
        if (id === 1) {
            this.setState({
                isActive: 1
            })
        }
        else if (id === 2) {
            this.setState({
                isActive: 2
            })
        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}getCollectionById`,
            data: { "collection_id": this.collection_id, "login_user_id": this.loginData.id }
        }).then(response => {

            if (response.data.success === true) {
                this.setState({
                    collectionDetail: response.data.collectionData,
                    myNftData: response.data.itemDetail
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
            toast.error('Please Connect Metamask!!')
        }
    }






    componentDidMount() {

        this.getMyNftAPI()
    }


    render() {
        return (

            <>
                <Header />


                <div id="content-block" className='mt-5'>
                    <section id="profile_banner" aria-label="section" className="text-light" style={{
                        backgroundImage: this.state.collectionDetail.banner === '' || this.state.collectionDetail.banner === null || this.state.collectionDetail.banner === undefined
                            ?
                            "url('images/background/bg-3.jpg')" :
                            `url(${config.imageUrl1}${this.state.collectionDetail.banner})`, backgroundPosition: "center"
                    }} />
                    <section aria-label="section" className="d_coll no-top userprofile-page">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="d_profile" style={{ marginBottom: '0px', backgroundSize: 'cover' }}>
                                        <div className="profile_avatar">
                                            <div className="d_profile_img"><img src={this.state.collectionDetail.collection_profile_pic ?
                                                config.imageUrl1 + this.state.collectionDetail.collection_profile_pic :
                                                "images/default-user-icon.jpg"} alt="" /><i className="fa fa-check" /></div>
                                            <div className="profile_name">
                                                <h4>
                                                    {this.state.collectionDetail && this.state.collectionDetail.collection_name ? this.state.collectionDetail?.collection_name : ''}
                                                    <div className="clearfix" />
                                                    {this.state.collectionDetail?.contractAddress ?
                                                        <>

                                                            <div>
                                                                <span id="wallet" className="" style={{ fontSize: "16px",marginRight:'5px' }}>{this.state.collectionDetail?.contractAddress.toString().substring(0, 4) + '...' + this.state.collectionDetail?.contractAddress.toString().substr(this.state.collectionDetail?.contractAddress.length - 4)}</span>
                                                                <CopyToClipboard text={this.state.collectionDetail?.contractAddress}
                                                                    onCopy={() => this.setState({ copied: true })}>
                                                                     <span className='fa fa-clone blue' style={{ fontSize: "15px", cursor: 'pointer' }}></span>
                                                                </CopyToClipboard>

                                                            </div>
                                                            {this.state.copied ? <h5 style={{ color: 'red' }}>Copied.</h5> : null}
                                                        </>
                                                        :
                                                        ""

                                                    }



                                                    <div className="social-icons collec mt-0" style={{ backgroundSize: 'cover' }}>
                                                        {/* <h5 /> */}

                                                        {!this.state.collectionDetail.facebook ? '' : <a target="_blank" href={this.state.collectionDetail && this.state.collectionDetail.facebook}><i className='fa fa-facebook'></i></a>}
                                                        {!this.state.collectionDetail.twitter ? '' :
                                                            <a target="_blank" href={this.state.collectionDetail && this.state.collectionDetail.twitter}><i class="fa fa-twitter" aria-hidden="true"></i></a>}
                                                        {!this.state.collectionDetail.insta ? '' :
                                                            <a target="_blank" href={this.state.collectionDetail && this.state.collectionDetail.insta}><i class="fa fa-instagram" aria-hidden="true"></i></a>}
                                                        {!this.state.collectionDetail.telegram ? '' :
                                                            <a target="_blank" href={this.state.collectionDetail && this.state.collectionDetail.telegram}><i class="fa fa-telegram" aria-hidden="true"></i></a>}
                                                        {!this.state.collectionDetail.discord ? '' :
                                                            <a target="_blank" href={this.state.collectionDetail && this.state.collectionDetail.discord}><span className='discord-icon'><img src="images/discord2.png" className="social-icons-collection" style={{ marginTop: "12px", width: '33px', padding: '4px' }} /></span></a>}
                                                    </div>

                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="tab-wrapper style-2 mt-5">

                                        <div className="tabs-content clearfix">
                                            <div className="tab-info active">

                                                <div className="row _post-container_" >
                                                    {this.state.myNftData.length === 0 ?
                                                        <div style={{ textAlign: 'center', marginLeft: '44%' }}>
                                                            <img style={{ width: '150px', height: '150px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU' /><br /><br />
                                                            <p><b className='text-white'>No Items To Display</b></p>
                                                        </div>
                                                        : this.state.myNftData.map(item => (
                                                            <div className='col-md-4 col-sm-6 mb-5'>
                                                                <div className="auction-card">
                                                                    <div className="auction-img">
                                                                        <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}${item.category_name}/${item.item_fullname.split(' ').join('-')}/${item.item_edition_id}`}>
                                                                            {item.file_type === 'image' ?
                                                                                !item.image ?
                                                                                    <img style={{
                                                                                        width: '318px',
                                                                                        height: '258px'
                                                                                    }} src="images/collections/coll-item-3.jpg" className="lazy nft__item_preview" alt="" />
                                                                                    :
                                                                                    <img style={{
                                                                                        width: '318px',
                                                                                        height: '258px'
                                                                                    }} className="lazy nft__item_preview" src={`https://ipfs.io/ipfs/` + item.image} alt="" /> :

                                                                                item.file_type === 'video' ?
                                                                                    <Player className="lazy nft__item_preview" src={`${config.imageUrl}${item.image}`} /> :
                                                                                    <img effect="blur" src={`${config.imageUrl}${item.image}`} className="lazy nft__item_preview" alt="omg" />
                                                                            }
                                                                        </Link>
                                                                    </div>
                                                                    <div className="nft__item_info" style={{ backgroundSize: 'cover', marginTop: '10px' }}>
                                                                        <a href={`${config.baseUrl}${item.category_name}/${item.item_fullname.split(' ').join('-')}/${item.item_edition_id}`}>
                                                                            <h4>{item.name}<small className="pull-right text-white">Price</small></h4>
                                                                        </a>
                                                                        <div className="nft__item_price" style={{ backgroundSize: 'cover', marginTop: '10px' }}>
                                                                            <span className='text-white'>{item.sell_type == 1 ? 'Purchase' : 'Auction'}</span>
                                                                            <div className="pull-right text-white" style={{ backgroundSize: 'cover' }}>INR {item.price}</div>
                                                                        </div>


                                                                    </div>

                                                                    <div className="nft__item_info" style={{ backgroundSize: 'cover', marginTop: '10px' }}>

                                                                        <div className="nft__item_price" style={{ backgroundSize: 'cover', marginTop: '10px' }}>
                                                                            <span className='text-white'>Edition</span>
                                                                            <div className="pull-right text-white" style={{ backgroundSize: 'cover' }}>{item.edition_text}</div>
                                                                        </div>


                                                                    </div>
                                                                </div>


                                                            </div>
                                                        ))}

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
    }
}