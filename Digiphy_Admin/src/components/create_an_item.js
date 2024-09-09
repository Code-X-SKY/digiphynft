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
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
import Web3 from 'web3';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";
import imageCompression from 'browser-image-compression';

export default class create_an_item extends Component {
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
            spinLoader: false,
            collectionText: false,
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
            getWalletDetailAPIData: '',
            coinValue: '',
            coinError: "",
            productId: '',
            ownerAddress: '',
            ownerAddressError: false,
            collectionLoader: false

        }
        this.loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'))
        console.log(this.loginData);
        this.createCollectionAPI = this.createCollectionAPI.bind(this)
        this.createNftAPI = this.createNftAPI.bind(this)

    }

    /**
    * @property Jodit jodit instance of native Jodit
    */
    jodit;
    setRef = jodit => this.jodit = jodit;

    //  config = {
    //      readonly: false // all options from https://xdsoft.net/jodit/doc/
    //  } 

    config = {
        zIndex: 0,
        readonly: false,
        activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about'],
        toolbarButtonSize: 'middle',
        theme: 'default',
        enableDragAndDropFileToEditor: true,
        saveModeInCookie: false,
        spellcheck: true,
        editorCssClass: false,
        triggerChangeEvent: true,
        minHeight: 320,
        direction: 'ltr',
        language: 'en',
        debugLanguage: false,
        i18n: 'en',
        tabIndex: -1,
        toolbar: true,
        enter: 'P',
        useSplitMode: false,
        colorPickerDefaultTab: 'background',
        // imageDefaultWidth: 100,
        removeButtons: [],
        disablePlugins: ['paste', 'stat'],
        events: {},
        textIcons: false,
        // uploader: {
        //   insertImageAsBase64URI: true
        // },
        placeholder: '',
        showXPathInStatusbar: false
    };

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


    handleImageUpload = async (event) => {
        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile.type); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,

        }
        try {
            if (imageFile.type == 'image/jpeg' || imageFile.type == 'image/jpg' || imageFile.type == 'image/png') {
                const compressedFile = await imageCompression(imageFile, options);
                console.log('compressedFile instanceof Blob', compressedFile); // true
                console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                if (compressedFile) {
                    let image_as_base64 = URL.createObjectURL(compressedFile)
                    let image_as_files = compressedFile;

                    if (image_as_files.type.indexOf('image') === 0) {
                        var file_type = 'image';
                    } else {
                        var file_type = 'video';
                    }

                    this.setState({
                        image_preview: image_as_base64,
                        image_file: image_as_files,
                        file_type: file_type,
                        image_type: compressedFile.type,
                        imageError: ""
                    })
                }
            }
            else {
                if (imageFile) {
                    let image_as_base64 = URL.createObjectURL(imageFile)
                    let image_as_files = imageFile;

                    if (image_as_files.type.indexOf('image') === 0) {
                        var file_type = 'image';
                    } else {
                        var file_type = 'video';
                    }

                    this.setState({
                        image_preview: image_as_base64,
                        image_file: image_as_files,
                        file_type: file_type,
                        image_type: imageFile.type,
                        imageError: ""
                    })
                }
            }






            // await uploadToServer(compressedFile); // write your own logic
        } catch (error) {
            console.log(error);
        }

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
        let clcontractError = ""
        let cl_royaltieError = ""
        if (this.state.cl_name === '') {
            clnameError = "Name is required."
        }
        if (this.state.cl_description === '') {
            cldescError = "Description is required."
        }
        // if (this.state.contractName === '') {
        //     clcontractError = "Contract Name is required."
        // }
        if (this.state.cl_image_file === '') {
            imageError = "Image is required."
        }
        if (this.state.cl_coverPhoto === '') {
            coverError = "Cover photo is required."
        }
        if (this.state.cl_royaltieError === '') {
            cl_royaltieError = "royaltie is required."
        }
        if (clnameError || cldescError || imageError || coverError || cl_royaltieError) {
            window.scrollTo(0, 260)
            this.setState({
                clnameError, cldescError, imageError, coverError, cl_royaltieError
            })
            return false
        }
        return true
    }

    //=========================================== collection submit form =======================================

    createCollectionAPI(e) {
        e.preventDefault();
        console.log('abncsdsds', this.state.ownerAddress)
        const isValid = this.collectionValidate()
        if (!isValid) {
        }
        else {
            if (this.state.ownerAddress) {

                const address = this.state.ownerAddress
                let result = Web3.utils.isAddress(address)
                console.log('abncsdsds', this.state.ownerAddress, result)
                if (result == false) {

                    this.setState({
                        ownerAddressError: true,
                        clnameError: "",
                        cldescError: '',
                        clcontractError: '',
                        imageError: '',
                        coverError: ''
                    })
                    return;
                } else {

                    this.setState({
                        collectionLoader: true
                    })
                    let formData = new FormData();
                    formData.append('profile_pic', this.state.cl_image_file);
                    formData.append('banner', this.state.cl_coverPhoto);
                    formData.append('name', this.state.cl_name);
                    formData.append('description', this.state.cl_description);
                    formData.append('website', this.state.website);
                    formData.append('facebook', this.state.facebook);
                    formData.append('royalty_percent', this.state.royaltie);
                    formData.append('twitter', this.state.twitter);
                    formData.append('insta', this.state.insta);
                    formData.append('telegram', this.state.telegram);
                    formData.append('discord', this.state.discord);
                    formData.append('user_id', this.loginData.data?.id);
                    formData.append('contractName', this.state.cl_name);
                    formData.append('ownerAddress', this.state.ownerAddress == 'null' ? '' : this.state.ownerAddress);


                    axios.post(`${config.apiUrl}insertUserCollection`, formData)
                        .then(result => {
                            if (result.data.success === true) {

                                this.setState({
                                    isCollectionModelOpen: 0
                                })


                                this.setState({
                                    visible: false,
                                    collectionLoader: false
                                });
                                this.getUserCollectionAPI()

                            } else {
                                this.setState({
                                    visible: false,
                                    collectionLoader: false
                                });
                                toast.error(result.data.msg);
                            }
                        }).catch(err => {
                            this.setState({
                                visible: false,
                                collectionLoader: false
                            });
                            toast.error(err.response.data?.msg,


                            );
                        })


                }
            }
            else {


                this.setState({
                    collectionLoader: true
                })
                let formData = new FormData();
                formData.append('profile_pic', this.state.cl_image_file);
                formData.append('banner', this.state.cl_coverPhoto);
                formData.append('name', this.state.cl_name);
                formData.append('description', this.state.cl_description);
                formData.append('website', this.state.website);
                formData.append('facebook', this.state.facebook);
                formData.append('royalty_percent', this.state.royaltie);
                formData.append('twitter', this.state.twitter);
                formData.append('insta', this.state.insta);
                formData.append('telegram', this.state.telegram);
                formData.append('discord', this.state.discord);
                formData.append('user_id', this.loginData.data?.id);
                formData.append('contractName', this.state.cl_name);
                formData.append('ownerAddress', this.state.ownerAddress == 'null' ? '' : this.state.ownerAddress);

                axios.post(`${config.apiUrl}insertUserCollection`, formData)
                    .then(result => {
                        if (result.data.success === true) {

                            this.setState({
                                isCollectionModelOpen: 0
                            })

                            toast.success(result.data.msg);
                            this.setState({
                                visible: false,
                                collectionLoader: false
                            });
                            this.getUserCollectionAPI()

                        } else {
                            this.setState({
                                visible: false,
                                collectionLoader: false
                            });
                            toast.error(result.data.msg);
                        }
                    }).catch(err => {
                        this.setState({
                            visible: false,
                            collectionLoader: false
                        });
                        toast.error(err.response.data?.msg,


                        );
                    })
            }
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
                    collectionData: response.data.response.filter(item => item.blockchainConfirmation == 1)
                })
                if (response.data.response.filter(item => item.blockchainConfirmation == 0).length > 0) {
                    this.setState({
                        spinLoader: true,
                        collectionText: true
                    })
                    setTimeout(() => {
                        toast.success('Collection Created Successfully!!');
                    })
                    setTimeout(() => {
                        this.getUserCollectionAPI()

                    }, 2000);
                } else {
                    this.setState({
                        spinLoader: false,
                        collectionText: false
                    })
                }
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

        const isValid = await this.validate()
        console.log('isValid', isValid);
        if (!isValid) {
            return false
        }
        else {

            this.setState({
                spinLoader: true
            })

            let formData = new FormData();
            let formData1 = new FormData();
            formData1.append('file', this.state.image_file);
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            var resIPF = await axios.post(url,
                formData1,
                {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                        'pinata_api_key': config.pinata_api_key,
                        'pinata_secret_api_key': config.pinata_secret_api_key
                    }
                }
            );


            if (this.state.sell_type == 2) {
                formData.append('price', this.state.minimum_bid_amount);
            } else {
                formData.append('price', this.state.price);
            }
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
            console.log(this.state);
            formData.append('attributes', JSON.stringify(attributes));
            formData.append('image', resIPF.data.IpfsHash);
            // formData.append('image_file_scanner', this.state.image_file_scanner);

            formData.append('name', this.state.titleData);
            formData.append('external_link', this.state.external_link);
            formData.append('unlockable_content', this.state.unlockable_content);
            formData.append('nft_type', this.state.nft_type);
            formData.append('quantity', this.state.quantity);
            formData.append('file_type', this.state.file_type);
            // formData.append('royalty_percent', this.state.royaltie);
            formData.append('metadata', this.state.metadata);
            formData.append('coin_percentage', this.state.coin_percentage);
            formData.append('image_type', this.state.image_type);
            formData.append('description', this.state.description);
            formData.append('start_date', this.state.start_date);
            formData.append('expiry_date', this.state.expiry_date);
            formData.append('item_category_id', this.state.item_category_id);
            formData.append('user_collection_id', this.state.user_collection_id);
            formData.append('sell_type', this.state.sell_type);
            formData.append('user_id', 1);
            formData.append('email', 'admin@DigiPhyNft');
            formData.append('hybrid_shipment_address', this.state.hybrid_shipment_address);
            formData.append('address', this.state.getWalletDetailAPIData?.public_key);
            formData.append('hybrid_shipment_city', this.state.hybrid_shipment_city);
            formData.append('hybrid_shipment_zipcode', this.state.hybrid_shipment_zipcode);
            formData.append('hybrid_shipment_country', this.state.hybrid_shipment_country);

            formData.append('approve_by_admin', 1);
            formData.append('is_on_sale', 1);

            formData.append('productId', this.state.productId);


            axios.post(`${config.apiUrl}addNftByUser`, formData)
                // axios.post(`${config.apiUrl}addNftByUser_mainnet`, formData)
                .then(result => {

                    this.setState({
                        spinLoader: false
                    })

                    if (result.data.success === true) {
                        toast.success(result.data.msg);
                        // setTimeout(() => {
                        //     window.location.href = `${config.baseUrl}product`
                        // }, 3000);
                    } else {
                        toast.error(result.data.msg);
                        this.setState({
                            spinLoader: false
                        })
                    }
                }).catch(err => {
                    toast.error(err.response.data?.msg,

                    );
                    this.setState({
                        spinLoader: false
                    })
                })
        }
    }


    updateContent = (value) => {
        console.log('value', value)
        // this.picValue = value
        this.setState({ cl_description: value })
    }


    // handleImagePreviewScanner = (e) => {
    //     let image_as_base64 = URL.createObjectURL(e.target.files[0])
    //     let image_as_files = e.target.files[0];
    //     // if (image_as_files.type.indexOf('image') === 0) {
    //     //    file_type = 'image';
    //     // } else {
    //     //    file_type = 'video';
    //     // }

    //     this.setState({
    //         image_preview_sacnner: image_as_base64,
    //         image_file_scanner: image_as_files,
    //     })

    // }


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


                    <Dialog
                        title="Warning"
                        icon="warning-sign"
                        style={{
                            color: 'red'
                        }}
                        isOpen={this.state.spinLoader}
                        isCloseButtonShown={false}
                    >
                        <div className="text-center">
                            <BarLoader color="#e84747" height="2" />
                            <br />
                            <h4 style={{ color: '#000' }}>Request under process...</h4>
                            <p style={{ color: 'red' }}>
                                {this.state.collectionText == true ? 'Collection Creation is under process Please Wait...' :
                                    'Please do not refresh page or close tab.'}
                            </p>
                            <div>
                            </div>
                        </div>
                    </Dialog>

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
                                                                <div className="be-change-ava">
                                                                    <div className='row'>
                                                                        <div className='col-sm-12 col-xs-12'>
                                                                            <h5>Upload file</h5>
                                                                        </div>

                                                                        <div className="col-sm-8 col-xs-12 ">
                                                                            <div className='form-label'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. </div>
                                                                            <div className="d-create-file" >
                                                                                {this.state.file_type == 'image' ?
                                                                                    this.state.image_preview === '' ?
                                                                                        ""
                                                                                        :
                                                                                        <img style={{ height: '100%', width: '100%', objectFit: "cover" }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />

                                                                                    :
                                                                                    this.state.file_type == 'video' ?
                                                                                        <Player style={{ height: '50px', width: '50px' }} id="image" className="" src={this.state.image_preview} /> : ""
                                                                                }
                                                                                <input type="button" id="get_file" className="btn-main" defaultValue="Browse" />
                                                                                <input type="file" accept=".png,.jpg,.gif,.webo,.mp4,.jpeg" 
                                                                                onChange={this.handleImageUpload.bind(this)}
                                                                                // onChange={this.nftimageChange.bind(this)} 
                                                                                
                                                                                id="upload_file" name="image" />
                                                                            </div>
                                                                            <span className="error-asterick"> </span>
                                                                            <span className="error-asterick"> {this.state.imageError}</span>
                                                                        </div>
                                                                        {/* <div className='col-sm-12 col-xs-12' style={{ marginTop: '10px' }}>
                                                                            <h5>Upload Scanner file</h5>
                                                                        </div>
                                                                        <div className="col-sm-8 col-xs-12 ">
                                                                            <div className='form-label'>File types supported: JPG, PNG, GIF</div>
                                                                            <div className="d-create-file" >

                                                                                <img style={{ height: '100%', width: '100%', objectFit: "cover" }} id="image" className="object-cover w-full h-32" src={this.state.image_preview_sacnner} />

                                                                                <input type="button" id="get_file" className="btn-main" defaultValue="Browse" />
                                                                                <input type="file" accept=".png,.jpg,.gif" onChange={this.handleImagePreviewScanner} id="upload_file" name="image" />
                                                                            </div>
                                                                           
                                                                        </div> */}

                                                                        <div className="col-sm-8 ">

                                                                        </div>
                                                                    </div>

                                                                    {/* <a className="be-ava-user style-2" href="#">
                                        <img src="images/author-item-1.jpg" alt="" />
                                    </a> */}
                                                                    {/* <a className="btn color-4 size-2 hover-7"></a> */}
                                                                </div>
                                                            </div>
                                                            <div className="be-large-post-align">
                                                                <div className="row">
                                                                    <div className="input-col col-xs-12 col-sm-12">
                                                                        <div className="form-group fg_icon focus-2">
                                                                            <div className="form-label">Title</div>
                                                                            <input className="form-input" style={{ background: '#c0c0c04f' }} name="titleData" onChange={this.handleChange} type="text" placeholder="Taylor" />
                                                                            <span className="error-asterick"> {this.state.nameError}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="input-col col-xs-12 col-sm-12">
                                                                        <div className="form-group fg_icon focus-2">
                                                                            <div className="form-label">External link</div>
                                                                            <input className="form-input" style={{ background: '#c0c0c04f' }} name="external_link" onChange={this.handleChange} type="text" placeholder="https://yoursite.io/item/123" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="input-col col-xs-12 col-sm-12">
                                                                        <div className="form-group focus-2">
                                                                            <div className="form-label">Description</div>
                                                                            <textarea style={{ background: '#c0c0c04f' }} name="description" onChange={this.handleChange} className='form-input' placeholder='Description'></textarea>
                                                                            <span className="error-asterick"> {this.state.descError}</span>

                                                                        </div>
                                                                    </div>

                                                                    <div className="input-col col-xs-12">
                                                                        <div className="form-group focus-2">
                                                                            <div className='row'>
                                                                                <div className='col-sm-6'>
                                                                                    <div className="form-label">Collection</div>

                                                                                </div>
                                                                                <div className='col-sm-6 text-right'>
                                                                                    <button onClick={() => this.openModal()} className='btn-main style1 plusbtn'>Add&nbsp;&nbsp;<i className='fa fa-plus'></i></button>

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

                                                                    <div className='col-xs-12 col-sm-12'>
                                                                        <div className='all-item-list' style={{ borderBottom: "none" }}>

                                                                            <div className='item-contents'>
                                                                                <i class="fa fa-list"></i>
                                                                                <div className='item-content-main'>

                                                                                    <div className='input-label text-white'>
                                                                                        Properties

                                                                                    </div>
                                                                                    <div className='input-header'>
                                                                                        Textual traits that show up as rectangles

                                                                                    </div>
                                                                                </div>


                                                                            </div>

                                                                            <div className='item-side'>
                                                                                <button className='btn btn-outline-primary' onClick={this.openModalProperties.bind(this)}><i className='fa fa-plus'></i></button>

                                                                            </div>

                                                                        </div>
                                                                        <div className='d-flex' style={{ borderBottom: "1px solid rgb(51 51 51)" }}>
                                                                            {this.state.propertiesData.map((item) => (

                                                                                <div class="AssetForm--properties"><a href="javascript:void(0)" style={{ cursor: 'default' }} class="sc-1pie21o-0 elyzfO"><div class="sc-1smi6j9-0 jkThOB item--property"><div class="Property--type">{item.type}</div><div class="Property--value" data-testid="Property--value">{item.value}</div></div></a></div>
                                                                            ))}
                                                                        </div>


                                                                        <div className='all-item-list'>

                                                                            <div className='item-contents'>
                                                                                <img src='images/unlockable.png' />
                                                                                <div className='item-content-main'>

                                                                                    <div className='input-label text-white'>
                                                                                        Unlockable Content

                                                                                    </div>
                                                                                    <div className='input-header'>
                                                                                        Include unlockable content that can only be revealed by the owner of the item.

                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className='item-side'>
                                                                                <div className='item-side'>

                                                                                    <label class="switch">
                                                                                        {this.state.lockStatus == 1 ?
                                                                                            <input type="checkbox" onClick={this.lockContent.bind(this, 2)} /> :
                                                                                            <input type="checkbox" checked onClick={this.lockContent.bind(this, 1)} />

                                                                                        }
                                                                                        <span class="slider round"></span>
                                                                                    </label>

                                                                                </div>

                                                                            </div>

                                                                        </div>
                                                                        <br />
                                                                        {this.state.lockStatus == 1 ? '' :
                                                                            <div className="form-group focus-2">
                                                                                <textarea className='form-input selectData' placeholder='unlockable content' onChange={this.handleChange} name='unlockable_content'></textarea>

                                                                            </div>}
                                                                        <div className='all-item-list'>

                                                                            <div className='item-contents'>
                                                                                <i class="fa fa-image"></i>
                                                                                <div className='item-content-main'>

                                                                                    <div className='input-label text-white'>
                                                                                        Phygital NFT

                                                                                    </div>
                                                                                    <div className='input-header'>
                                                                                        It will be just turned on or off implying if it is a Phygital NFT

                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className='item-side'>
                                                                                <label class="switch">

                                                                                    {this.state.nftTypeStatus == 1 ?
                                                                                        <input type="checkbox" onClick={this.nftTypeContent.bind(this, 2)} /> :
                                                                                        <input type="checkbox" checked onClick={this.nftTypeContent.bind(this, 1)} />

                                                                                    }
                                                                                    <span class="slider round"></span>
                                                                                </label>

                                                                            </div>

                                                                        </div>

                                                                        <br /><br />


                                                                    </div>
                                                                    <div className="input-col col-xs-12 col-sm-12">
                                                                        <div className="form-group fg_icon focus-2">
                                                                            <div className="form-label">Supply</div>
                                                                            {/* <p>The number of items that can be minted. No gas cost to you! </p> */}
                                                                            <input className="form-input" style={{ background: '#c0c0c04f' }} onChange={this.handleChange} onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} name='quantity' type="text" placeholder="1" />
                                                                        </div>
                                                                    </div>

                                                                    {/* <div className="input-col col-xs-12 col-sm-12">
                                                                        <div className="form-group fg_icon focus-2">
                                                                            <div className="form-label">Royalty</div>
                                                                            <p>The number of items that can be minted. No gas cost to you! </p>
                                                                            <input className="form-input" style={{ background: '#c0c0c04f' }} onChange={this.handleChange} type="text" name='royaltie' placeholder="royaltie" />
                                                                        </div>
                                                                    </div> */}
                                                                    <div className="input-col col-xs-12 col-sm-12">
                                                                        <div className="form-group fg_icon focus-2">
                                                                            <div className="form-label">Product Id</div>
                                                                            {/* <p>Freezing your metadata will allow you to permanently lock and store all of this item's content in decentralized file storage. </p> */}
                                                                            <input className="form-input" onChange={this.handleChange} style={{ background: '#c0c0c04f' }} name="productId" type="text" placeholder="Product Id" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="input-col col-xs-12 col-sm-12" style={{ display: 'none' }}>
                                                                        <div className="form-group fg_icon focus-2">
                                                                            <div className="form-label">Freeze metadata</div>
                                                                            {/* <p>Freezing your metadata will allow you to permanently lock and store all of this item's content in decentralized file storage. </p> */}
                                                                            <input className="form-input" style={{ background: '#c0c0c04f' }} readOnly onChange={this.handleChange} name="metadata" type="text" placeholder="To freeze your metadata, you must create your item first." />
                                                                        </div>
                                                                    </div>


                                                                    {/* {this.state.nft_type === 2 ?
                                                                        <>
                                                                            <div className="input-col col-xs-6 col-sm-6">
                                                                                <div className="form-group fg_icon focus-2">
                                                                                    <div className="form-label">Country</div>
                                                                                   
                                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} onChange={this.handleChange} name="hybrid_shipment_country" type="text" placeholder="Country" />
                                                                                </div>
                                                                            </div>

                                                                            <div className="input-col col-xs-6 col-sm-6">
                                                                                <div className="form-group fg_icon focus-2">
                                                                                    <div className="form-label">City</div>
                                                                                   
                                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} onChange={this.handleChange} name="hybrid_shipment_city" type="text" placeholder="City" />
                                                                                </div>
                                                                            </div>

                                                                            <div className="input-col col-xs-6 col-sm-6">
                                                                                <div className="form-group fg_icon focus-2">
                                                                                    <div className="form-label">Zipcode</div>
                                                                                   
                                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} onChange={this.handleChange} name="hybrid_shipment_zipcode" type="text" placeholder="Zipcode" />
                                                                                </div>
                                                                            </div>

                                                                            <div className="input-col col-xs-6 col-sm-6">
                                                                                <div className="form-group fg_icon focus-2">
                                                                                    <div className="form-label">Address</div>
                                                                                   
                                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} onChange={this.handleChange} name="hybrid_shipment_address" type="text" placeholder="Address" />
                                                                                </div>
                                                                            </div></> : ''
                                                                    } */}

                                                                    <div className="col-xs-12 col-sm-12">
                                                                        <div className='sale_methode'>
                                                                            <div className='form-label'>Select sale method</div>
                                                                            {/* <div className="tab-wrapper style-1">
                                                <div className="tab-nav-wrapper">
                                                    <div className="nav-tab  clearfix">
                                                        <div className="nav-tab-item active">

                                                            <span onClick={this.sellType.bind(this, 1)}><i class="fa fa-tag"></i><br /><br />Fixed Price</span>
                                                        </div>
                                                        <div className="nav-tab-item ">

                                                            <span onClick={this.sellType.bind(this, 2)}><i class="fa fa-hourglass-1"></i><br /><br />Time auction</span>
                                                        </div>


                                                    </div>
                                                </div>
                                                <div className="tabs-content clearfix">
                                                    <div className="tab-info active">
                                                        <div className='row'>
                                                            <div className="input-col col-xs-12 col-sm-12 mb-5">
                                                                <div className="form-group fg_icon focus-2">
                                                                    <div className="form-label">Price(INR)</div>
                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} name="price" placeholder="Taylor" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='row'>
                                                            <div className="input-col col-xs-12 col-sm-12 mb-5">
                                                                <div className="form-group fg_icon focus-2">
                                                                    <div className="form-label">Coin Percentege</div>
                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} type="text" name="coin_percentage" onChange={this.handleChange} placeholder="Coin Percentege" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="tab-info">
                                                        <div className='row'>
                                                            <div className="input-col col-xs-12 col-sm-12">
                                                                <div className="form-group fg_icon focus-2">
                                                                    <div className="form-label">Minimum bid(INR)</div>
                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} type="text" name="minimum_bid_amount" onChange={this.handleChange} placeholder="Taylor" />
                                                                </div>
                                                            </div>

                                                            <div className="input-col col-xs-12 col-sm-12">
                                                                <div className="form-group fg_icon focus-2">
                                                                    <div className="form-label">Coin Percentege</div>
                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} name="coin_percentage" onChange={this.handleChange} type="text" placeholder="Coin Percentege" />
                                                                </div>
                                                            </div>

                                                            <div className="input-col col-xs-12 col-sm-6">
                                                                <div className="form-group fg_icon focus-2">
                                                                    <div className="form-label">Starting date</div>
                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} type="date" onChange={this.handleChange} name="start_date" placeholder="Taylor" />
                                                                </div>
                                                            </div>
                                                            <div className="input-col col-xs-12 col-sm-6">
                                                                <div className="form-group fg_icon focus-2">
                                                                    <div className="form-label">Expiration date</div>
                                                                    <input className="form-input"style={{background:'#c0c0c04f'}} type="date" onChange={this.handleChange} min={this.state.endDate} name="expiry_date" placeholder="Taylor" />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="tab-info">

                                                    </div>

                                                </div>
                                            </div> */}

                                                                            <ul class="nav nav-tabs">
                                                                                <li class="active"><a data-toggle="tab" href="#home">
                                                                                    <div className="nav-tab-item active">
                                                                                        <span onClick={this.sellType.bind(this, 1)}><i class="fa fa-tag"></i><br /><br />Fixed Price</span>
                                                                                    </div>
                                                                                </a></li>
                                                                                <li><a data-toggle="tab" href="#menu1"> <div className="nav-tab-item ">
                                                                                    <span onClick={this.sellType.bind(this, 2)}><i class="fa fa-hourglass-1"></i><br /><br />Time auction</span>
                                                                                </div>
                                                                                </a>
                                                                                </li>
                                                                            </ul>

                                                                            <div class="tab-content">
                                                                                <div id="home" class="tab-pane fade in active">
                                                                                    <div className="tab-info active">
                                                                                        <div className='row'>
                                                                                            <div className="input-col col-xs-12 col-sm-12 mb-5">
                                                                                                <div className="form-group fg_icon focus-2">
                                                                                                    <div className="form-label">Price(INR)</div>
                                                                                                    <input className="form-input" style={{ background: '#c0c0c04f' }} type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} name="price" placeholder="Price" />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className='row'>
                                                                                            <div className="input-col col-xs-12 col-sm-12 mb-5">
                                                                                                <div className="form-group fg_icon focus-2">
                                                                                                    <div className="form-label">Coin Percentege</div>
                                                                                                    <input className="form-input" style={{ background: '#c0c0c04f' }} type="text" name="coin_percentage" onKeyPress={(event) => {
                                                                                                        if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                                                            event.preventDefault();
                                                                                                        }
                                                                                                    }} onChange={this.handleChange} placeholder="Coin Percentege" />
                                                                                                    <p style={{ color: 'red', marginTop: '5px' }}>{this.state.coinError == 1 ? `Coin Percentage should not be greater than ${this.state.coinValue}` : ""}</p>

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div id="menu1" class="tab-pane fade">
                                                                                    <div className="tab-info">
                                                                                        <div className='row'>
                                                                                            <div className="input-col col-xs-12 col-sm-12">
                                                                                                <div className="form-group fg_icon focus-2">
                                                                                                    <div className="form-label">Minimum bid(INR)</div>
                                                                                                    <input className="form-input" style={{ background: '#c0c0c04f' }} type="text" name="minimum_bid_amount" onChange={this.handleChange} placeholder="Price" />
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="input-col col-xs-12 col-sm-12">
                                                                                                <div className="form-group fg_icon focus-2">
                                                                                                    <div className="form-label">Coin Percentege</div>
                                                                                                    <input className="form-input" style={{ background: '#c0c0c04f' }} name="coin_percentage"
                                                                                                        onKeyPress={(event) => {
                                                                                                            if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                                                                event.preventDefault();
                                                                                                            }
                                                                                                        }}
                                                                                                        onChange={this.handleChange} type="text" placeholder="Coin Percentege" />
                                                                                                    <p style={{ color: 'red', marginTop: '5px' }}>{this.state.coinError == 1 ? `Coin Percentage should not be greater than ${this.state.coinValue}` : ""}</p>

                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="input-col col-xs-12 col-sm-6">
                                                                                                <div className="form-group fg_icon focus-2">
                                                                                                    <div className="form-label">Starting date</div>
                                                                                                    <input className="form-input" style={{ background: '#c0c0c04f' }} type="date" onChange={this.handleChange} name="start_date" placeholder="Taylor" />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="input-col col-xs-12 col-sm-6">
                                                                                                <div className="form-group fg_icon focus-2">
                                                                                                    <div className="form-label">Expiration date</div>
                                                                                                    <input className="form-input" style={{ background: '#c0c0c04f' }} type="date" onChange={this.handleChange} min={this.state.endDate} name="expiry_date" placeholder="Taylor" />
                                                                                                </div>
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                    {/* <div className="form-group focus-2">
                                            <div className="form-label">Select Sale Methods</div>
                                            <select className=''>
                                                <option>Fixed Price</option>
                                                <option>Timed Auction</option>
                                                <option>Not Sale</option>
                                                
                                            </select>
                                            
                                        </div> */}


                                                                    <div className='col-xs-12 text-left'>
                                                                        {this.state.spinLoader === false ?
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
                                            <button className='close' onClick={() => this.closeModal()}><span style={{ marginLeft: '531px' }}>x</span></button>
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
                                                    <input className="form-control" type="text" name="cl_name" onKeyPress={(event) => { if (/^([^a-z,0-9,A-Z, ,_]*)$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} value={this.state.cl_name} placeholder='e.g. CryptoFunk' />
                                                    <span className="error-asterick"> {this.state.clnameError}</span>

                                                </div>
                                            </div>

                                            <div className="input-col col-xs-12 col-sm-12">
                                                <div className="form-group focus-2">
                                                    <div className="form-label">Description</div>
                                                    {/* <textarea   className='form-input' name="cl_description" onChange={this.handleChange} value={this.state.cl_description} placeholder='e.g. This is very limited item'></textarea> */}
                                                    <JoditEditor
                                                        editorRef={this.setRef}
                                                        value={this.state.cl_description}
                                                        config={this.config}
                                                        onChange={this.updateContent}
                                                    />
                                                    <span className="error-asterick"> {this.state.cldescError}</span>

                                                </div>
                                            </div>



                                            <div className="input-col col-xs-12 col-sm-12">
                                                <div className="form-group fg_icon focus-2">
                                                    <div className="form-label">ContractName <span className='error'>*</span></div>
                                                    <input className="form-control" type="text" value={this.state.cl_name} placeholder='' />
                                                    <span className="error-asterick"> {this.state.clcontractError}</span>

                                                </div>
                                            </div>
                                            <div className="input-col col-xs-12 col-sm-12">
                                                <div className="form-group fg_icon focus-2">
                                                    <div className="form-label">Owner Address</div>
                                                    <input className="form-control" type="text" name="ownerAddress" onChange={this.handleChange} value={this.state.ownerAddress == 'null' ? '' : this.state.ownerAddress} placeholder='' />
                                                    {this.state.ownerAddressError == true ?
                                                        <span className="error-asterick"> Owner Address is not valid</span> : ''}



                                                </div>
                                            </div>

                                            <div className="input-col col-xs-12 col-sm-12">
                                                <div className="form-group fg_icon focus-2">
                                                    <div className="form-label">Royalty</div>
                                                    {/* <p>The number of items that can be minted. No gas cost to you! </p> */}
                                                    <input className="form-input" onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} type="text" name='royaltie' placeholder="" />
                                                    {this.state.cl_royaltieError == true ?
                                                        <span className="error-asterick"> Please Enter collection Royalty </span> : ''}
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
                                                            {this.state.collectionLoader == false ? 'Create Collection' : 'Loading...'}
                                                        </button>
                                                    </div>



                                                </div>

                                            </div>

                                        </div>


                                    </div>

                                </div>

                            </Modal>



                            <Modal visible={this.state.visibleProperties} effect="fadeInUp" onClickAway={() => this.closeModalProperties()}>
                                <div className='header_modal connect_wallet' >
                                    <div className='modal-header text-center'>
                                        <strong>Add Properties</strong>

                                        <button className='close' onClick={() => this.closeModalProperties()}><span>x</span></button>
                                    </div>
                                    <div className='modal-body' style={{ maxHeight: "500px", overflowY: "auto" }}>
                                        <p class="desc">Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.</p>
                                        <br />
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <p>Type</p>
                                            </div>
                                            <div className='col-md-6'>
                                                <p>Name</p>
                                            </div>

                                        </div>
                                        {this.state.attributes.map((r) => (
                                            <div className='row'>
                                                <div className='col-md-6 mb-3'>
                                                    <p className='cross'>
                                                        <span className='' style={{ cursor: 'pointer' }} onClick={() => this.spliceRow1(1)}>x</span><input className='form-control addinput type' placeholder='Character' type='text' name="type[]" id="item_title" /></p>
                                                </div>
                                                <div className='col-md-6 mb-3'>
                                                    <p><input className='form-control addinput value' type='text' placeholder='male' name="value[]" id="item_title" /></p>

                                                </div>

                                            </div>
                                        ))}

                                        <div className=' header-btn ' style={{ margin: "20px 0" }}>
                                            <a href='javascript:void(0)' onClick={() => this.addRow1(1)} className=' addmorebtn' >Add more</a>
                                        </div>
                                        {/* <li className='header-btn'><a className='addmorebtn' href="javascript:void(0);">Save</a></li> */}
                                    </div>
                                    <div className='modal-footer header-btn'>
                                        <a href='javascript:void(0)' className=' addmorebtn' onClick={() => this.saveData()} style={{ width: "100%", textAlign: "center" }}>Save</a>
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