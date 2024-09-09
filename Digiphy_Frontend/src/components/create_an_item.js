import React, { Component } from 'react';
import Header from '../directives/header'
import Footer from '../directives/footer'
import Modal from 'react-awesome-modal';
import config from '../config/config';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie'
import { Player } from 'video-react';
import Web3 from 'web3';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";
import imageCompression from 'browser-image-compression';

export default class create_an_item extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            visibleForWallet: false,
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
            image_fileCompress: '',
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
            quantity: '1',
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
            contractName: '',
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
            metadata: "",
            address: localStorage.getItem('walletType'),
            ConnectWalletAddress: localStorage.getItem('walletType'),
            coinValue: '',
            coinError: "",
            productId: '',
            // ownerAddress: localStorage.getItem('walletType'),
            ownerAddress: '',
            setCollection: false,
            ownerAddressError: false,

            collectionLoader: false
        }
        this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))
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
        console.log(this.state.lockStatus)

        // setTimeout(() => {
        //     if (window.ethereum) {
        //         const { ethereum } = window;
        //         this.setState({
        //             ConnectWalletAddress: ethereum.selectedAddress
        //         })
        //         localStorage.setItem('walletType', ethereum.selectedAddress)
        //     }
        // }, 100);
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
                        image_fileCompress: image_as_files,
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
                        image_fileCompress: image_as_files,
                    })
                }
            }






            // await uploadToServer(compressedFile); // write your own logic
        } catch (error) {
            console.log(error);
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
                        coinValue: response.data.maxcoinpercentage
                    })
                }
            })
    }

    async connectMetasmask() {
        if (window.ethereum) {
            await window.ethereum.send('eth_requestAccounts');
            window.web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.setState({
                ConnectWalletAddress: accounts,
                address: accounts,
                visibleForWallet: false
            })
            console.log('wwww', this.state.ConnectWalletAddress);
            localStorage.setItem('walletType', this.state.ConnectWalletAddress)
            // setTimeout(() => {
            //     window.location.reload()
            // }, 1000);
        }
        else {
            toast.error(`Please install MetaMask to use this dApp!`, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    handleChange = e => {

        if (e.target.name == 'titleData') {



            this.setState({
                'nameError': ""
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
            contractName: '',
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
        if (clnameError || cldescError || imageError || coverError || clcontractError || cl_royaltieError) {
            window.scrollTo(0, 260)
            this.setState({
                clnameError, cldescError, imageError, coverError, clcontractError, cl_royaltieError
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
            data: { "user_id": this.loginData?.data?.id }
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
                    // setTimeout(() => {
                    //     toast.success('Collection Added Succesfully!!');
                    // }, 2000);

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


    nftimageChange = async(e) => {
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

            const imageFile = e.target.files[0];

            console.log('originalFile instanceof Blob', imageFile.type); // true
            console.log(`originalFile size ${imageFile.size / 1024 / 1024}`);

            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,

            }
            if (imageFile.type == 'image/jpeg' || imageFile.type == 'image/jpg' || imageFile.type == 'image/png') {
                const compressedFile = await imageCompression(imageFile, options);
                console.log('compressedFile instanceof Blob', compressedFile); // true
                console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} `); // smaller than maxSizeMB
                if (compressedFile) {
                    let image_as_base64 = URL.createObjectURL(compressedFile)
                    let image_as_files = compressedFile;

                    if (image_as_files.type.indexOf('image') === 0) {
                        var file_type = 'image';
                    } else {
                        var file_type = 'video';
                    }

                    this.setState({
                        image_fileCompress: image_as_files,
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
                        image_fileCompress: image_as_files,
                    })
                }
            }

            // this.handleImageUpload()
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
        let attributeError = ""
        if (this.state.titleData === '') {

            nameError = "Title is required."
        }



        // if (this.state.description === '') {
        //     descError = "Description is required."
        // }
        // if (this.state.description.length > 60) {
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

        var op1 = document.getElementsByClassName('type');
        var op1_thumb = document.getElementsByClassName('value');

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

        if (nameError || descError || imageError || collectionError || categoryError || attributeError) {
            window.scrollTo(0, 220)
            this.setState({
                nameError, descError, categoryError, collectionError, imageError, attributeError
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
            formData.append('name', this.state.titleData);
            formData.append('external_link', this.state.external_link);
            formData.append('unlockable_content', this.state.unlockable_content);
            formData.append('nft_type', this.state.nft_type);
            formData.append('quantity', this.state.quantity);
            formData.append('file_type', this.state.file_type);
            formData.append('local_image', this.state.image_fileCompress);
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
            formData.append('user_id', this.loginData?.data.id);
            formData.append('email', this.loginData?.data.user_email);
            formData.append('address', localStorage.getItem('walletType'));
            formData.append('approve_by_admin', 1);
            formData.append('is_on_sale', 0);
            formData.append('productId', this.state.productId);
            axios.post(`${config.apiUrl}addNftByUser`, formData)
                // axios.post(`${config.apiUrl}addNftByUser_mainnet`, formData)
                .then(result => {

                    this.setState({
                        spinLoader: false
                    })

                    if (result.data.success === true) {
                        toast.success(result.data.msg);
                        setTimeout(() => {
                            window.location.href = `${config.baseUrl}userprofile/${this.loginData.data.id}`
                        }, 2000);
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

    openModalForWallet() {
        this.setState({
            visibleForWallet: true
        });
    }

    closeModalForWallet() {
        this.setState({
            visibleForWallet: false
        });
    }

    updateContent = (value) => {
        console.log('value', value)
        // this.picValue = value
        this.setState({ cl_description: value })
    }

    render() {
        return (

            <>
                <Header />
                <Toaster />
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
                            {this.state.collectionText == true ? 'Your request for collection creation in under process.. Please wait few minutes sometimes it will take time.This collection will appears in your collections field when the loading finish!!' :
                                'Please do not refresh page or close tab.'}
                        </p>
                        <div>
                        </div>
                    </div>
                </Dialog>

                <div id="content-block" className='mt-5'>

                    <div className="breadcrumb-wrap bg-f br-3">
                        <div className="overlay bg-black op-7" />
                        <div className="container">
                            <div className="breadcrumb-title">
                                <h2>Mint An NFT</h2>
                                <ul className="breadcrumb-menu list-style">
                                    <li>
                                        <a href={`${config.baseUrl}`}>Home </a>
                                    </li>
                                    <li>Mint An NFT</li>
                                </ul>
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
                                                                <div className='form-label'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB </div>
                                                                <div className="d-create-file" >
                                                                    {this.state.file_type == 'image' ?
                                                                        this.state.image_preview === '' ?
                                                                            ""
                                                                            :
                                                                            <img style={{ height: '193px', width: '193px' }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />

                                                                        :
                                                                        this.state.file_type == 'video' ?
                                                                            <Player style={{ height: '50px', width: '50px' }} id="image" className="" src={this.state.image_preview} /> : ""
                                                                    }
                                                                    <input type="button" id="get_file" className="btn-main" defaultValue="Browse" />
                                                                    <input type="file" accept=".png,.jpg,.gif,.webo,.mp4,.jpeg"
                                                                        // onChange={this.handleImageUpload.bind(this)}
                                                                        onChange={this.nftimageChange.bind(this)}

                                                                        id="upload_file" name="image" />
                                                                </div>
                                                                <span className="error-asterick"> </span>
                                                                <span className="error-asterick"> {this.state.imageError}</span>
                                                            </div>
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
                                                                <input className="form-input" name="titleData" onChange={this.handleChange} type="text" placeholder="" />
                                                                <span className="error-asterick"> {this.state.nameError}</span>
                                                            </div>
                                                        </div>

                                                        <div className="input-col col-xs-12 col-sm-12">
                                                            <div className="form-group fg_icon focus-2">
                                                                <div className="form-label">External link</div>
                                                                <input className="form-input" name="external_link" onChange={this.handleChange} type="text" placeholder="https://yoursite.io/item/123" />
                                                            </div>
                                                        </div>
                                                        <div className="input-col col-xs-12 col-sm-12">
                                                            <div className="form-group focus-2">
                                                                <div className="form-label">Description</div>
                                                                <textarea name="description" onChange={this.handleChange} className='form-input' placeholder=''></textarea>
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
                                                                <select onChange={this.handleChange} className="form-control" value={this.state.user_collection_id} name="user_collection_id">
                                                                    <option value="">Select collection</option>
                                                                    {this.state.collectionData.map((item) => (
                                                                        <option value={item.id}>{item.name}</option>
                                                                    ))}
                                                                </select>
                                                                <span className="error-asterick"> {this.state.collectionError}</span>

                                                            </div>
                                                        </div>
                                                        <div className="input-col col-xs-12 col-sm-12">
                                                            <div className='form-group'>
                                                                <div className="form-label">Categories</div>
                                                                <select onChange={this.handleChange} value={this.state.item_category_id} className="form-control" name="item_category_id">
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

                                                                <div className='item-content'>
                                                                    <i class="fa fa-list"></i>
                                                                    <div className='item-content-main'>

                                                                        <div className='input-label'>
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

                                                                <div className='item-content'>
                                                                    <img src='images/unlockable.png' />
                                                                    <div className='item-content-main'>

                                                                        <div className='input-label'>
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
                                                                    <textarea className='form-input' placeholder='unlockable content' onChange={this.handleChange} name='unlockable_content'></textarea>

                                                                </div>}
                                                            <div className='all-item-list'>

                                                                <div className='item-content'>
                                                                    <i class="fa fa-image"></i>
                                                                    <div className='item-content-main'>

                                                                        <div className='input-label'>
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
                                                                <input className="form-input" onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} name='quantity' type="text" placeholder="" />
                                                            </div>
                                                        </div>

                                                        {/* <div className="input-col col-xs-12 col-sm-12">
                                                            <div className="form-group fg_icon focus-2">
                                                                <div className="form-label">Royalty</div>
                                                                <p>The number of items that can be minted. No gas cost to you! </p>
                                                                <input className="form-input" onChange={this.handleChange} type="text" name='royaltie' placeholder="" />
                                                            </div>
                                                        </div> */}

                                                        <div className="input-col col-xs-12 col-sm-12">
                                                            <div className="form-group fg_icon focus-2">
                                                                <div className="form-label">Product Id</div>
                                                                {/* <p>Freezing your metadata will allow you to permanently lock and store all of this item's content in decentralized file storage. </p> */}
                                                                <input className="form-input" onChange={this.handleChange} name="productId" type="text" placeholder="" />
                                                            </div>
                                                        </div>

                                                        <div className="input-col col-xs-12 col-sm-12" style={{ display: 'none' }}>
                                                            <div className="form-group fg_icon focus-2">
                                                                <div className="form-label">Freeze metadata</div>
                                                                {/* <p>Freezing your metadata will allow you to permanently lock and store all of this item's content in decentralized file storage. </p> */}
                                                                <input className="form-input" readOnly onChange={this.handleChange} name="metadata" type="text" placeholder="To freeze your metadata, you must create your item first." />
                                                            </div>
                                                        </div>


                                                        <div className="col-xs-12 col-sm-12">
                                                            <div className='sale_methode'>
                                                                <div className='form-label'>Select sale method</div>
                                                                <div className="tab-wrapper style-1">
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
                                                                                        <div className="form-label">Price(₹)</div>
                                                                                        <input className="form-input" type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} name="price" placeholder="" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className='row'>
                                                                                <div className="input-col col-xs-12 col-sm-12 mb-5">
                                                                                    <div className="form-group fg_icon focus-2">
                                                                                        <div className="form-label">Coin Percentege</div>
                                                                                        <input className="form-input" type="text" onKeyPress={(event) => {
                                                                                            if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                                                event.preventDefault();
                                                                                            }
                                                                                        }} name="coin_percentage" onChange={this.handleChange} placeholder="" />
                                                                                        <p style={{ color: 'red', marginTop: '5px' }}>{this.state.coinError == 1 ? `Coin Percentage should not be greater than ${this.state.coinValue}` : ""}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="tab-info">
                                                                            <div className='row'>
                                                                                <div className="input-col col-xs-12 col-sm-12">
                                                                                    <div className="form-group fg_icon focus-2">
                                                                                        <div className="form-label">Minimum bid(INR)</div>
                                                                                        <input className="form-input" type="text" name="minimum_bid_amount" onChange={this.handleChange} placeholder="" />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="input-col col-xs-12 col-sm-12">
                                                                                    <div className="form-group fg_icon focus-2">
                                                                                        <div className="form-label">Coin Percentege</div>
                                                                                        <input className="form-input" name="coin_percentage"
                                                                                            onKeyPress={(event) => {
                                                                                                if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                                                    event.preventDefault();
                                                                                                }
                                                                                            }}
                                                                                            onChange={this.handleChange} type="text" placeholder="" />
                                                                                        <p style={{ color: 'red', marginTop: '5px' }}>{this.state.coinError == 1 ? `Coin Percentage should not be greater than ${this.state.coinValue}` : ""}</p>

                                                                                    </div>
                                                                                </div>

                                                                                <div className="input-col col-xs-12 col-sm-6">
                                                                                    <div className="form-group fg_icon focus-2">
                                                                                        <div className="form-label">Starting date</div>
                                                                                        <input className="form-input" type="date" onChange={this.handleChange} name="start_date" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="input-col col-xs-12 col-sm-6">
                                                                                    <div className="form-group fg_icon focus-2">
                                                                                        <div className="form-label">Expiration date</div>
                                                                                        <input className="form-input" type="date" onChange={this.handleChange} min={this.state.endDate} name="expiry_date" />
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        <div className="tab-info">

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


                                                        <div className='col-xs-12 text-left pl-1'>
                                                            {/* {this.state.ConnectWalletAddress ? */}
                                                            {this.state.spinLoader === false ?
                                                                <button className='btn-main pt-2 pb-2 style1 m-3' onClick={this.createNftAPI}>Submit</button> :
                                                                <button className='btn-main pt-2 pb-2 style1 m-3' disabled>Submit</button>
                                                                // :
                                                                // <button onClick={() => this.openModalForWallet()} className='btn-main pt-2 pb-2 style1'>Connect Wallet</button>
                                                            }

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
                                    <div className="form-label mb-3">Image <span className='error'>*</span></div>

                                    <div
                                        className=" mb-1  rounded-lg overflow-hidden relative "
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
                                    <div className="form-label mb-3">Cover Photo <span className='error'>*</span></div>


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
                                        <div className="form-label">Name <span className='error'>*</span></div>
                                        <input className="form-control" type="text" onKeyPress={(event) => { if (/^([^a-z,0-9,A-Z, ,_]*)$/.test(event.key)) { event.preventDefault(); } }} name="cl_name" onChange={this.handleChange} value={this.state.cl_name} placeholder='e.g. CryptoFunk' />
                                        <span className="error-asterick"> {this.state.clnameError}</span>

                                    </div>
                                </div>
                                {/* <div className="input-col col-xs-12 col-sm-12">
                                    <div className="form-group fg_icon focus-2">
                                        <div className="form-label">Description <span className='error'>*</span></div>
                                        <input className="form-control" type="text" name="cl_description" onChange={this.handleChange} value={this.state.cl_description} placeholder='e.g. This is very limited item' />
                                        <span className="error-asterick"> {this.state.cldescError}</span>

                                    </div>
                                </div> */}
                                <div className="input-col col-md-12 col-sm-12">
                                    <div className="form-group focus-2">
                                        <div className="form-label">Description</div>
                                        <JoditEditor
                                            editorRef={this.setRef}
                                            value={this.state.cl_description}
                                            config={this.config}
                                            onChange={this.updateContent}
                                        />
                                        {/* <textarea   className='form-input' name="cl_description" onChange={this.handleChange} value={this.state.cl_description} placeholder='e.g. This is very limited item'></textarea> */}
                                        <span className="error-asterick">{console.log('this', this.state.cldescError)} {this.state.cldescError}</span>

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



                <Modal visible={this.state.visibleProperties} width="400" effect="fadeInUp" onClickAway={() => this.closeModalProperties()}>
                    <div className='header_modal connect_wallet' style={{ width: '535px' }}>
                        <div className='modal-header text-center'>
                            <strong className='text-white'>Add Properties</strong>

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
                                    <div className='col-md-6'>
                                        <p className='cross'>
                                            <span className='' style={{ cursor: 'pointer' }} onClick={() => this.spliceRow1(1)}>x</span><input className='form-control addinput type' placeholder='Key' type='text' name="type[]" id="item_title" /></p>
                                    </div>
                                    <div className='col-md-6'>
                                        <p><input className='form-control addinput value' type='text' placeholder='Value' name="value[]" id="item_title" /></p>

                                    </div>

                                </div>
                            ))}





                            <div className=' header-btn mb-5'>
                                <a href='javascript:void(0)' onClick={() => this.addRow1(1)} className=' addmorebtn' >Add more</a>
                            </div>
                            {/* <li className='header-btn'><a className='addmorebtn' href="javascript:void(0);">Save</a></li> */}
                        </div>
                        <div className='modal-footer header-btn '>
                            <a href='javascript:void(0)' className=' addmorebtn' onClick={() => this.saveData()} style={{ width: "100%", textAlign: "center" }}>Save</a>
                        </div>
                    </div>

                </Modal>

                <Modal visible={this.state.visibleForWallet} width="400" effect="fadeInUp" onClickAway={() => this.closeModalForWallet()}>
                    <div className='header_modal connect_wallet'>
                        <div className='modal-header text-right'>
                            <button className='close' onClick={() => this.closeModalForWallet()}><span>x</span></button>
                        </div>
                        <div className='modal-body'>
                            <h1 class="ant-typography title">Connect Wallet</h1>
                            <p class="desc">Please connect your wallet to continue. The system supports the following wallets</p>
                            <br />
                            <button type="submit" class="ant-btn btn" onClick={this.connectMetasmask.bind(this)}>
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

                <Footer />

            </>
        )
    }
}