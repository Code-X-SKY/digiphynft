import { Component } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie'
import axios from "axios";
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import Countdown, { zeroPad } from 'react-countdown';
import Loader from "react-loader-spinner";
// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import { Link } from 'react-router-dom'
export default class marketplace extends Component {

    constructor(props) {
        super(props)
        this.state = {
            profileData: '',
            searchData: '',
            allMarketPlaces: [],
            headerShowData: '',
            talentStatusAPIData: '',
            nftIndex: '',
            talentIndex: '',
            defaultImage: 0,
            cmn_toggle_switch: false,
            talentSHowHide: 0,
            loaderImage: 0,
            search: "",
            category_id: "",
            creator: "",
            fromDate: "",
            toDate: "",
            minPrice: "",
            maxPrice: "",
            minEdition: "",
            maxEdition: "",
            isResale: "-1",
            orderBy: "1",
            category_list: [],
            marketPlaces: [],
            marketPlacesBackup: [],
            user_list: [],
            collectionIds: [],

        }
        this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))
        this.onChange = this.onChange.bind(this)
        // this.CollectionHandler = this.CollectionHandler.bind(this)

    }

    componentDidMount() {
        this.marketPlaceList()
        this.getitemAPISport()
        this.categoryList()
        this.userCollectionList()
    }


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        console.log(e.target.name, e.target.value);
        if (e.target.name == 'orderBy') {
            this.getitemAPISport(e.target.value)
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


    async getitemAPISport(id) {

        this.setState({
            loaderImage: 0
        })
        console.log(this.state.creator, id);
        await axios({
            method: 'post',
            url: `${config.apiUrl}listitem`,
            data: {
                "login_user_id": this.loginData.length == 0 ? '0' : this.loginData.data.id,
            }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        allMarketPlaces: result.data.response,
                        loaderImage: 1
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
                this.setState({
                    allMarketPlaces: [],
                    loaderImage: 1
                })
            });
    }


    async marketPlaceList() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}listitem`,
            data: {
                "login_user_id": this.loginData.length == 0 ? '0' : this.loginData.data.id,
            }

        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    marketPlaces: res.data.response,
                    marketPlacesBackup: res.data.response,
                })
            }
            // alert(this.state.marketPlaces)
        }).catch((error) => {

        })
    }


    loading() {
        window.location.reload()
    }


    removeData() {
        // this.setState({
        //     "search": "",
        //     "category_id": "",
        //     "creator": "",
        //     "fromDate": "",
        //     "toDate": "",
        //     "minPrice": "",
        //     "maxPrice": "",
        //     "minEdition": "",
        //     "maxEdition": "",
        //     "isResale": "-1",

        // })
    }

    //===========================================  Category list =========================================

    async categoryList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getcategory`,
                data: {}
            })
                .then(result => {
                    if (result.data.success === true) {
                        this.setState({
                            category_list: result.data.response
                        })
                    }
                    else if (result.data.success === false) {
                    }
                })
                .catch(err => {
                })
    }

    //============================================  Collection list =======================================

    async userCollectionList() {
        await axios.get(`${config.apiUrl}getAllUserCollection`, {},)
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        user_list: result.data.response
                    })
                }
                else if (result.data.success === false) {
                }
            })
            .catch(err => {
            })
    }


    //==========================================  Search Filter  ===========================================

    searchAnything = (e) => {
        const { value } = e.target
        this.setState({ searchAnything: value })
        var regex = new RegExp(value.toUpperCase());
        const matchedData = this.state.allMarketPlaces.filter(item => (item.name == null ? '' : item.name.toUpperCase().match(regex)) || item.description.toUpperCase().match(regex) || (item.collection_name == null ? '' : item.collection_name.toUpperCase().match(regex)));
        if (matchedData.length > 0) {
            this.setState({ marketPlaces: matchedData })
        } else {
            this.setState({ marketPlaces: [] })
        }
    }

    //===================================== sell type filter  ===============================================

    selectTypeHandler = (value) => {
        console.log('value', value);
        if (value == 0) {
            this.componentDidMount()
        }
        const filterItems = this.state.allMarketPlaces.filter(item => item.sell_type == value);

        if (filterItems.length > 0) {
            this.setState({ marketPlaces: filterItems, selectType: value })
        } else {
            this.setState({ marketPlaces: [] })
        }
    }

    //======================================== sort by filter ==========================================

    PriceHeaderFilter = async (e) => {
        this.setState({ marketPlaces: [] })

        if (e.target.value === 'Lowtohigh') {
            var lowtohigh = this.state.marketPlaces.sort((a, b) => (parseFloat(a.price).toFixed(6)) - (parseFloat(b.price).toFixed(6)));
            this.setState({ marketPlaces: lowtohigh })
        } else if (e.target.value === 'Hightolow') {
            var hightolow = this.state.marketPlaces.sort((a, b) => (parseFloat(b.price).toFixed(6)) - (parseFloat(a.price).toFixed(6)));
            this.setState({ marketPlaces: hightolow })
        }
        else if (e.target.value === 'newesttooldest') {
            var newesttooldest = this.state.marketPlaces.sort((a, b) => new Date((b.datetime)) - new Date((a.datetime)));
            this.setState({ marketPlaces: newesttooldest })
        }
        else if (e.target.value === 'oldesttonewest') {
            var oldesttonewest = this.state.marketPlaces.sort((a, b) => new Date((a.datetime)) - new Date((b.datetime)));
            this.setState({ marketPlaces: oldesttonewest })
        }

        else {
            await axios({
                method: 'post',
                url: `${config.apiUrl}listitem`,
                data: {
                    "login_user_id": this.loginData.length == 0 ? '0' : this.loginData.data.id,
                }
            }).then((res) => {
                if (res.data.success === true) {
                    this.setState({
                        marketPlaces: res.data.response,
                        marketPlacesBackup: res.data.response,
                    })
                    console.log(this.state.marketPlacesBackup);
                }

            }).catch((error) => {

            })
        }


    }

    //=====================================  Collection filter ========================================

    CollectionHandler = async (value) => {
        if (value == 0) {
            this.componentDidMount()
        }
        // alert('33')
        const filterItems = this.state.allMarketPlaces.filter(item => item.collection_id == value);
        if (filterItems.length > 0) {
            await this.setState({ marketPlaces: filterItems })
        } else if (filterItems.length == 0) {
            await this.setState({ marketPlaces: [] })
        }
    }

    //=====================================  Category filter ========================================

    CategoryHandler = async (value) => {
        if (value == 0) {
            this.componentDidMount()
        }
        const filterItems = this.state.allMarketPlaces.filter(item => item.item_category_id == value);
        if (filterItems.length > 0) {
            await this.setState({ marketPlaces: filterItems })
        } else if (filterItems.length == 0) {
            await this.setState({ marketPlaces: [] })
        }
    }


    resetFilter() {
        window.location.reload()
    }


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

                    this.componentDidMount()
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

                <div id="content-block" className='mt-0'>

                    <div className="breadcrumb-wrap bg-f br-1">
                        <div className="overlay bg-black op-7" />
                        <div className="container">
                            <div className="breadcrumb-title">
                                <h2>Marketplace</h2>
                                <ul className="breadcrumb-menu list-style">
                                    <li>
                                        <a href="#">Home </a>
                                    </li>
                                    <li>Marketplace</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <section className="recent-nfts ptb-60 ">
                        <div className="container-fluid custom-container">
                            <div className="Toastify" />

                            <div className="container">
                                <div className="row">
                                    <div className='col-md-12'>
                                        <div className="row mb-3" >
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                <div className="search-box">
                                                    <div className="form-group">
                                                        <label class="input-label">Search</label>
                                                        <input type="search" placeholder="Search Items" onChange={e => this.searchAnything(e)} value={this.state.searchAnything} />
                                                        <button type="submit">
                                                            <i className="fa fa-search" />
                                                        </button>
                                                    </div>
                                                </div>


                                            </div>
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                <div className="form-group">
                                                    <label class="input-label">Status</label>

                                                    <select class="" onChange={e => this.selectTypeHandler(e.target.value)}>
                                                        <option value="0">Status</option>
                                                        <option value="1">Buy Now</option>
                                                        <option value="2">Auction</option>
                                                    </select>

                                                </div>


                                            </div>
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                <div className="form-group">
                                                    <label class="input-label">Sort by</label>
                                                    <select class="" onChange={e => this.PriceHeaderFilter(e)}>
                                                        <option value="All">Price</option>
                                                        <option value="Lowtohigh">Price: Low to High</option>
                                                        <option value="Hightolow">Price: High to Low</option>
                                                        <option value="newesttooldest">Newest</option>
                                                        <option value="oldesttonewest">Oldest</option>
                                                    </select>
                                                </div>

                                            </div>
                                            <div
                                                className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12 ">
                                                <div className="form-group">
                                                    <label class="input-label">Collection</label>
                                                    <select class="" onChange={e => this.CollectionHandler(e.target.value)}>
                                                        <option value="0" selected disabled>All</option>
                                                        {this.state.user_list.map((item) => (
                                                            <>
                                                                <option value={item.collection_id}>{item.collection_name}</option>
                                                            </>
                                                        ))}
                                                    </select>

                                                </div>

                                            </div>
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                <div className="form-group">
                                                    <label class="input-label">Category</label>
                                                    <select className="" onChange={e => this.CategoryHandler(e.target.value)}>

                                                        <option value="0" selected disabled>All</option>
                                                        {this.state.category_list.map((item) => (
                                                            <>
                                                                <option value={item.id}>{item.name}</option>
                                                            </>
                                                        ))}

                                                    </select>

                                                </div>

                                            </div>
                                            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-xs-12  ">
                                                <label class="input-label">&nbsp;</label>
                                                <button className='btn-main style1 w-100' onClick={this.resetFilter.bind(this)}>Reset</button>

                                            </div>
                                        </div>


                                    </div>
                                    <div className="col-md-12">
                                        <br />
                                        <div className="row _post-container_">
                                            {console.log(this.state.marketPlaces.length)}

                                            {this.state.marketPlaces.length == 0 ?
                                                <div className='col-sm-12 mb-5'>
                                                    <p className='text-center text-white'>No NFTS Found</p>
                                                </div>
                                                :
                                                this.state.marketPlaces.map((item) => (

                                                    <div className='col-md-4  col-sm-6 col-xs-12 mb-5'>
                                                        <div className="auction-card">
                                                            <div className="auction-img">
                                                                <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}${item.collection_name?.split(' ').join('-')}/${item.name.split(/[\_,#]+/)}/${item.item_edition_id}`}>

                                                                    {item.file_type === 'audio' ?
                                                                        <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                                    }

                                                                    {item.file_type === 'image' ?
                                                                        <img src={`${config.imageUrl1}${item.local_image}`} alt="omg" style={{
                                                                            width: '318px', objectFit: 'contain',
                                                                            height: '258px'
                                                                        }} /> :
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
                                                                                <Link to={`${config.baseUrl}userprofile/${item.owner_id}`}>{item.owner_id == 1 ? 'Admin' : item.owner}</Link>
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
                                                                <div className="auction-stock">
                                                                    <h3>
                                                                        <Link to={`${config.baseUrl}${item.collection_name.split(' ').join('-')}/${item.name.split(' ').join('-')}/${item.item_edition_id}`}>{item.name}</Link>
                                                                    </h3>
                                                                    <p>{item.nft_type == 1 ? 'Digital NFT' : item.nft_type = 2 ? 'Physical NFT' : ''}</p>

                                                                </div>
                                                                <Link to={`${config.baseUrl}${item.collection_name.split(' ').join('-')}/${item.name.split('#').join('-')}/${item.item_edition_id}`}>
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

                </div>



                <Footer />

            </>
        )
    }
}