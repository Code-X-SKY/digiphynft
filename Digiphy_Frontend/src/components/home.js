import { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import 'react-sticky-header/styles.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import config from '../config/config'
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import Countdown, { zeroPad } from 'react-countdown';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
const headers = {
    'Content-Type': 'application/json'
};
const btnFill = {
    background: 'linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7)), url("images/main-bg.jpg")'
    // background:"linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7))", `url("images/main-bg.jpg")`
}
export default class home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tredingNfts: [],
            collections: [],
            recentNfts: [],
            LikeCount: ''
        }
        this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))
        console.log(this.loginData);
    }


    componentDidMount() {
        this.trandingnftsList()
        this.collectionList()
        this.recentnftList()
    }


    //=====================================================  All trending NFTS  ==================================

    async trandingnftsList() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}TrendingNfts`,
            data: {
                "user_id": "0",
                "login_user_id": this.loginData.length == 0 ? '0' : this.loginData.data.id,
                "user_collection_id": "0",
                "is_featured": "1",
                "recent": "0",
                "limit": "0"
            }
        }).then((res) => {
            if (res.data.success === true) {
                // filter(item => item.collection_id != null && item.is_featured == 1)
                this.setState({
                    tredingNfts: res.data.response.filter(item => item.sell_type == 1 || (item.sell_type == 2 && new Date(item.expiry_date) > new Date()))
                })
            }
            else if (res.data.success === false) {
                // filter(item => item.collection_id != null && item.is_featured == 1)
                this.setState({
                    tredingNfts: []
                })
            }
        }).catch((error) => {

        })
    }

    //=================================================  All collection trending =============================

    async collectionList() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getAllUserCollection`,

        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    collections: res.data.response.filter(item => item.is_featured == 1)
                })
            }


        }).catch((error) => {

        })
    }

    //===================================================  All Recent NFTS  ====================================

    async recentnftList() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}recentNfts`,
            data: {
                "login_user_id": this.loginData.length == 0 ? '0' : this.loginData.data.id,
            }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    recentNfts: res.data.response
                })
            }

        }).catch((error) => {

        })
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


    //=======================================  Like/dislike  =====================

    async likeAPI(id) {
        if (this.loginData?.length === 0) {
            window.location.href = `${config.baseUrl}login`
        }
        await axios({
            method: 'post',
            url: `${config.apiUrl}likeItem`,
            data: { "item_edition_id": id.item_edition_id, user_id: this.loginData?.data?.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.getItemLikeCountsAPI(id)
                    this.trandingnftsList()
                    this.recentnftList()
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }


    //=======================================  Like details  =====================

    async getItemLikeCountsAPI(id) {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getItemLikeCount`,
            data: { "item_edition_id": id.item_edition_id, "user_id": this.loginData?.data?.id }
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

                <div id="content-block" className='mt-0'>
                    <section className="hero-wrap style2 bg-f">
                        <img
                            src="images/shape-5.png"
                            alt="Image"
                            className="hero-shape-one bounce"
                        />
                        <img
                            src="images/shape-3.png"
                            alt="Image"
                            className="hero-shape-two rotate"
                        />
                        <img
                            src="images/shape-1.png"
                            alt="Image"
                            className="hero-shape-three moveVertical"
                        />
                        <img
                            src="images/shape-4.png"
                            alt="Image"
                            className="hero-shape-four animationFramesTwo"
                        />
                        <img
                            src="images/shape-8.png"
                            alt="Image"
                            className="hero-shape-six bounce"
                        />
                        <img
                            src="images/hero-shape-10.png"
                            alt="Image"
                            className="hero-shape-seven moveHorizontal"
                        />
                        <img
                            src="images/hero-shape-11.png"
                            alt="Image"
                            className="hero-shape-eight"
                        />
                        <div className="container">
                            <div className="row gx-5 align-items-center">
                                <div className="col-lg-6 col-xs-12">
                                    <div className="hero-img-wrap">
                                        <img src="images/hero-img-5.png" alt="Image" />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-xs-12">
                                    <div
                                        className="hero-content">
                                        <h1

                                            className="aos-init"
                                        >
                                            Buy NFTs From Your Favourite Brands
                                        </h1>
                                        <p

                                            className="aos-init"
                                        >
                                            Now you can buy your favourite products from the brands you love and get complimentary Metaverse NFTs and Crypto Reward.{" "}
                                        </p>
                                        <div
                                            className="hero-btn aos-init"

                                        >
                                            <a href={`${config.baseUrl}marketplace`} target="_blank" className="btn-main style1">
                                                Get Started
                                            </a>
                                            <a href="javascript:void(0)" onClick={this.loginClick.bind(this)} className="btn-main style2">
                                                Create NFT
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="recent-nfts ptb-60 ">
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 col-xs-8">
                                        <h3>
                                            <strong>Trending NFT</strong>
                                        </h3>
                                    </div>
                                    <div className="col-md-6 col-xs-4 text-right">
                                        <div>
                                            <Link to={`${config.baseUrl}marketplace`} style={{ color: "rgb(255, 255, 255)" }}>View all &nbsp;
                                                <i className="fa fa-angle-right" style={{ fontSize: 17 }} />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-xs-12">
                                        <br />
                                        <div className="row _post-container_">
                                            {this.state.tredingNfts.length === 0 ?
                                                <div className='col-sm-12 col-xs-12 mb-5'>
                                                    <p className='text-center text-white'>No Trending NFTS</p>
                                                </div>
                                                :
                                                this.state.tredingNfts.map((item) => (

                                                    <div className='col-md-4 col-sm-6 col-xs-12 mb-5'>
                                                        <div className="auction-card">
                                                            <div className="auction-img">
                                                                <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}${item.category_name}/${item.item_fullname.split(' ').join('-')}/${item.item_edition_id}`}>

                                                                    {item.file_type === 'audio' ?
                                                                        <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                                    }

                                                                    {item.file_type === 'image' ?
                                                                        <img src={`${config.imageUrl1}${item.local_image}`} style={{
                                                                            width: '318px',
                                                                            height: '258px',
                                                                            objectFit: "contain"
                                                                        }} alt="omg" /> :
                                                                        item.file_type === 'video' ?
                                                                            // <Player className="preview_image_data" src={`${config.imageUrl}${item.image}`} />
                                                                            <div onClick={this.targetData.bind(this, item)}>
                                                                                <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                            </div>
                                                                             :
                                                                            <ReactAudioPlayer
                                                                                src={`${config.imageUrl}${item.image}`}

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
                                                                <div className="auction-author-info">
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
                                                                            <span style={{ cursor: 'pointer' }} onClick={this.likeAPI.bind(this, item)}>

                                                                                <i className="fa fa-heart" style={{ color: item.is_liked == 0 ? '#fff' : 'red' }}></i> {item.like_count}</span>
                                                                            {/* <i className="flaticon-heart">
                                                                            {item.like_count}
                                                                            </i> */}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="auction-stock">
                                                                    <p>{item.edition_text} In Stock</p>
                                                                    <h6>INR {item.price} </h6>
                                                                </div>
                                                                <div className="auction-stock">
                                                                    <h3>
                                                                        <Link to={`${config.baseUrl}${item.category_name}/${item.item_fullname.split(' ').join('-')}/${item.item_edition_id}`}>{item.name}</Link>
                                                                    </h3>
                                                                    <p>{item.nft_type == 1 ? 'Digital NFT' : item.nft_type = 2 ? 'Physical NFT' : ''}</p>
                                                                </div>


                                                                <Link to={`${config.baseUrl}${item.category_name}/${item.item_fullname.split(' ').join('-')}/${item.item_edition_id}`}>
                                                                    <button
                                                                        type="button"
                                                                        className="btn style5"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#placeBid"
                                                                    >
                                                                        {item.sell_type === 1 ? 'Purchase' : 'Place Bid'}

                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>


                                                    </div>
                                                ))}

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                    <section className="trending-collection  ptb-100">
                        <img src="images/shape-2.png" alt="Image" class="promo-shape-one" />
                        <img src="images/shape-1.png" alt="Image" class="promo-shape-two" />
                        {/* <img src="images/section-shape-1.png" alt="Image" class="section-shape" /> */}
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 col-xs-8">
                                        <h3>
                                            <strong>Trending Collections</strong>
                                        </h3>
                                    </div>
                                    <div className="col-md-6 col-xs-4 text-right">
                                        <div>
                                            <a href="#" style={{ color: "rgb(255, 255, 255)" }}>View all &nbsp;
                                                <i className="fa fa-angle-right" style={{ fontSize: 17 }} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <br />
                                        <div className="row _post-container_">
                                            {this.state.collections.length === 0 ?
                                                <div className='col-sm-12 mb-5'>
                                                    <p className='text-center text-white'>No Trending Collections</p>
                                                </div>
                                                :
                                                this.state.collections.slice(0, 3).map((item) => (
                                                    <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12  mb-5">
                                                        <div className="auction-list box-hover-effect">
                                                            <div className="auction-img">
                                                                <Link to={`${config.baseUrl}collectiondetail/${item.collection_name}`}>
                                                                    <img src={config.imageUrl1 + item.profile_pic} />
                                                                </Link>
                                                            </div>
                                                            <Link to={`${config.baseUrl}collectiondetail/${item.collection_name}`}>
                                                                <div className="chakra-stack css-1wdu7zf">
                                                                    <div className="d-flex">
                                                                        <div className="seaflightImage">
                                                                            <div
                                                                                aria-label="Sea Flights"
                                                                                role="image"
                                                                                className="sea-img"
                                                                                style={{
                                                                                    backgroundImage:
                                                                                        ` url(${config.imageUrl1 + item.banner})`
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            <div className="bottom">
                                                                <div className="chakra-stack css-1npz8pa">
                                                                    <h3 className="chakra-text css-1yfa4pt mb-2">
                                                                        <Link to={`${config.baseUrl}collectiondetail/${item.collection_name}`}>{item.collection_name}</Link>
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
                                                                <div className="chakra-stack css-198f9j2">
                                                                    <Link to={`${config.baseUrl}userprofile/${item.user_id}`}
                                                                        className="chakra-link chakra-linkbox__overlay css-1me1ekj"

                                                                    >
                                                                        <div className="nftprofile">
                                                                            <div className="nftprodetail">
                                                                                <div className="proimage">
                                                                                    {item.user_profile_pic ?
                                                                                        <img src={config.imageUrl1 + item.user_profile_pic} alt="Image" /> :
                                                                                        <img src="images/noimage.webp" alt="Image" />
                                                                                    }

                                                                                </div>
                                                                            </div>
                                                                            <div className="proheadname">{item.user_name}</div>
                                                                        </div>
                                                                    </Link>
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
                    </section>
                    <section className="recent-nfts ptb-40">
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 col-xs-8">
                                        <h3>
                                            <strong>Recent NFT</strong>
                                        </h3>
                                    </div>
                                    <div className="col-md-6 col-xs-4 text-right">
                                        <div>
                                            <Link to={`${config.baseUrl}marketplace`} style={{ color: "rgb(255, 255, 255)" }}>View all &nbsp;
                                                <i className="fa fa-angle-right" style={{ fontSize: 17 }} />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-12 ">
                                        <br />
                                        <div className="row _post-container_">
                                            {this.state.recentNfts.length === 0 ?
                                                <div className='col-sm-12 mb-5'>
                                                    <p className='text-center text-white'>No Recent NFTS</p>
                                                </div>
                                                :
                                                this.state.recentNfts.slice(0, 6).map((item) => (

                                                    <div className='col-md-4 col-sm-6 col-xs-12 mb-5'>
                                                        <div className="auction-card">
                                                            <div className="auction-img">

                                                                <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}${item.category_name}/${item.item_fullname.split(' ').join('-')}/${item.item_edition_id}`}>

                                                                    {item.file_type === 'audio' ?
                                                                        <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                                    }

                                                                    {item.file_type === 'image' ?
                                                                        <img style={{
                                                                            width: '318px',
                                                                            height: '258px',
                                                                            objectFit: "contain"
                                                                        }} src={`${config.imageUrl1}${item.local_image}`} alt="omg" /> :
                                                                        item.file_type === 'video' ?
                                                                            // <Player className="preview_image_data" src={`${config.imageUrl}${item.image}`} />

                                                                            <div onClick={this.targetData.bind(this, item)}>
                                                                                <img className='' style={{ height: '260px' }} src='images/EyZnrIzW8AMLNSu.jpeg' />
                                                                            </div>

                                                                            :
                                                                            <ReactAudioPlayer
                                                                                src={`${config.imageUrl}${item.image}`}

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
                                                                <div className="auction-author-info">
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
                                                                            <span style={{ cursor: 'pointer' }} onClick={this.likeAPI.bind(this, item)}>

                                                                                <i className="fa fa-heart" style={{ color: item.is_liked == 0 ? '#fff' : 'red' }}></i> {item.like_count}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="auction-stock">
                                                                    <p>{item.edition_text} In Stock</p>
                                                                    <h6>INR {item.price} </h6>
                                                                </div>
                                                                <div className=''>
                                                                    <div className="auction-stock">
                                                                        <h3>
                                                                            <Link to={`${config.baseUrl}${item.category_name}/${item.item_fullname.split(' ').join('-')}/${item.item_edition_id}`}>{item.name}</Link>
                                                                        </h3>
                                                                        <p className='nfttypepara'>{item.nft_type == 1 ? 'Digital NFT' : item.nft_type = 2 ? 'Physical NFT' : ''}</p>
                                                                    </div>





                                                                </div>
                                                                <Link to={`${config.baseUrl}${item.category_name}/${item.item_fullname.split(' ').join('-')}/${item.item_edition_id}`}>
                                                                    <button
                                                                        type="button"
                                                                        className="btn style5"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#placeBid"
                                                                    >
                                                                        {item.sell_type === 1 ? 'Purchase' : 'Place Bid'}

                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>


                                                    </div>
                                                ))}

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                    <section className='how_to_get_started ptb-40'>
                        <div className="rn-service-area">
                            <div className="container-fluid custom-container mb-5">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12 mb-5">
                                            <h3>
                                                <strong>How to get started:</strong>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="row g-5">
                                        {/* start single service */}
                                        <div className="col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-5">
                                            <div
                                                data-sal="slide-up"
                                                data-sal-delay={150}
                                                data-sal-duration={800}
                                                className="rn-service-one color-shape-7 sal-animate"
                                            >
                                                <div className="inner">
                                                    <div className="icon">
                                                        <img src="images/shape-7.webp" alt="Shape" />
                                                    </div>
                                                    <div className="subtitle">Step-01</div>
                                                    <div className="content">
                                                        <h4 className="title">
                                                            <a href="#">Set up your wallet</a>
                                                        </h4>
                                                        <p className="description">
                                                            Powerful features and inclusions, which makes Nuron standout,
                                                            easily customizable and scalable.
                                                        </p>
                                                        <a className="read-more-button" href="#">
                                                            <i className="feather-arrow-right" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <a className="over-link" href="#" />
                                            </div>
                                        </div>
                                        {/* End single service */}
                                        {/* start single service */}
                                        <div className="col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-5">
                                            <div
                                                data-sal="slide-up"
                                                data-sal-delay={200}
                                                data-sal-duration={800}
                                                className="rn-service-one color-shape-1 sal-animate"
                                            >
                                                <div className="inner">
                                                    <div className="icon">
                                                        <img src="images/shape_1.png" alt="Shape" />
                                                    </div>
                                                    <div className="subtitle">Step-02</div>
                                                    <div className="content">
                                                        <h4 className="title">
                                                            <a href="#">Create your collection</a>
                                                        </h4>
                                                        <p className="description">
                                                            A great collection of beautiful website templates for your need.
                                                            Choose the best suitable template.
                                                        </p>
                                                        <a className="read-more-button" href="#">
                                                            <i className="feather-arrow-right" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <a className="over-link" href="#" />
                                            </div>
                                        </div>
                                        {/* End single service */}
                                        {/* start single service */}
                                        <div className="col-xxl-4 col-lg-4 col-md-6 col-sm-6 mb-5">
                                            <div
                                                data-sal="slide-up"
                                                data-sal-delay={250}
                                                data-sal-duration={800}
                                                className="rn-service-one color-shape-5 sal-animate"
                                            >
                                                <div className="inner">
                                                    <div className="icon">
                                                        <img src="images/shape_2.webp" alt="Shape" />
                                                    </div>
                                                    <div className="subtitle">Step-03</div>
                                                    <div className="content">
                                                        <h4 className="title">
                                                            <a href='javascript:void(0)' onClick={this.loginClick.bind(this)}>Add your NFT's</a >
                                                        </h4>
                                                        <p className="description">
                                                            We've made the template fully responsive, so it looks great on
                                                            all devices: desktop, tablets and.
                                                        </p>
                                                        <a className="read-more-button" href="#">
                                                            <i className="feather-arrow-right" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <a className="over-link" href='javascript:void(0)' onClick={this.loginClick.bind(this)} />
                                            </div>
                                        </div>
                                        {/* End single service */}

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