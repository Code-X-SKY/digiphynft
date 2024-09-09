import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
export default class admincollection extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            admin_list: [],
            collection_id: '',
            user_name: '',
            collection_name: '',
            email: '',
            description: '',
            nft_hash: '',
            create_date: '',
            follower: '',
            country_name: '',
            user_list: [],
            index: 0,
            visible: false,
            visibleProperties: false,
            name: '',
            description: '',
            user_collection_id: '0',
            item_category_id: '0',
            royaltie: '0',
            methodType: '1',
            sell_type: '1',
            price: '0',
            minimum_bid: '0',
            start_date: '',
            expiry_date: '',
            image_file: '',
            image_preview: '',
            categoryData: [],
            collectionData: [],
            currentDate: '',
            endDate: '',
            spinLoader: '0',
            blockchainType: '1',
            isDialogOpen: false,
            SingleCategoryData: [],
            currentTrxFee: '0.00',
            isCollectionModelOpen: 0,
            quantity: '',
            imageData: "",
            cl_name: '',
            cl_image_file: '',
            cl_image_preview: '',
            cl_banner_preview: '',
            banner_preview: '',
            facebook: "",
            insta: "",
            twitter: "",
            pinterest: "",
            website: "",
            youtube: "",
            discord: "",
            cl_coverPhoto: '',
            cl_description: '',
            telegram: '',
            popupData: false,
            attributes: [{ 'type': '', 'value': '' }],
            propertiesData: [],
            lockStatus: 1,
            nftTypeStatus: 1,
            external_link: "",
            coin_percentage: "",
            unlockable_content: "",
            nft_type: 1,
            hybrid_shipment_address: "",
            hybrid_shipment_city: "",
            hybrid_shipment_zipcode: "",
            hybrid_shipment_country: "",
            metadata: "",
            admincollectionData1: '',
            profile_pic: '',
            banner: ''

        };
        this.loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'));
        this.createCollectionAPI = this.createCollectionAPI.bind(this)
        this.updateCollectionAPI = this.updateCollectionAPI.bind(this)
        //  this.updateTelentForReject = this.updateTelentForReject.bind(this);
        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },
            {
                key: "collection_name",
                text: "name",
                sortable: true,
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <a target="_blank" href={`${config.redirectUrl}collectiondetail/${item.collection_name}`}>{item.collection_name}</a>

                        </td>
                    );
                }
            },
            {
                key: "create_date",
                text: "Create Date",
                sortable: true
            },
            // {
            //     key: "email",
            //     text: "email",
            //     sortable: true
            // },
            // {
            //     key: "description",
            //     text: "description",
            //     sortable: true
            // },
            {
                key: "image",
                text: "image",
                cell: (item) => {
                    return (
                        <>

                            {item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />

                                :
                                <img src={`${config.imageUrl1}${item.profile_pic}`} className="product-img" />}

                        </>
                    );
                }
            },
            {
                key: "image",
                text: "Banner",
                cell: (item) => {
                    return (
                        <>

                            {item.banner === null || item.banner === '' || item.banner === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />

                                :
                                <img src={`${config.imageUrl1}${item.banner}`} className="product-img" />}

                        </>
                    );
                }
            },
            {
                key: "collection_name",
                text: "TRENDING",
                cell: (item) => {
                    return (
                        <>
                            <input type='checkbox' checked={item.is_featured === 0 ? '' : 'checked'} onClick={this.updateItemFeature.bind(this, item.collection_id, item.is_featured)} />
                        </>
                    )
                }
            },
            {
                key: "collection_name",
                text: "SOCIAL LINKS",
                cell: (item) => {
                    return (
                        <>
                            <p className='circle-icon'>{item?.facebook === '' && item?.insta === '' && item?.telegram === '' && item?.twitter === '' && item?.discord === '' ? 'N/A' :

                                item?.facebook ? <a href={item?.facebook} target="_blank"> <i className="fa fa-facebook" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.instagram ? <a href={item?.instagram} target="_blank"> <i className="fa fa-instagram" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.telegram ? <a href={item?.telegram} target="_blank"> <i className="fa fa-telegram" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.twitter ? <a href={item?.twitter} target="_blank"> <i className="fa fa-twitter" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.discord ? <a href={item?.discord} target="_blank">
                                    <span className="discord-imgs"><img style={{ width: '20px' }} src="images/discord.png" /></span></a> : ''}
                            </p>
                        </>
                    );
                }
            },

            {
                key: "id",
                text: "Action",
                cell: (item) => {
                    return (
                        <>
                            <button type="submit" data-toggle="modal" onClick={this.getadmincollection.bind(this, item.collection_id)} data-target="#responsive-modal2" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp;&nbsp;

                            <button type="submit" onClick={this.deleteItem.bind(this, item)} data-toggle="tooltip" data-target="#responsive-modal1" data-original-title="Close" className=" btn-danger"> <i class="fa fa-close m-r-10"></i> </button>


                        </>
                    );
                }
            },
        ];

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




    handleChange = e => {

        if (e.target.name == 'name') {

            e.target.value = e.target.value.replace(/[^A-Za-z0-9]/ig, '')

            this.setState({
                'nameError': ""
            })
        }

        if (e.target.name == 'description') {
            this.setState({
                'descError': ""
            })
        }

        if (e.target.name == 'user_collection_id') {
            this.setState({
                'collectionError': ""
            })
        }

        if (e.target.name == 'item_category_id') {
            this.setState({
                'categoryError': ""
            })
        }

        if (e.target.name == 'start_date') {
            this.setState({
                endDate: e.target.value
            })
        }

        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async admincollectionList() {
        await axios.get(`${config.apiUrl}getadmincollection`, {},)
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

    componentDidMount() {
        if (!Cookies.get('loginSuccessdigiphyNFTAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.admincollectionList();

        this.setState({
            collection_id: this.collection_id
        })

        this.getadmincollection(this.collection_id);
    }

    async getadmincollection(collection_id) {
        await axios({
            method: 'get',
            url: `${config.apiUrl}adminconnectionid/` + collection_id

        })

            .then(response => {
                if (response.data.success === true) {
                    let admincollectionData = response.data.response;
                    // let banner = config.imageUrl1 + admincollectionData.banner;
                    // let profile_pic = config.imageUrl1 + admincollectionData.profile_pic;
                    this.setState({
                        admincollectionData1: response.data.response,
                        name: admincollectionData.name,
                        description: admincollectionData.description,
                        discord: admincollectionData.discord,
                        facebook: admincollectionData.facebook,
                        insta: admincollectionData.insta,
                        telegram: admincollectionData.telegram,
                        twitter: admincollectionData.twitter,
                        website: admincollectionData.website,
                        profile_pic: admincollectionData.profile_pic,
                        banner: admincollectionData.banner,
                        collection_id: admincollectionData.id
                    })

                }
            })
    }



    deleteItem = (id) => {
        // console.log(id.nftCount);
        if (id.nftCount > 0) {
            toast.error("You can't delete collection if any NFT exists in it!!", {
                position: toast.POSITION.TOP_CENTER,

            }, setTimeout(() => {

            }, 500));

        }
        else {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to delete this Collection.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () =>
                            axios({
                                method: 'post',
                                url: `${config.apiUrl}deleteUserCollection`,
                                headers: { "Authorization": this.loginData?.Token },
                                data: { 'email': this.loginData?.data.user_email, collection_id: id.collection_id }
                            })

                                .then(result => {
                                    if (result.data.success === true) {
                                        toast.success(result.data.msg, {
                                            position: toast.POSITION.TOP_CENTER
                                        });
                                        this.componentDidMount()
                                    }

                                }).catch(err => {
                                    toast.error(err.response.data?.msg, {
                                        position: toast.POSITION.TOP_CENTER,

                                    }, setTimeout(() => {

                                    }, 500));
                                })
                    },
                    {
                        label: 'No',
                    }
                ]
            });

        }

    }



    openModal() {
        this.setState({
            visible: true,
            name: '',
            description: '',
            cl_name: '',
            cl_image_file: '',
            cl_image_preview: '',
            cl_banner_preview: '',
            facebook: "",
            insta: "",
            twitter: "",
            pinterest: "",
            website: "",
            youtube: "",
            discord: "",
            cl_coverPhoto: '',
            cl_description: '',
            telegram: '',
        });
    }

    closeModal() {
        this.setState({
            visible: false
        });
    }

    openModalProperties() {
        this.setState({
            visibleProperties: true,
        });
    }

    closeModalProperties() {
        this.setState({
            visibleProperties: false
        });
    }

    collectionValidate = () => {
        let clnameError = ""
        let cldescError = ""
        let imageError = ""
        let coverError = ""

        if (this.state.cl_name === '') {
            clnameError = "Name is required."
        }
        if (this.state.cl_description === '') {
            cldescError = "Description is required."
        }
        if (this.state.cl_image_file === '') {
            imageError = "Image is required."
        }
        if (this.state.cl_coverPhoto === '') {
            coverError = "Cover photo is required."
        }
        if (clnameError || cldescError || imageError || coverError) {
            window.scrollTo(0, 260)
            this.setState({
                clnameError, cldescError, imageError, coverError
            })
            return false
        }
        return true
    }

    openModalProperties() {
        this.setState({
            visibleProperties: true,
        });
    }

    closeModalProperties() {
        this.setState({
            visibleProperties: false
        });
    }
    //====================================== Collection profile pic ==============================================
    profilePicChange = (e) => {
        if (e.target.files[0]) {
            let image_as_base64 = URL.createObjectURL(e.target.files[0])
            let image_as_files = e.target.files[0];
            this.setState({
                cl_image_preview: image_as_base64,
                cl_image_file: image_as_files,
                imageError: ""
            })
        }
    }

    //====================================== Collection banner pic  ==============================================

    bannerPicChange = (e) => {
        if (e.target.files[0]) {
            let image_as_base64 = URL.createObjectURL(e.target.files[0])
            let image_as_files = e.target.files[0];
            this.setState({
                cl_banner_preview: image_as_base64,
                cl_coverPhoto: image_as_files,
                coverError: ""
            })
        }
    }

    createCollectionAPI(e) {
        e.preventDefault();

        const isValid = this.collectionValidate()
        if (!isValid) {
        }
        else {
            let formData = new FormData();
            formData.append('profile_pic', this.state.cl_image_file);
            formData.append('banner', this.state.cl_coverPhoto);
            formData.append('name', this.state.cl_name);
            formData.append('description', this.state.cl_description);
            formData.append('royalty_percent', this.state.royaltie);
            formData.append('website', this.state.website);
            formData.append('facebook', this.state.facebook);
            formData.append('twitter', this.state.twitter);
            formData.append('insta', this.state.insta);
            formData.append('telegram', this.state.telegram);

            formData.append('discord', this.state.discord);
            formData.append('user_id', this.loginData.data?.id);

            axios.post(`${config.apiUrl}insertadminCollection`, formData)
                .then(result => {
                    if (result.data.success === true) {

                        this.setState({
                            isCollectionModelOpen: 0
                        })

                        toast.success(result.data.msg);
                        this.setState({
                            visible: false
                        });
                        window.location.reload();

                    } else {
                        toast.error(result.data.msg);
                    }
                }).catch(err => {
                    // toast.error(err.response.data?.msg,

                    // );
                })
        }
    }
    //====================================== Collection profile pic ==============================================
    adminprofilePicChange = (e) => {
        if (e.target.files[0]) {
            let image_as_base64 = URL.createObjectURL(e.target.files[0])
            let image_as_files = e.target.files[0];
            this.setState({
                image_preview: image_as_base64,
                image_file: image_as_files,
                imageError: ""
            })
        }
    }

    //====================================== Collection banner pic  ==============================================

    adminbannerPicChange = (e) => {
        if (e.target.files[0]) {
            let image_as_base64 = URL.createObjectURL(e.target.files[0])
            let image_as_files = e.target.files[0];
            this.setState({
                banner_preview: image_as_base64,
                coverPhoto: image_as_files,
                coverError: ""
            })
        }
    }


    updateCollectionAPI = async (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('id', this.state.collection_id);
        formData.append('profile_pic', this.state.image_file);
        formData.append('banner', this.state.coverPhoto);
        formData.append('old_profile_pic', this.state.admincollectionData1.profile_pic);
        formData.append('old_banner', this.state.admincollectionData1.banner);
        formData.append('name', this.state.name);
        formData.append('description', this.state.description);
        formData.append('website', this.state.website);
        formData.append('facebook', this.state.facebook);
        formData.append('twitter', this.state.twitter);
        formData.append('insta', this.state.insta);
        formData.append('telegram', this.state.telegram);
        formData.append('discord', this.state.discord);
        const obj = Object.fromEntries(formData);
        console.log(obj);
        axios({
            method: 'post',
            url: `${config.apiUrl}updateadminCollection`,
            data: formData
        }).then(response => {
            if (response.data.success === true) {
                toast.success(response.data.msg, {});
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            else if (response.data.success === false) {
                toast.error(response.data.msg, {});
            }
        })
            .catch(err => {
                toast.error(err?.response?.data?.msg, {

                });
            })
    }



    async updateItemFeature(user_id, featured) {
        axios({
            method: 'post',
            url: `${config.apiUrl}addUserCollectionFeatured`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: user_id, 'is_admin': this.loginData.data.is_admin, is_featured: featured === 0 ? '1' : '0' }
        })
            .then(result => {
                if (result.data.success === true) {
                    if (featured == 0) {
                        toast.success('Add In Trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (featured == 1) {
                        toast.error('Remove From Trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    this.componentDidMount();
                }
            }).catch(err => {
                toast.error(err.response.data?.msg, {
                    position: toast.POSITION.TOP_CENTER, autoClose: 1500
                }, setTimeout(() => {
                }, 500));
            })
    }



    render() {

        return (

            <>

                <ToastContainer />
                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">

                    {/* <!-- Top Menu Items --> */}
                    <Header />
                    {/* <!-- /Top Menu Items --> */}

                    {/* <!-- Left Sidebar Menu --> */}
                    <Leftsidebar />
                    {/* <!-- /Left Sidebar Menu --> */}

                    {/* <!-- Right Sidebar Menu --> */}
                    <div className="fixed-sidebar-right">
                        <ul className="right-sidebar">
                            <li>
                                <div className="tab-struct custom-tab-1">
                                    <ul role="tablist" className="nav nav-tabs" id="right_sidebar_tab">
                                        <li className="active" role="presentation"><a aria-expanded="true" data-toggle="tab" role="tab" id="chat_tab_btn" href="#chat_tab">chat</a></li>
                                        <li role="presentation" className=""><a data-toggle="tab" id="messages_tab_btn" role="tab" href="#messages_tab" aria-expanded="false">messages</a></li>
                                        <li role="presentation" className=""><a data-toggle="tab" id="todo_tab_btn" role="tab" href="#todo_tab" aria-expanded="false">todo</a></li>
                                    </ul>

                                    <div className="tab-content" id="right_sidebar_content">
                                        <div id="chat_tab" className="tab-pane fade active in" role="tabpanel">
                                            <div className="chat-cmplt-wrap">
                                                <div className="chat-box-wrap">
                                                    <div className="add-friend">
                                                        <a href="javascript:void(0)" className="inline-block txt-grey">
                                                            <i className="zmdi zmdi-more"></i>
                                                        </a>
                                                        <span className="inline-block txt-dark">users</span>
                                                        <a href="javascript:void(0)" className="inline-block text-right txt-grey"><i className="zmdi zmdi-plus"></i></a>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                    <form role="search" className="chat-search pl-15 pr-15 pb-15">
                                                        <div className="input-group">
                                                            <input type="text" id="example-input1-group2" name="example-input1-group2" className="form-control" placeholder="Search" />
                                                            <span className="input-group-btn">
                                                                <button type="button" className="btn  btn-default"><i className="zmdi zmdi-search"></i></button>
                                                            </span>
                                                        </div>

                                                    </form>
                                                    <div id="chat_list_scroll">
                                                        <div className="nicescroll-bar">
                                                            <ul className="chat-list-wrap">
                                                                <li className="chat-list">
                                                                    <div className="chat-body">
                                                                        <a href="javascript:void(0)">
                                                                            <div className="chat-data">
                                                                                <img className="user-img img-circle" src="img/user.png" alt="user" />
                                                                                <div className="user-data">
                                                                                    <span className="name block capitalize-font">Clay Masse</span>
                                                                                    <span className="time block truncate txt-grey">No one saves us but ourselves.</span>
                                                                                </div>
                                                                                <div className="status away"></div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </a>
                                                                        <a href="javascript:void(0)">
                                                                            <div className="chat-data">
                                                                                <img className="user-img img-circle" src="img/user1.png" alt="user" />
                                                                                <div className="user-data">
                                                                                    <span className="name block capitalize-font">Evie Ono</span>
                                                                                    <span className="time block truncate txt-grey">Unity is strength</span>
                                                                                </div>
                                                                                <div className="status offline"></div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </a>
                                                                        <a href="javascript:void(0)">
                                                                            <div className="chat-data">
                                                                                <img className="user-img img-circle" src="img/user2.png" alt="user" />
                                                                                <div className="user-data">
                                                                                    <span className="name block capitalize-font">Madalyn Rascon</span>
                                                                                    <span className="time block truncate txt-grey">Respect yourself if you would have others respect you.</span>
                                                                                </div>
                                                                                <div className="status online"></div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </a>
                                                                        <a href="javascript:void(0)">
                                                                            <div className="chat-data">
                                                                                <img className="user-img img-circle" src="img/user3.png" alt="user" />
                                                                                <div className="user-data">
                                                                                    <span className="name block capitalize-font">Mitsuko Heid</span>
                                                                                    <span className="time block truncate txt-grey">I’m thankful.</span>
                                                                                </div>
                                                                                <div className="status online"></div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </a>
                                                                        <a href="javascript:void(0)">
                                                                            <div className="chat-data">
                                                                                <img className="user-img img-circle" src="img/user.png" alt="user" />
                                                                                <div className="user-data">
                                                                                    <span className="name block capitalize-font">Ezequiel Merideth</span>
                                                                                    <span className="time block truncate txt-grey">Patience is bitter.</span>
                                                                                </div>
                                                                                <div className="status offline"></div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </a>
                                                                        <a href="javascript:void(0)">
                                                                            <div className="chat-data">
                                                                                <img className="user-img img-circle" src="img/user1.png" alt="user" />
                                                                                <div className="user-data">
                                                                                    <span className="name block capitalize-font">Jonnie Metoyer</span>
                                                                                    <span className="time block truncate txt-grey">Genius is eternal patience.</span>
                                                                                </div>
                                                                                <div className="status online"></div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </a>
                                                                        <a href="javascript:void(0)">
                                                                            <div className="chat-data">
                                                                                <img className="user-img img-circle" src="img/user2.png" alt="user" />
                                                                                <div className="user-data">
                                                                                    <span className="name block capitalize-font">Angelic Lauver</span>
                                                                                    <span className="time block truncate txt-grey">Every burden is a blessing.</span>
                                                                                </div>
                                                                                <div className="status away"></div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </a>
                                                                        <a href="javascript:void(0)">
                                                                            <div className="chat-data">
                                                                                <img className="user-img img-circle" src="img/user3.png" alt="user" />
                                                                                <div className="user-data">
                                                                                    <span className="name block capitalize-font">Priscila Shy</span>
                                                                                    <span className="time block truncate txt-grey">Wise to resolve, and patient to perform.</span>
                                                                                </div>
                                                                                <div className="status online"></div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </a>
                                                                        <a href="javascript:void(0)">
                                                                            <div className="chat-data">
                                                                                <img className="user-img img-circle" src="img/user4.png" alt="user" />
                                                                                <div className="user-data">
                                                                                    <span className="name block capitalize-font">Linda Stack</span>
                                                                                    <span className="time block truncate txt-grey">Our patience will achieve more than our force.</span>
                                                                                </div>
                                                                                <div className="status away"></div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="recent-chat-box-wrap">
                                                    <div className="recent-chat-wrap">
                                                        <div className="panel-heading ma-0">
                                                            <div className="goto-back">
                                                                <a id="goto_back" href="javascript:void(0)" className="inline-block txt-grey">
                                                                    <i className="zmdi zmdi-chevron-left"></i>
                                                                </a>
                                                                <span className="inline-block txt-dark">ryan</span>
                                                                <a href="javascript:void(0)" className="inline-block text-right txt-grey"><i className="zmdi zmdi-more"></i></a>
                                                                <div className="clearfix"></div>
                                                            </div>
                                                        </div>
                                                        <div className="panel-wrapper collapse in">
                                                            <div className="panel-body pa-0">
                                                                <div className="chat-content">
                                                                    <ul className="nicescroll-bar pt-20">
                                                                        <li className="friend">
                                                                            <div className="friend-msg-wrap">
                                                                                <img className="user-img img-circle block pull-left" src="img/user.png" alt="user" />
                                                                                <div className="msg pull-left">
                                                                                    <p>Hello Jason, how are you, it's been a long time since we last met?</p>
                                                                                    <div className="msg-per-detail text-right">
                                                                                        <span className="msg-time txt-grey">2:30 PM</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </li>
                                                                        <li className="self mb-10">
                                                                            <div className="self-msg-wrap">
                                                                                <div className="msg block pull-right"> Oh, hi Sarah I'm have got a new job now and is going great.
                                                                                    <div className="msg-per-detail text-right">
                                                                                        <span className="msg-time txt-grey">2:31 pm</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </li>
                                                                        <li className="self">
                                                                            <div className="self-msg-wrap">
                                                                                <div className="msg block pull-right">  How about you?
                                                                                    <div className="msg-per-detail text-right">
                                                                                        <span className="msg-time txt-grey">2:31 pm</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </li>
                                                                        <li className="friend">
                                                                            <div className="friend-msg-wrap">
                                                                                <img className="user-img img-circle block pull-left" src="img/user.png" alt="user" />
                                                                                <div className="msg pull-left">
                                                                                    <p>Not too bad.</p>
                                                                                    <div className="msg-per-detail  text-right">
                                                                                        <span className="msg-time txt-grey">2:35 pm</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="input-group">
                                                                    <input type="text" id="input_msg_send" name="send-msg" className="input-msg-send form-control" placeholder="Type something" />
                                                                    <div className="input-group-btn emojis">
                                                                        <div className="dropup">
                                                                            <button type="button" className="btn  btn-default  dropdown-toggle" data-toggle="dropdown" ><i className="zmdi zmdi-mood"></i></button>
                                                                            <ul className="dropdown-menu dropdown-menu-right">
                                                                                <li><a href="javascript:void(0)">Action</a></li>
                                                                                <li><a href="javascript:void(0)">Another action</a></li>
                                                                                <li className="divider"></li>
                                                                                <li><a href="javascript:void(0)">Separated link</a></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <div className="input-group-btn attachment">
                                                                        <div className="fileupload btn  btn-default"><i className="zmdi zmdi-attachment-alt"></i>
                                                                            <input type="file" className="upload" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="messages_tab" className="tab-pane fade" role="tabpanel">
                                            <div className="message-box-wrap">
                                                <div className="msg-search">
                                                    <a href="javascript:void(0)" className="inline-block txt-grey">
                                                        <i className="zmdi zmdi-more"></i>
                                                    </a>
                                                    <span className="inline-block txt-dark">messages</span>
                                                    <a href="javascript:void(0)" className="inline-block text-right txt-grey"><i className="zmdi zmdi-search"></i></a>
                                                    <div className="clearfix"></div>
                                                </div>
                                                <div className="set-height-wrap">
                                                    <div className="streamline message-box nicescroll-bar">
                                                        <a href="javascript:void(0)">
                                                            <div className="sl-item unread-message">
                                                                <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                    <img className="img-responsive img-circle" src="img/user.png" alt="avatar" />
                                                                </div>
                                                                <div className="sl-content">
                                                                    <span className="inline-block capitalize-font   pull-left message-per">Clay Masse</span>
                                                                    <span className="inline-block font-11  pull-right message-time">12:28 AM</span>
                                                                    <div className="clearfix"></div>
                                                                    <span className=" truncate message-subject">Themeforest message sent via your envato market profile</span>
                                                                    <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsu messm quia dolor sit amet, consectetur, adipisci velit</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="javascript:void(0)">
                                                            <div className="sl-item">
                                                                <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                    <img className="img-responsive img-circle" src="img/user1.png" alt="avatar" />
                                                                </div>
                                                                <div className="sl-content">
                                                                    <span className="inline-block capitalize-font   pull-left message-per">Evie Ono</span>
                                                                    <span className="inline-block font-11  pull-right message-time">1 Feb</span>
                                                                    <div className="clearfix"></div>
                                                                    <span className=" truncate message-subject">Pogody theme support</span>
                                                                    <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="javascript:void(0)">
                                                            <div className="sl-item">
                                                                <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                    <img className="img-responsive img-circle" src="img/user2.png" alt="avatar" />
                                                                </div>
                                                                <div className="sl-content">
                                                                    <span className="inline-block capitalize-font   pull-left message-per">Madalyn Rascon</span>
                                                                    <span className="inline-block font-11  pull-right message-time">31 Jan</span>
                                                                    <div className="clearfix"></div>
                                                                    <span className=" truncate message-subject">Congratulations from design nominees</span>
                                                                    <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="javascript:void(0)">
                                                            <div className="sl-item unread-message">
                                                                <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                    <img className="img-responsive img-circle" src="img/user3.png" alt="avatar" />
                                                                </div>
                                                                <div className="sl-content">
                                                                    <span className="inline-block capitalize-font   pull-left message-per">Ezequiel Merideth</span>
                                                                    <span className="inline-block font-11  pull-right message-time">29 Jan</span>
                                                                    <div className="clearfix"></div>
                                                                    <span className=" truncate message-subject">Themeforest item support message</span>
                                                                    <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="javascript:void(0)">
                                                            <div className="sl-item unread-message">
                                                                <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                    <img className="img-responsive img-circle" src="img/user4.png" alt="avatar" />
                                                                </div>
                                                                <div className="sl-content">
                                                                    <span className="inline-block capitalize-font   pull-left message-per">Jonnie Metoyer</span>
                                                                    <span className="inline-block font-11  pull-right message-time">27 Jan</span>
                                                                    <div className="clearfix"></div>
                                                                    <span className=" truncate message-subject">Help with beavis contact form</span>
                                                                    <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="javascript:void(0)">
                                                            <div className="sl-item">
                                                                <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                    <img className="img-responsive img-circle" src="img/user.png" alt="avatar" />
                                                                </div>
                                                                <div className="sl-content">
                                                                    <span className="inline-block capitalize-font   pull-left message-per">Priscila Shy</span>
                                                                    <span className="inline-block font-11  pull-right message-time">19 Jan</span>
                                                                    <div className="clearfix"></div>
                                                                    <span className=" truncate message-subject">Your uploaded theme is been selected</span>
                                                                    <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a href="javascript:void(0)">
                                                            <div className="sl-item">
                                                                <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                    <img className="img-responsive img-circle" src="img/user1.png" alt="avatar" />
                                                                </div>
                                                                <div className="sl-content">
                                                                    <span className="inline-block capitalize-font   pull-left message-per">Linda Stack</span>
                                                                    <span className="inline-block font-11  pull-right message-time">13 Jan</span>
                                                                    <div className="clearfix"></div>
                                                                    <span className=" truncate message-subject"> A new rating has been received</span>
                                                                    <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="todo_tab" className="tab-pane fade" role="tabpanel">
                                            <div className="todo-box-wrap">
                                                <div className="add-todo">
                                                    <a href="javascript:void(0)" className="inline-block txt-grey">
                                                        <i className="zmdi zmdi-more"></i>
                                                    </a>
                                                    <span className="inline-block txt-dark">todo list</span>
                                                    <a href="javascript:void(0)" className="inline-block text-right txt-grey"><i className="zmdi zmdi-plus"></i></a>
                                                    <div className="clearfix"></div>
                                                </div>
                                                <div className="set-height-wrap">
                                                    {/* <!-- Todo-List --> */}
                                                    <ul className="todo-list nicescroll-bar">
                                                        <li className="todo-item">
                                                            <div className="checkbox checkbox-default">
                                                                <input type="checkbox" id="checkbox01" />
                                                                <label for="checkbox01">Record The First Episode</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <hr className="light-grey-hr" />
                                                        </li>
                                                        <li className="todo-item">
                                                            <div className="checkbox checkbox-pink">
                                                                <input type="checkbox" id="checkbox02" />
                                                                <label for="checkbox02">Prepare The Conference Schedule</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <hr className="light-grey-hr" />
                                                        </li>
                                                        <li className="todo-item">
                                                            <div className="checkbox checkbox-warning">
                                                                <input type="checkbox" id="checkbox03" checked />
                                                                <label for="checkbox03">Decide The Live Discussion Time</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <hr className="light-grey-hr" />
                                                        </li>
                                                        <li className="todo-item">
                                                            <div className="checkbox checkbox-success">
                                                                <input type="checkbox" id="checkbox04" checked />
                                                                <label for="checkbox04">Prepare For The Next Project</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <hr className="light-grey-hr" />
                                                        </li>
                                                        <li className="todo-item">
                                                            <div className="checkbox checkbox-danger">
                                                                <input type="checkbox" id="checkbox05" checked />
                                                                <label for="checkbox05">Finish Up AngularJs Tutorial</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <hr className="light-grey-hr" />
                                                        </li>
                                                        <li className="todo-item">
                                                            <div className="checkbox checkbox-purple">
                                                                <input type="checkbox" id="checkbox06" checked />
                                                                <label for="checkbox06">Finish DigiPhyNFT Project</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <hr className="light-grey-hr" />
                                                        </li>
                                                    </ul>
                                                    {/* <!-- /Todo-List --> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* <!-- /Right Sidebar Menu --> */}

                    {/* <!-- Right Setting Menu --> */}
                    <div className="setting-panel">
                        <ul className="right-sidebar nicescroll-bar pa-0">
                            <li className="layout-switcher-wrap">
                                <ul>
                                    <li>
                                        <span className="layout-title">Scrollable header</span>
                                        <span className="layout-switcher">
                                            <input type="checkbox" id="switch_3" className="js-switch" data-color="#2ecd99" data-secondary-color="#dedede" data-size="small" />
                                        </span>
                                        <h6 className="mt-30 mb-15">Theme colors</h6>
                                        <ul className="theme-option-wrap">
                                            <li id="theme-1" className="active-theme"><i className="zmdi zmdi-check"></i></li>
                                            <li id="theme-2"><i className="zmdi zmdi-check"></i></li>
                                            <li id="theme-3"><i className="zmdi zmdi-check"></i></li>
                                            <li id="theme-4"><i className="zmdi zmdi-check"></i></li>
                                            <li id="theme-5"><i className="zmdi zmdi-check"></i></li>
                                            <li id="theme-6"><i className="zmdi zmdi-check"></i></li>
                                        </ul>
                                        <h6 className="mt-30 mb-15">Primary colors</h6>
                                        <div className="radio mb-5">
                                            <input type="radio" name="radio-primary-color" id="pimary-color-green" checked value="pimary-color-green" />
                                            <label for="pimary-color-green"> Green </label>
                                        </div>
                                        <div className="radio mb-5">
                                            <input type="radio" name="radio-primary-color" id="pimary-color-red" value="pimary-color-red" />
                                            <label for="pimary-color-red"> Red </label>
                                        </div>
                                        <div className="radio mb-5">
                                            <input type="radio" name="radio-primary-color" id="pimary-color-blue" value="pimary-color-blue" />
                                            <label for="pimary-color-blue"> Blue </label>
                                        </div>
                                        <div className="radio mb-5">
                                            <input type="radio" name="radio-primary-color" id="pimary-color-yellow" value="pimary-color-yellow" />
                                            <label for="pimary-color-yellow"> Yellow </label>
                                        </div>
                                        <div className="radio mb-5">
                                            <input type="radio" name="radio-primary-color" id="pimary-color-pink" value="pimary-color-pink" />
                                            <label for="pimary-color-pink"> Pink </label>
                                        </div>
                                        <div className="radio mb-5">
                                            <input type="radio" name="radio-primary-color" id="pimary-color-orange" value="pimary-color-orange" />
                                            <label for="pimary-color-orange"> Orange </label>
                                        </div>
                                        <div className="radio mb-5">
                                            <input type="radio" name="radio-primary-color" id="pimary-color-gold" value="pimary-color-gold" />
                                            <label for="pimary-color-gold"> Gold </label>
                                        </div>
                                        <div className="radio mb-35">
                                            <input type="radio" name="radio-primary-color" id="pimary-color-silver" value="pimary-color-silver" />
                                            <label for="pimary-color-silver"> Silver </label>
                                        </div>
                                        <button id="reset_setting" className="btn  btn-success btn-xs btn-outline btn-rounded mb-10">reset</button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    {/* <button id="setting_panel_btn" className="btn btn-success btn-circle setting-panel-btn shadow-2dp"><i className="zmdi zmdi-settings"></i></button> */}
                    {/* <!-- /Right Setting Menu --> */}

                    {/* <!-- Right Sidebar Backdrop --> */}
                    <div className="right-sidebar-backdrop"></div>
                    {/* <!-- /Right Sidebar Backdrop --> */}

                    {/* <!-- Main Content --> */}
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="">Admin Collection</h5>
                                </div>
                                {/* <div className='col-sm-9 text-right'>
                                    <button onClick={() => this.openModal()} className='btn-main style1 plusbtn'>Add&nbsp;&nbsp;<i className='fa fa-plus'></i></button>
                                </div> */}
                                <Modal visible={this.state.visible} width="700" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                                    <div className='header_modal add_collection'>
                                        <div className='modal-header '>
                                            <div className='d-flex' style={{ justifyContent: "space-between" }}>
                                                <h5 className='text-white'>Add Collections</h5>
                                                <button className='close mt-4' onClick={() => this.closeModal()}><span>x</span></button>
                                            </div>
                                        </div>
                                        <div className='modal-body text-left'>
                                            <div className='row '>
                                                <div className='col-sm-4'>
                                                    <div className="form-label mb-3">Image</div>

                                                    <div
                                                        className=" mb-1  rounded-lg overflow-hidden relative profile-images"
                                                    >
                                                        {this.state.cl_image_preview === '' ?
                                                            <img style={{ height: 150 }} className="object-cover w-full h-32 h-33" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                                            <img style={{ height: 150 }} className="object-cover w-full h-32 h-33" src={this.state.cl_image_preview} />
                                                        }

                                                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full cursor-pointer flex items-center justify-center">

                                                            {this.state.cl_image_preview === '' ?
                                                                <button type="button" className="btn-upload">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="icon icon-tabler icon-tabler-camera"
                                                                        width={24}
                                                                        height={24}
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={2}
                                                                        stroke="currentColor"
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <rect x={0} y={0} width={24} height={24} stroke="none" />
                                                                        <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                                                        <circle cx={12} cy={13} r={3} />
                                                                    </svg>
                                                                </button>
                                                                :
                                                                <button type="button" className="btn-upload" style={{ zIndex: "-999" }}>

                                                                </button>
                                                            }
                                                        </div>
                                                        <input
                                                            name="cl_profile_pic"
                                                            id="fileInput"
                                                            accept="image/*"
                                                            className=""
                                                            type="file"
                                                            onChange={this.profilePicChange.bind(this)}
                                                        />
                                                    </div>
                                                    <span className="error-asterick"> {this.state.imageError}</span>


                                                </div>
                                                <div className='col-sm-8'>
                                                    <div className="form-label mb-3">Cover Photo</div>


                                                    <div
                                                        className=" mb-1  rounded-lg overflow-hidden relative profile-images"
                                                    >


                                                        {this.state.cl_banner_preview === '' ?
                                                            <img style={{ height: 150 }} className="object-cover w-full h-32" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                                            <img style={{ height: 150 }} className="object-cover w-full h-32" src={this.state.cl_banner_preview} />
                                                        }
                                                        <div className="absolute top-0 left-0 right-0 bottom-0 w-full cursor-pointer flex items-center justify-center">

                                                            {this.state.cl_banner_preview === '' ?
                                                                <button type="button" className="btn-upload">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="icon icon-tabler icon-tabler-camera"
                                                                        width={24}
                                                                        height={24}
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={2}
                                                                        stroke="currentColor"
                                                                        fill="none"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <rect x={0} y={0} width={24} height={24} stroke="none" />
                                                                        <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                                                        <circle cx={12} cy={13} r={3} />
                                                                    </svg>
                                                                </button>
                                                                :
                                                                <button type="button" className="btn-upload" style={{ zIndex: "-999" }}>

                                                                </button>
                                                            }
                                                        </div>
                                                        <input
                                                            name="cl_profile_pic"
                                                            id="fileInput"
                                                            accept="image/*"
                                                            className=""
                                                            type="file"
                                                            onChange={this.bannerPicChange.bind(this)}
                                                        />

                                                    </div>
                                                    <span className="error-asterick"> {this.state.coverError}</span>


                                                </div>
                                                <div className="input-col col-xs-12 col-sm-12 mt-3">
                                                    <div className="form-group fg_icon focus-2">
                                                        <div className="form-label">Name</div>
                                                        <input className="form-control" type="text" name="cl_name" onChange={this.handleChange} value={this.state.cl_name} placeholder='e.g. CryptoFunk' />
                                                        <span className="error-asterick"> {this.state.clnameError}</span>

                                                    </div>
                                                </div>
                                                <div className="input-col col-xs-12 col-sm-12">
                                                    <div className="form-group fg_icon focus-2">
                                                        <div className="form-label">Description</div>
                                                        <input className="form-control" type="text" name="cl_description" onChange={this.handleChange} value={this.state.cl_description} placeholder='e.g. This is very limited item' />
                                                        <span className="error-asterick"> {this.state.cldescError}</span>

                                                    </div>
                                                </div>
                                                <div className="input-col col-xs-12 col-sm-12">
                                                    <div className="form-group fg_icon focus-2">
                                                        <div className="form-label">Website Link</div>
                                                        <input className="form-control" name="website" onChange={this.handleChange} value={this.state.website} type="text" placeholder='e.g. https://example.com' />
                                                    </div>
                                                </div>
                                                <div className='col-sm-12'>
                                                    <div className='social-icons mt-1'>
                                                        <div className='form-label'>Link social media</div>

                                                        <div
                                                            className="social-input form-group focus-2"
                                                        >
                                                            <div className="s_icon" >
                                                                <i className="fa fa-facebook" />
                                                            </div>
                                                            <div className="s_input" >
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="facebook" onChange={this.handleChange} value={this.state.facebook}
                                                                    placeholder="e.g. https://example.com"

                                                                />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="social-input form-group focus-2"
                                                        >
                                                            <div className="s_icon" >
                                                                <i className="fa fa-twitter" />
                                                            </div>
                                                            <div className="s_input" >
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="twitter" onChange={this.handleChange} value={this.state.twitter}
                                                                    placeholder="e.g. https://example.com"

                                                                />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="social-input form-group focus-2"
                                                        >
                                                            <div className="s_icon" >
                                                                <i className="fa fa-telegram" />
                                                            </div>
                                                            <div className="s_input" >
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="telegram" onChange={this.handleChange} value={this.state.telegram} placeholder="e.g. https://example.com"

                                                                />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="social-input form-group focus-2"
                                                        >
                                                            <div className="s_icon" >
                                                                <i className="fa fa-instagram" />
                                                            </div>
                                                            <div className="s_input" >
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="insta" onChange={this.handleChange} value={this.state.insta}
                                                                    placeholder="e.g. https://example.com"

                                                                />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="social-input form-group focus-2"
                                                        >
                                                            <div className="s_icon" >
                                                                <div className="discord-img" >
                                                                    <img src="images/discord.png" />
                                                                </div>
                                                            </div>
                                                            <div className="s_input" >
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="discord" onChange={this.handleChange} value={this.state.discord} placeholder="e.g. https://example.com"

                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="socail_news mt-4" >
                                                            <button id="submit" className="btn-main pt-2 pb-2" type="submit" onClick={this.createCollectionAPI}  >
                                                                Create Collection
                                                            </button>
                                                        </div>



                                                    </div>

                                                </div>

                                            </div>


                                        </div>

                                    </div>

                                </Modal>

                                {/* <!-- Breadcrumb --> */}
                                {/* <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                                        <ol className="breadcrumb">
                                            <li><a href="index.html">Dashboard</a></li>
                                            <li><a href="#"><span>e-commerce</span></a></li>
                                            <li className="active"><span>add-products</span></li>
                                        </ol>
                                    </div> */}
                                {/* <!-- /Breadcrumb --> */}
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="table-responsive">

                                        {/* <div className="panel panel-default card-view"> */}
                                        {/* <div className="panel-wrapper collapse in">
                                                <div className="panel-body">
                                                <div className="form-wrap">
                                                        <form action="#"> */}
                                        {/* <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>about Category</h6> */}
                                        {/* <hr className="light-grey-hr" />
                                                            <div className="row"> */}
                                        {/* <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Category Name</label>
                                                                        <input type="text" id="firstName" onChange={this.handleChange} name="category_name" className="form-control" placeholder="Category Name"  value={this.state.category_name} />
                                                                    </div>
                                                                </div> */}


                                        {/* <!--/span--> */}

                                        {/* <!-- Row --> */}

                                        {/* <!--/row--> */}


                                        {/* <!--/row--> */}

                                        {/* <div className="form-actions"> */}
                                        {/* <button type="submit" onClick={this.handleSubmit} className="btn btn-success btn-icon left-icon mr-10 pull-left"> <i className="fa fa-check"></i> <span>save</span></button> */}

                                        {/* <button type='button'    data-toggle="modal" data-target="#responsive-modal" className="btn btn-primary">Add Category </button> */}

                                        {/* <div className="clearfix"></div>
                                                            </div>
                                                        </form>
                                                    </div> */}
                                        {/* <div className="form-wrap">
    
                                                    <div class="table-responsive">
                                              <table class="table table-striped mb-0">
                                              <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>First Name</th>
                                                                    <th>Last Name</th>                                                              
                                                                    <th>Email</th>
                                                                    <th>Description</th>
                                                                    <th>Image</th>
                                                                    <th>Country Name</th>
                                                                    <th>City</th>
                                                                    <th>Talent Status</th>
                                                                    <th>Talent Action</th>
                                                                  
                                                                    
                                                                </tr>
                                                            </thead>
                                                <tbody>
                                                {this.state.user_list.map(item=>(
                                                                <tr>
                                                                    <td>{item.user_id}</td>
                                                                    <td>{item.first_name}</td>
                                                                    <td>{item.last_name}</td>
                                                                    <td>{item.email}</td>
                                                                    <td>{item.description}</td>
                                                                    <td ><img src={`${config.imageUrl}${item.nft_hash}`} className="product-img"/></td>
                                                                    <td>{item.country_name}</td>
                                                                    <td>{item.city}</td>
                                                                    <td class="text-nowrap">
                                                                                {item.telent_status === 0 ? <span style={{ color: 'yellow' }}>Pending</span> :
                                                                                    item.telent_status === 1 ? <span style={{ color: 'green' }}>Approve</span> :
                                                                                        <span style={{ color: 'red' }}>Reject</span>}
                                                                                {/* {(item.telent_status===0)? 'Pending' : 'Approved'?'Approved':'Reject'} */}
                                        {/* </td>
                                                                    <td class="text-nowrap">
                                                                            {item.telent_status === 0 ? 
                                                                            <>
                                                                                <button type="submit" className=" btn-danger" onClick={this.updateRejectAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Reject </button>&nbsp;&nbsp;
                                                                                <button type="submit" className=" btn-success" onClick={this.updateApprovedAPI.bind(this, item)} data-toggle="tooltip" data-original-title="Close"> Approve </button> 
                                                                            </>
                                                                                :item.telent_status === 1 ?
                                                                                <button type="submit" className=" btn-danger" onClick={this.updateRejectAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Reject </button>:
                                                                                <button type="submit" className=" btn-success" onClick={this.updateApprovedAPI.bind(this, item)} data-toggle="tooltip" data-original-title="Close">Approve </button>  }
                                                                    </td>
                                                                  
                                                                </tr>
                                                               ))}
                                            
                                                </tbody>
                                                </table>
                                            </div>
    
                                                    </div> 
                                                </div>
                                            </div>*/}
                                        {/* </div> */}
                                        {/* </div> */}
                                        <div id="responsive-modal2" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                            <div class="modal-dialog">
                                                <div class="modal-content header_modal add_collection">

                                                    <div class="modal-body">
                                                        <form>

                                                            <div>


                                                                <div className="form-group mb-0">
                                                                    <label className="control-label mb-10" style={{ color: '#fff' }}>Update Collection</label>
                                                                    <br />
                                                                    <div className='modal-body text-left'>
                                                                        <div className='row '>
                                                                            <div className='col-sm-4'>
                                                                                <div className="form-label mb-3">Image</div>

                                                                                <div
                                                                                    className=" mb-1  rounded-lg overflow-hidden relative profile-images "
                                                                                >
                                                                                    {console.log('12', this.state.image_preview, '123', this.state.profile_pic)}
                                                                                    {this.state.image_preview == '' && this.state.profile_pic == '' ?
                                                                                        <img style={{ height: 150 }} className="object-cover w-full h-32 h-33" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                                                                        this.state.image_preview == '' && this.state.profile_pic != ''
                                                                                            ?
                                                                                            <img style={{ height: 150 }} className="object-cover w-full h-32 h-33" src={config.imageUrl1 + this.state.profile_pic} />
                                                                                            :
                                                                                            <img style={{ height: 150 }} className="object-cover w-full h-32 h-33" src={this.state.image_preview} />
                                                                                    }

                                                                                    <div className="absolute top-0 left-0 right-0 bottom-0 w-full cursor-pointer flex items-center justify-center">

                                                                                        {this.state.image_preview === '' && this.state.profile_pic == '' ?
                                                                                            <button type="button" className="btn-upload">
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    className="icon icon-tabler icon-tabler-camera"
                                                                                                    width={24}
                                                                                                    height={24}
                                                                                                    viewBox="0 0 24 24"
                                                                                                    strokeWidth={2}
                                                                                                    stroke="currentColor"
                                                                                                    fill="none"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                >
                                                                                                    <rect x={0} y={0} width={24} height={24} stroke="none" />
                                                                                                    <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                                                                                    <circle cx={12} cy={13} r={3} />
                                                                                                </svg>
                                                                                            </button>
                                                                                            :
                                                                                            <button type="button" className="btn-upload" style={{ zIndex: "-999" }}>

                                                                                            </button>
                                                                                        }
                                                                                    </div>
                                                                                    <input
                                                                                        name="profile_pic"
                                                                                        id="fileInput"
                                                                                        accept="image/*"
                                                                                        className=""
                                                                                        type="file"
                                                                                        onChange={this.adminprofilePicChange.bind(this)}
                                                                                    />
                                                                                </div>
                                                                                <span className="error-asterick"> {this.state.imageError}</span>


                                                                            </div>
                                                                            <div className='col-sm-8'>
                                                                                <div className="form-label mb-3">Cover Photo</div>


                                                                                <div
                                                                                    className=" mb-1  rounded-lg overflow-hidden relative  profile-images "
                                                                                >


                                                                                    {this.state.banner_preview === '' && this.state.banner == '' ?
                                                                                        <img style={{ height: 150 }} className="object-cover w-full h-32" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" />
                                                                                        : this.state.banner_preview === '' && this.state.banner != '' ? <img style={{ height: 150 }} className="object-cover w-full h-32" src={config.imageUrl1 +this.state.banner} /> :
                                                                                            <img style={{ height: 150 }} className="object-cover w-full h-32" src={this.state.banner_preview} />
                                                                                    }
                                                                                    <div className="absolute top-0 left-0 right-0 bottom-0 w-full cursor-pointer flex items-center justify-center">

                                                                                        {this.state.banner_preview === '' && this.state.banner == '' ?
                                                                                            <button type="button" className="btn-upload">
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    className="icon icon-tabler icon-tabler-camera"
                                                                                                    width={24}
                                                                                                    height={24}
                                                                                                    viewBox="0 0 24 24"
                                                                                                    strokeWidth={2}
                                                                                                    stroke="currentColor"
                                                                                                    fill="none"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                >
                                                                                                    <rect x={0} y={0} width={24} height={24} stroke="none" />
                                                                                                    <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                                                                                    <circle cx={12} cy={13} r={3} />
                                                                                                </svg>
                                                                                            </button>
                                                                                            :
                                                                                            <button type="button" className="btn-upload" style={{ zIndex: "-999" }}>

                                                                                            </button>
                                                                                        }
                                                                                    </div>
                                                                                    <input
                                                                                        name="banner"
                                                                                        id="fileInput"
                                                                                        accept="image/*"
                                                                                        className=""
                                                                                        type="file"
                                                                                        onChange={this.adminbannerPicChange.bind(this)}
                                                                                    />

                                                                                </div>
                                                                                <span className="error-asterick"> {this.state.coverError}</span>


                                                                            </div>
                                                                            <div className="input-col col-xs-12 col-sm-12 mt-3">
                                                                                <div className="form-group fg_icon focus-2">
                                                                                    <div className="form-label">Name</div>
                                                                                    <input className="form-control" type="text" name="name" onChange={this.handleChange} value={this.state.name} placeholder='e.g. CryptoFunk' />
                                                                                    <span className="error-asterick"> {this.state.clnameError}</span>

                                                                                </div>
                                                                            </div>
                                                                            <div className="input-col col-xs-12 col-sm-12">
                                                                                <div className="form-group fg_icon focus-2">
                                                                                    <div className="form-label">Description</div>
                                                                                    <input className="form-control" type="text" name="description" onChange={this.handleChange} value={this.state.description} placeholder='e.g. This is very limited item' />
                                                                                    <span className="error-asterick"> {this.state.cldescError}</span>

                                                                                </div>
                                                                            </div>
                                                                            <div className="input-col col-xs-12 col-sm-12">
                                                                                <div className="form-group fg_icon focus-2">
                                                                                    <div className="form-label">Website Link</div>
                                                                                    <input className="form-control" name="website" onChange={this.handleChange} value={this.state.website} type="text" placeholder='e.g. https://example.com' />
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-sm-12'>
                                                                                <div className='social-icons mt-1'>
                                                                                    <div className='form-label'>Link social media</div>

                                                                                    <div
                                                                                        className="social-input form-group focus-2"
                                                                                    >
                                                                                        <div className="s_icon" >
                                                                                            <i className="fa fa-facebook" />
                                                                                        </div>
                                                                                        <div className="s_input" >
                                                                                            <input
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                name="facebook" onChange={this.handleChange} value={this.state.facebook}
                                                                                                placeholder="e.g. https://example.com"

                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="social-input form-group focus-2"
                                                                                    >
                                                                                        <div className="s_icon" >
                                                                                            <i className="fa fa-twitter" />
                                                                                        </div>
                                                                                        <div className="s_input" >
                                                                                            <input
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                name="twitter" onChange={this.handleChange} value={this.state.twitter}
                                                                                                placeholder="e.g. https://example.com"

                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="social-input form-group focus-2"
                                                                                    >
                                                                                        <div className="s_icon" >
                                                                                            <i className="fa fa-telegram" />
                                                                                        </div>
                                                                                        <div className="s_input" >
                                                                                            <input
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                name="telegram" onChange={this.handleChange} value={this.state.telegram} placeholder="e.g. https://example.com"

                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="social-input form-group focus-2"
                                                                                    >
                                                                                        <div className="s_icon" >
                                                                                            <i className="fa fa-instagram" />
                                                                                        </div>
                                                                                        <div className="s_input" >
                                                                                            <input
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                name="insta" onChange={this.handleChange} value={this.state.insta}
                                                                                                placeholder="e.g. https://example.com"

                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="social-input form-group focus-2"
                                                                                    >
                                                                                        <div className="s_icon" >
                                                                                            <div className="discord-img" >
                                                                                                <img src="images/discord.png" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="s_input" >
                                                                                            <input
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                name="discord" onChange={this.handleChange} value={this.state.discord} placeholder="e.g. https://example.com"

                                                                                            />
                                                                                        </div>
                                                                                    </div>




                                                                                </div>

                                                                            </div>

                                                                        </div>


                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div class="modal-footer pt-0">
                                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                                        <button type='submit' onClick={this.updateCollectionAPI} className="btn btn-primary">Update </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        {/* add_collection start*/}


                                        {/* add_collection end*/}


                                        <ReactDatatable
                                            config={this.config}
                                            records={this.state.user_list}
                                            columns={this.columns}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <!-- /Row --> */}

                        </div>
                        {/* <!-- Footer --> */}
                        <Footer />
                        {/* <!-- /Footer --> */}

                    </div>
                    {/* <!-- /Main Content --> */}

                </div>
            </>


        )

    }
}
