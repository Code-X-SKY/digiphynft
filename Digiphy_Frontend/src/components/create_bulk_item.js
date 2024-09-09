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
export default class bulk_item extends Component {
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
            ownerAddress: localStorage.getItem('walletType'),
            setCollection: false,
            ownerAddressError: false,
            collectionLoader:false
        }
        this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'))
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
        let clcontractError = ""
        if (this.state.cl_name === '') {
            clnameError = "Name is required."
        }
        if (this.state.cl_description === '') {
            cldescError = "Description is required."
        }
        if (this.state.contractName === '') {
            clcontractError = "Contract Name is required."
        }
        if (this.state.cl_image_file === '') {
            imageError = "Image is required."
        }
        if (this.state.cl_coverPhoto === '') {
            coverError = "Cover photo is required."
        }
        if (clnameError || cldescError || imageError || coverError || clcontractError) {
            window.scrollTo(0, 260)
            this.setState({
                clnameError, cldescError, imageError, coverError, clcontractError
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

            if (this.state.ownerAddress) {
                const address = this.state.ownerAddress
                let result = Web3.utils.isAddress(address)
                console.log(result)  // => true
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
                }
            }

            this.setState({
                collectionLoader:true
            })

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
            formData.append('user_id', this.loginData.data?.id);
            formData.append('contractName', this.state.contractName);
            formData.append('ownerAddress', this.state.ownerAddress);

            axios.post(`${config.apiUrl}insertUserCollection`, formData)
                .then(result => {
                    if (result.data.success === true) {

                        this.setState({
                            isCollectionModelOpen: 0
                        })

                        // toast.success(result.data.msg);
                        this.setState({
                            visible: false,
                            collectionLoader:false
                        });
                        this.getUserCollectionAPI()

                    } else {
                        this.setState({
                            visible: false,
                            collectionLoader:false
                        });
                        toast.error(result.data.msg);
                    }
                }).catch(err => {
                    this.setState({
                        visible: false,
                        collectionLoader:false
                    });
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

        // const isValid = await this.validate()
        // console.log('isValid', isValid);
        // if (!isValid) {
        //     return false
        // }
        // else {

        this.setState({
            spinLoader: true
        })

        let formData = new FormData();
        let formData1 = new FormData();
        // formData1.append('file', this.state.image_file);
        // const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        // var resIPF = await axios.post(url,
        //     formData1,
        //     {
        //         headers: {
        //             'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
        //             'pinata_api_key': '105327714c080a01a4b5',
        //             'pinata_secret_api_key': 'e18cf3c1a8a7376852a4674735896bda9b7870cb4e11cc05c9e614711f955b35'
        //         }
        //     }
        // );


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
        // formData.append('attributes', JSON.stringify(attributes));
        // formData.append('image', resIPF.data.IpfsHash);
        // formData.append('name', this.state.titleData);
        // formData.append('external_link', this.state.external_link);
        // formData.append('unlockable_content', this.state.unlockable_content);
        // formData.append('nft_type', this.state.nft_type);
        // formData.append('quantity', this.state.quantity);
        // formData.append('file_type', this.state.file_type);
        // formData.append('royalty_percent', this.state.royaltie);
        // formData.append('metadata', this.state.metadata);
        // formData.append('coin_percentage', this.state.coin_percentage);
        // formData.append('image_type', this.state.image_type);
        // formData.append('description', this.state.description);
        // formData.append('start_date', this.state.start_date);
        // formData.append('expiry_date', this.state.expiry_date);
        // formData.append('item_category_id', this.state.item_category_id);
        // formData.append('user_collection_id', this.state.user_collection_id);
        // formData.append('sell_type', this.state.sell_type);
        // formData.append('user_id', 1);
        // formData.append('email', 'admin@DigiPhyNft');
        // formData.append('hybrid_shipment_address', this.state.hybrid_shipment_address);
        // formData.append('address', this.state.getWalletDetailAPIData?.public_key);
        // formData.append('hybrid_shipment_city', this.state.hybrid_shipment_city);
        // formData.append('hybrid_shipment_zipcode', this.state.hybrid_shipment_zipcode);
        // formData.append('hybrid_shipment_country', this.state.hybrid_shipment_country);

        // formData.append('approve_by_admin', 1);
        // formData.append('is_on_sale', 1);
        formData.append('user_id', this.loginData.data.id);
        formData.append('zip_file', this.state.zip_file);
        formData.append('excel_file', this.state.excel_file);
        formData.append('starting_date', this.state.starting_date);
        formData.append('project_launch', this.state.project_launch);
        formData.append('user_collection_id', this.state.user_collection_id);
        formData.append('item_category_id', this.state.item_category_id);


        axios.post(`${config.apiUrl}addBulkNftByAdmin`, formData)
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

    render() {
        return (

            <>


                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">
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
                                {this.state.collectionText == true ? 'Collection Creation is under process Please Wait...' :
                                    'Please do not refresh page or close tab.'}
                            </p>
                            <div>
                            </div>
                        </div>
                    </Dialog>

                    {/* <!-- Top Menu Items --> */}
                    <Header />
                    {/* <!-- /Top Menu Items --> */}

                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            <div id="content-block" className='mt-5'>

                                <div className="breadcrumb-wrap bg-f br-3">
                                    <div className="overlay bg-black op-7" />
                                    <div className="container">
                                        <div className="breadcrumb-title">
                                            <h2>Mint An Bulk NFTs</h2>

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
                                                                            <input type="file" style={{ marginTop: '80px' }} accept=".zip" onChange={this.zipfileSelect.bind(this)} id="upload_file4" name="image" /><br />
                                                                            {/* {this.state.zip_file_name ? this.state.zip_file_name : ''} */}
                                                                            {/* <span className="error-asterick"> {this.state.zipError}</span> */}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="form-label">Excel(Metadata)</div>
                                                                        <div className="d-create-file">
                                                                            <input type="file" style={{ marginTop: '80px' }} accept=".xlsx" onChange={this.excelfileSelect.bind(this)} id="upload_file6" name="excel_file" />
                                                                            {/* <span className="error-asterick"> {this.state.excelError}</span> */}
                                                                        </div>
                                                                    </div>


                                                                    <div className='col-xs-12 text-left' style={{ marginTop: '25px' }}>
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
                                        <input className="form-control" type="text" name="cl_name" onChange={this.handleChange} value={this.state.cl_name} placeholder='e.g. CryptoFunk' />
                                        <span className="error-asterick"> {this.state.clnameError}</span>

                                    </div>
                                </div>
                                <div className="input-col col-xs-12 col-sm-12">
                                    <div className="form-group fg_icon focus-2">
                                        <div className="form-label">Description <span className='error'>*</span></div>
                                        <input className="form-control" type="text" name="cl_description" onChange={this.handleChange} value={this.state.cl_description} placeholder='e.g. This is very limited item' />
                                        <span className="error-asterick"> {this.state.cldescError}</span>

                                    </div>
                                </div>
                                <div className="input-col col-xs-12 col-sm-12">
                                    <div className="form-group fg_icon focus-2">
                                        <div className="form-label">ContractName <span className='error'>*</span></div>
                                        <input className="form-control" type="text" name="contractName" onChange={this.handleChange} value={this.state.contractName} placeholder='' />
                                        <span className="error-asterick"> {this.state.clcontractError}</span>

                                    </div>
                                </div>
                                <div className="input-col col-xs-12 col-sm-12">
                                    <div className="form-group fg_icon focus-2">
                                        <div className="form-label">Owner Address</div>
                                        <input className="form-control" type="text" name="ownerAddress" onChange={this.handleChange} value={this.state.ownerAddress} placeholder='' />
                                        {this.state.ownerAddressError == true ?
                                            <span className="error-asterick"> Owner Address is not valid</span> : ''}



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
                                                {this.state.collectionLoader == false ? 'Create Collection':'Loading...'}
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