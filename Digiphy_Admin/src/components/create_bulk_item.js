import React, { Component } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'
import Modal from 'react-awesome-modal';
import config from '../config/config';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie'
import { Player } from 'video-react';
import Leftsidebar from '../directives/leftsidebar';
export default class bulk_item extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            visibleProperties: false,
            name: '',
            titleData: '',
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
            minimum_bid_amount: "",
            unlockable_content: "",
            nft_type: 1,
            hybrid_shipment_address: "",
            hybrid_shipment_city: "",
            hybrid_shipment_zipcode: "",
            hybrid_shipment_country: "",
            metadata: "",
            address: '',
            coinValue: '',
            coinError: "",
            getWalletDetailAPIData:''

        }
        this.loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'))
        console.log(this.loginData);
        this.createCollectionAPI = this.createCollectionAPI.bind(this)
        this.createNftAPI = this.createNftAPI.bind(this)

    }


    componentDidMount() {
        this.getUserCollectionAPI()
        this.getcategoryAPI()
        this.getDigiCoin()
        this.getWalletDetailAPI()
        console.log(this.state.lockStatus)

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
                        coinValue: response.data.maxcoinpercentage
                    })
                }
            })
    }


    handleChange = e => {

        // if (e.target.name == 'titleData') {



        //     this.setState({
        //         'nameError': ""
        //     })
        // }

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

        if (e.target.name == 'coin_percentage') {
            if (parseInt(e.target.value) > parseInt(this.state.coinValue)) {
                this.setState({
                    coinError: 1
                })
                return
            }
            else {
                this.setState({
                    coinError: ''
                })
            }
        }


        this.setState({
            [e.target.name]: e.target.value
        })
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

    //===================================== collection validation  ============================================

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

    //=========================================== collection submit form =======================================

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
            formData.append('website', this.state.website);
            formData.append('facebook', this.state.facebook);
            formData.append('twitter', this.state.twitter);
            formData.append('insta', this.state.insta);
            formData.append('telegram', this.state.telegram);
            formData.append('discord', this.state.discord);
            formData.append('user_id', 1);

            axios.post(`${config.apiUrl}insertUserCollection`, formData)
                .then(result => {
                    if (result.data.success === true) {

                        this.setState({
                            isCollectionModelOpen: 0
                        })

                        toast.success(result.data.msg);
                        this.setState({
                            visible: false
                        });
                        this.getUserCollectionAPI()

                    } else {
                        toast.error(result.data.msg);
                    }
                }).catch(err => {
                    toast.error(err.response.data?.msg,

                    );
                })
        }
    }

    //==========================================  Get user collection  =====================================

    async getUserCollectionAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserCollection`,
            data: { "user_id": 1 }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    collectionData: response.data.response
                })
            }
        })
    }

    //========================================  Get category   ================================================

    async getcategoryAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getcategory`
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    categoryData: response.data.response
                })
            }
        })
    }


    async getWalletDetailAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getSettings`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': this.loginData?.data?.user_email, 'user_id': this.loginData?.data?.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        getWalletDetailAPIData: result.data
                    })
                    console.log('dddddddd',this.state.getWalletDetailAPIData)
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }



    addRow1 = (i) => {
        var rows = this.state.attributes
        rows.push({ 'type': '', 'value': '' })
        this.setState({ attributes: rows })
    }

    spliceRow1 = (i) => {
        const rows = [...this.state.attributes]
        rows.splice(i, 1)
        this.setState({ attributes: rows })
    }

    saveData = () => {
        var op1 = document.getElementsByClassName('type');
        var op1_thumb = document.getElementsByClassName('value');

        var attributes = []
        if (op1.length > 0) {
            for (var i = 0; i < op1.length; i++) {
                if (op1[i].value && op1_thumb[i].value) {
                    attributes[i] = {
                        'type': op1[i].value,
                        'value': op1_thumb[i].value
                    }
                }
            }
        }
        console.log(attributes);

        this.setState({
            propertiesData: attributes
        })
        this.closeModalProperties()
        // formData.append('attributes', JSON.stringify(attributes));
    }


    lockContent(id) {
        if (id == 1) {
            this.setState({
                lockStatus: 1
            })
        }
        if (id == 2) {
            this.setState({
                lockStatus: 2
            })
        }
    }


    nftTypeContent(id) {
        if (id == 1) {
            this.setState({
                nftTypeStatus: 1,
                nft_type: 1
            })
        }
        if (id == 2) {
            this.setState({
                nftTypeStatus: 2,
                nft_type: 2
            })
        }
    }


    nftimageChange = (e) => {
        if (e.target.files[0]) {
            let image_as_base64 = URL.createObjectURL(e.target.files[0])
            let image_as_files = e.target.files[0];

            if (image_as_files.type.indexOf('image') === 0) {
                var file_type = 'image';
            } else {
                var file_type = 'video';
            }

            this.setState({
                image_preview: image_as_base64,
                image_file: image_as_files,
                file_type: file_type,
                image_type: e.target.files[0].type,
                imageError: ""
            })
        }
    }


    sellType(type) {
        this.setState({
            'sell_type': type
        })

    }

    validate = async () => {
        let nameError = ""
        let descError = ""
        let imageError = ""
        let collectionError = ""
        let categoryError = ""
        // let attributeError = ""
        // if (this.state.titleData === '') {

        //     nameError = "Title is required."
        // }



        // if (this.state.description === '') {
        //     descError = "Description is required."
        // }
        // if (this.state.description.length  60) {
        //     descError = "Description characters length should be less than 60."
        // }
        if (this.state.user_collection_id === '0' || this.state.user_collection_id === '') {
            collectionError = "Collection is required."
        }
        if (this.state.item_category_id === '0' || this.state.item_category_id == '') {
            categoryError = "Category is required."
        }
        if (this.state.image_file === '') {
            imageError = "Image is required."
        }

        // var op1 = document.getElementsByClassName('type');
        // var op1_thumb = document.getElementsByClassName('value');

        // if (op1.length >= 1) {
        //     for (var i = 0; i < op1.length; i++) {
        //         console.log(op1[i].value, op1_thumb[i].value)
        //         if (op1[i].value && op1_thumb[i].value) {
        //         }
        //         else {
        //             attributeError = "Attributes is required"
        //         }
        //     }
        // }
        // else {
        //     return false
        // }

        if (nameError || descError || imageError || collectionError || categoryError) {
            window.scrollTo(0, 220)
            this.setState({
                nameError, descError, categoryError, collectionError, imageError
            })
            return false
        }
        return true
    }


    async createNftAPI(e) {
        e.preventDefault();
        this.setState({
            spinLoader: '1'
        })

        let formData = new FormData();
        let formData1 = new FormData();
       
        formData.append('user_id', this.loginData.data.id);
        formData.append('address', this.state.getWalletDetailAPIData?.public_key);
        formData.append('excel_file', this.state.excel_file);
        formData.append('zip_file', this.state.zip_file);
        axios.post(`${config.apiUrl}addBulkNftByAdmin`, formData)
            .then(result => {

                this.setState({
                    spinLoader: '0'
                })

                if (result.data.success === true) {
                    toast.success(result.data.msg);
                    setTimeout(() => {
                        window.location.href = `${config.baseUrl}bulk_item`
                    }, 3000);
                } else {
                    toast.error(result.data.msg);
                    this.setState({
                        spinLoader: '0'
                    })
                }
            }).catch(err => {
                toast.error(err.response.data?.msg,

                );
                this.setState({
                    spinLoader: '0'
                })
            })
        // }
    }
















    zipfileSelect = (e) => {
        this.setState({
            zipError: '',
            zip_file_name: ''
        })

        if (e.target.files[0]) {
            let zip_as_files = e.target.files[0];
            var zipFilename = zip_as_files.name
            var fileExtension = zipFilename.split('.').pop();
            if (fileExtension.toUpperCase() == 'ZIP') {
                this.setState({
                    zip_file_name: zip_as_files.name,
                    zip_file: zip_as_files,
                    file_type: 'zip',
                    image_type: e.target.files[0].type,
                    imageError: ""
                })
                console.log('zip_file',zip_as_files.name)
            } else {
                this.setState({
                    zipError: 'File not supported please select only zip file!!'
                })
            }
        }
    }

    excelfileSelect = (e) => {

        this.setState({
            excel_file_name: '',
            excelError: ''
        })

        if (e.target.files[0]) {
            let excel_as_files = e.target.files[0];
            var docxFilename = excel_as_files.name
            var fileExtension = docxFilename.split('.').pop();
            // console.log("fileExtension", fileExtension);
            if (fileExtension.toUpperCase() == 'XLSX') {
                this.setState({
                    excel_file_name: excel_as_files.name,
                    excel_file: excel_as_files,
                    file_type: 'excel',
                    image_type: e.target.files[0].type,
                })
            } else {
                this.setState({
                    excelError: 'File not supported please select only xlsx file!!'
                })
            }
        }
    }




    async getWalletDetailAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getSettings`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': this.loginData?.data?.user_email, 'user_id': this.loginData?.data?.id }
        })
            .then(result => {
                if (result.data.success === true) {
                    this.setState({
                        getWalletDetailAPIData: result.data
                    })
                }
                else if (result.data.success === false) {
                }
            }).catch(err => {
            });
    }



















    render() {
        return (

            <>


                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">
                    <Toaster />

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
                            <div id="content-block" className='mt-5'>

                                <div className="breadcrumb-wrap bg-f br-3">
                                    <div className="overlay bg-black op-7" />
                                    <div className="container">
                                        <div className="breadcrumb-title">
                                            <h2>Mint An NFT</h2>

                                        </div>
                                    </div>
                                </div>
                                <section className="recent-nfts ptb-60 mt-0 ">
                                    <div className="container-fluid custom-container">

                                        <div className="Toastify" />


                                        <div className="container">
                                            <div className="row">
                                                <div className="col-xs-12 col-md-12 _editor-content_">

                                                    <div className="sec" data-sec="basic-information">
                                                        <div className="">

                                                            <div className="be-large-post-align">
                                                                <div className="row">
                                                                    {/* 

                                                                    <div className="input-col col-xs-12">
                                                                        <div className="form-group focus-2">
                                                                            <div className='row'>
                                                                                <div className='col-sm-6'>
                                                                                    <div className="form-label">Collection</div>

                                                                                </div>
                                                                                <div className='col-sm-6 text-right'>
                                                                                    <button onClick={() => this.openModal()} className='btn-main style1 plusbtn' style={{ marginTop: '-85px' }}>Add&nbsp;&nbsp;<i className='fa fa-plus'></i></button>

                                                                                </div>

                                                                            </div>
                                                                            <select onChange={this.handleChange} className="form-control selectData" value={this.state.user_collection_id} name="user_collection_id">
                                                                                <option className='optCss' value="">Select collection</option>
                                                                                {this.state.collectionData.map((item) => (
                                                                                    <option className='optCss' value={item.id}>{item.name}</option>
                                                                                ))}
                                                                            </select>
                                                                            <span className="error-asterick"> {this.state.collectionError}</span>

                                                                        </div>
                                                                    </div>
                                                                    <div className="input-col col-xs-12 col-sm-12">
                                                                        <div className='form-group'>
                                                                            <div className="form-label">Categories</div>
                                                                            <select onChange={this.handleChange} value={this.state.item_category_id} className="form-control selectData" style={{ background: '#c0c0c04f' }} name="item_category_id">
                                                                                <option value="">Select category</option>
                                                                                {this.state.categoryData.map((item) => (
                                                                                    <option value={item.id}>{item.name}</option>
                                                                                ))}
                                                                            </select>

                                                                            <span className="error-asterick"> {this.state.categoryError}</span>


                                                                        </div>

                                                                    </div>


                                                                    <div className="col-md-6">
                                                                        <div className="form-label">Zip of NFTs</div>
                                                                        <div className="d-create-file">
                                                                            <input type="file" style={{marginTop:'80px',color:'#fff'}} accept=".zip" onChange={this.zipfileSelect.bind(this)} id="upload_file4" name="image" /><br />
                                                                            {this.state.zip_file_name ? this.state.zip_file_name : ''}
                                                                            <span className="error-asterick"> {this.state.zipError}</span>
                                                                        </div>
                                                                    </div> */}
                                                                    <div className="col-md-6">
                                                                        <div className="form-label">Zip of NFTs</div>
                                                                        <div className="d-create-file">
                                                                            <input type="file" style={{marginTop:'80px',color:'#fff'}} accept=".zip" onChange={this.zipfileSelect.bind(this)} id="upload_file4" name="image" /><br />
                                                                            {/* <p style={{color:'#fff'}}>{this.state.zip_file_name ? this.state.zip_file_name : ''}</p> */}
                                                                            <span className="error-asterick"> {this.state.zipError}</span>
                                                                        </div>
                                                                    </div> 

                                                                    <div className="col-md-6">
                                                                        <div className="form-label">Excel(Metadata)</div>
                                                                        <div className="d-create-file">
                                                                            <input type="file" style={{ marginTop: '80px',color:'#fff' }} accept=".xlsx" onChange={this.excelfileSelect.bind(this)} id="upload_file6" name="excel_file" />
                                                                            {/* <span className="error-asterick"> {this.state.excelError}</span> */}
                                                                        </div>
                                                                    </div>


                                                                    <div className='col-xs-12 text-left' style={{ marginTop: '25px' }}>
                                                                        {this.state.spinLoader === '0' ?
                                                                            <button className='btn btn-primary pt-2 pb-2 style1' onClick={this.createNftAPI}>Submit</button> :
                                                                            <button className='btn btn-primary pt-2 pb-2 style1' disabled>Submit&nbsp;<i className="fa fa-spinner fa-spin validat"></i></button>}

                                                                    </div>
                                                                </div>
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
                            <Modal visible={this.state.visible} width="700" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                                <div className='header_modal add_collection'>
                                    <div className='modal-header d-flex'>
                                        <div className='text-left'>
                                            <h5 className='text-white'>Add Collections</h5>

                                        </div>
                                        <div className='text-right'>
                                            <button className='close' onClick={() => this.closeModal()}><span>x</span></button>
                                        </div>
                                    </div>
                                    <div className='modal-body text-left'>
                                        <div className='row '>
                                            <div className='col-sm-4'>
                                                <div className="form-label mb-3">Image</div>

                                                <div
                                                    className=" mb-1  rounded-lg overflow-hidden relative "
                                                >
                                                    {this.state.cl_image_preview === '' ?
                                                        <img style={{ height: "150px" }} className="object-cover" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                                        <img style={{ height: "150px" }} className="object-cover" src={this.state.cl_image_preview} />
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
                                                            <button type="button" className="btn-upload" style={{ zIndex: "-999" }}></button>
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
                                                    className=" mb-1  rounded-lg overflow-hidden relative "
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
                                                            <button type="button" className="btn-upload" style={{ zIndex: "-999" }}></button>
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