import React, { Component } from 'react';
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
import Web3 from 'web3';


export default class productuser extends Component {

    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'));
        this.state = {
            item_name: '',
            name: '',
            description: '',
            image: '',
            owner: '',
            item_category_id: '',
            category_name: '',
            price: '',
            start_date: '',
            edition_type: '1',
            expiry_date: '',
            item_list: [],
            category_list: [],
            image_file: null,
            image_preview: '',
            updateform: '',
            update_id: '',
            bid_list: [],
            sell_type: '',
            quantity: '',
            dateShow: 0,
            index: 0,
            file_type: '',
            loader: '',
            getItemData: '',
            image_preview1: null,
            image_file1: '',
            file_type1: '',
            allImages1: '',
            getWalletDetailAPIData: ''
        }
        this.editDataAPI = this.editDataAPI.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.onChange = this.itemDetail.bind(this)
        this.updateItemData = this.updateItemData.bind(this)
        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },
            {
                key: "edition_text",
                text: "Edition",
                sortable: true
            },
            {
                key: "name",
                text: "Name",
                cell: (row) => {
                    return (
                        <a target="_blank" href={config.redirectUrl + row.collection_name + '/' + row.name.replace("#", '-') + '/' + row.item_edition_id}>{row.name}</a>
                    )
                }
            },
            {
                key: "description",
                text: "Description",
                sortable: true
            },
            {
                key: "image",
                text: "Image",
                cell: (item) => {
                    return (
                        <>
                            {item.file_type === 'image' ?
                                <img src={`${config.imageUrl}${item.image}`} className="product-img" /> :
                                item.file_type === 'video' ?
                                    <a href={`${config.imageUrl}${item.image}`} target="_blank">
                                        <img className="video-css" src="https://www.roadtovr.com/wp-content/uploads/2015/03/youtube-logo2.jpg" />
                                    </a> :
                                    <a href={`${config.imageUrl}${item.image}`} target="_blank">
                                        <img className="video-css" src="https://png.pngtree.com/png-vector/20190120/ourmid/pngtree-high-sound-vector-icon-png-image_470307.jpg" />
                                    </a>
                            }


                        </>
                    );
                }
            },
            {
                key: "owner_name",
                text: "NFT Owner",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl}userprofile/` + item.owner_id} target="_blank" >
                                {item.owner_name}
                            </a>

                        </>
                    );
                }
            },
            {
                key: "creator_name",
                text: "NFT Creator",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl}userprofile/` + item.creator_id} target="_blank" >
                                {item.creator_name}
                            </a>

                        </>
                    );
                }
            },
            {
                key: "item_category",
                text: "Category Name",
                sortable: true
            },
            {
                key: "collection_name",
                text: "Collection Name",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl}collectiondetail/` + item.collection_name} target="_blank" >
                                {item.collection_name}
                            </a>

                        </>
                    );
                }
            },

            {
                key: "price",
                text: "Price(₹)",
                cell: (item) => {
                    return (
                        <>
                            <span>{item.price}</span>
                        </>
                    )
                }
            },
            {
                key: "is_featured",
                text: "Trending",
                sortable: true,
                cell: (item) => {
                    return (
                        <>
                            {item.is_on_sale == 0 ? 'N/A'
                                :
                                (item.sell_type == 2 && new Date(item.expiry_date) > new Date()) || item.sell_type == 1
                                    ?
                                    <span onClick={this.updateUserNftFeature.bind(this, item.id, item.is_featured)}>
                                        <input type='checkbox' style={{ cursor: 'pointer' }} checked={item.is_featured === 0 || item.is_featured === null ? '' : 'checked'} /></span> : <p title='This product is expired!!'>NA</p>
                            }
                        </>
                    )
                }

            },
            // {
            //     key: "verified_tag",
            //     text: "Verified Tag",
            //     sortable: true,
            //     cell: (item) => {
            //         return (
            //             <>

            //                 <input type='checkbox' checked={item.verified_tag === 0 ? '' : 'checked'} onClick={this.updateUserNftTag.bind(this, item.id, item.verified_tag)} />
            //             </>
            //         )
            //     }

            // },
            {
                key: "id",
                text: "Action",
                cell: (item) => {
                    return (
                        <>
                            {/* <button type="submit" onClick={this.editDataAPI.bind(this, item)} data-toggle="modal" title="Edit" data-target="#responsive-modal2" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp; */}
                            {item.approve_by_admin == 0 ?

                                <button style={{ padding: '3px' }} type='button' onClick={this.approveNFTAdmin.bind(this, item)} className="btn btn-primary">Approve</button>
                                :
                                item.is_active == 1 ?
                                    <button type="submit" onClick={this.hideNFTAPI.bind(this, item)} title="Hide NFT" data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-minus-square m-r-10"></i> </button> :
                                    <button type="submit" onClick={this.showNFTAPI.bind(this, item)} title="Show NFT" data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-plus-square m-r-10"></i> </button>

                            }
                            <button type="submit" onClick={this.deleteNFTAPI.bind(this, item)} title="Delete NFT" data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-trash m-r-10"></i> </button>
                            {item.sell_type == 2 && item.owner_id == 1 ?
                                <button type='button' onClick={this.getBidDetailAPI.bind(this, item)} data-toggle="modal" data-target="#exampleModalCenter" className="btn btn-primary">View Bid </button>
                                : ''
                            }
                        </>
                    );
                }
            },

        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50,],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            }
        }


    }
    componentDidMount() {
        if (!Cookies.get('loginSuccessdigiphyNFTAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.categoryList();
        this.getItemAPI();
        this.getWalletDetailAPI()
    }


    async getWalletDetailAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getSettings`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': 'admin@digiphynft.io', 'user_id': 1 }
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





    //============================  update item ==========================================

    async approveNFTAdmin(item) {
        this.setState({
            isDialogOpen: true,
        })
        await axios({
            method: 'post',
            url: `${config.apiUrl}updateItemAdmin`,
            data: { 'item_id': item.id }
        }).then(response => {
            if (response.data.success === true) {

                toast.success('Item is Approved Now!');
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }
        })
    }


    async getItemAPI() {
        axios.get(`${config.apiUrl}getAdminItem`, {},)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list: response.data.response.filter(item => item.created_by != 1)
                    })
                    console.log(this.state.item_list);
                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {
            })
    }

    async categoryList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getDigitalCategory`,
                data: {}
            })

                // axios.get(`${config.apiUrl}getDigitalCategory`, {}, )
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


    async getBidDetailAPI(id) {

        axios.post(`${config.apiUrl}getBidDetail`, { 'item_id': id.id },)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        bid_list: response.data.response
                    })
                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {
                this.setState({
                    bid_list: []
                })
            })
    }

    async BidAcceptAPI(id) {
        axios({
            method: 'post',
            url: `${config.apiUrl}bidAccept`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': this.loginData?.data.user_email, "user_id": id.user_id, "item_id": id.item_id }
        })

            .then(response => {
                if (response.data.success === true) {
                    toast.success(response.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    }, setTimeout(() => {
                        window.location.reload();
                    }, 500));

                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {

            })
    }


    handleChange = event => {

        event.persist();

        let value = event.target.value;

        this.setState(prevState => ({
            item_list: { ...prevState.item_list, [event.target.name]: value }
        }))
    };

    handleChange1 = e => {

        this.setState({
            [e.target.name]: e.target.value
        })


        if (e.target.checked === true && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (e.target.checked === false && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }
    }


    handleImagePreview = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        let file_type = '';
        if (image_as_files.type.indexOf('image') === 0) {
            file_type = 'image';
        } else {
            file_type = 'video';
        }

        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
            file_type: file_type,
        })
    }


    async imageUpload() {
        let formData1 = new FormData();
        formData1.append('file', this.state.image_file);
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let resIPF = await axios.post(url,
            formData1,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                    'pinata_api_key': config.pinata_api_key,
                    'pinata_secret_api_key': config.pinata_secret_api_key
                }
            }
        );
        let ipfsImg = resIPF.data.IpfsHash;
        this.setState({
            ImageFileHash: ipfsImg
        })
        return ipfsImg;
    }


    handleImagePreviewMultiple = (e) => {
        var newImage_as_base64 = []
        var new_image_as_files = []
        var new_image_as_type = []

        var newfile_size = []
        let imageLenght = e.target.files.length
        for (var i = 0; i < imageLenght; i++) {
            let image_as_base64 = URL.createObjectURL(e.target.files[i])
            let image_as_files = e.target.files[i];
            let file_size = e.target.files[i].size;
            let file_type1 = '';
            if (image_as_files.type.indexOf('image') === 0) {
                file_type1 = 'image';
            } else if (image_as_files.type.indexOf('video') === 0) {
                file_type1 = 'video';
            } else if (image_as_files.type.indexOf('audio') === 0) {
                file_type1 = 'audio';
            }

            var file_size_byte = file_size / 1024;
            var file_size_mb = file_size_byte / 1024;

            newImage_as_base64.push(image_as_base64);
            new_image_as_files.push(image_as_files);
            new_image_as_type.push(file_type1);




        }
        this.setState({
            image_preview1: newImage_as_base64,
            image_file1: new_image_as_files,
            file_type1: new_image_as_type,
            largeImageSizeError: 0
        })
        // setTimeout(() => {
        //     // console.log()
        //     this.setState({
        //         firstTimeImgPre: this.state.image_preview1,
        //         firstTimeImgList: this.state.image_file1,
        //     })
        // }, 1000);

        setTimeout(() => {


        }, 2000);
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            loader: '1'
        })
        if (this.state.item_name == '') {
            toast.error('Item name Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.description == '') {
            toast.error('Item Description Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (!this.state.image_file) {
            toast.error('Item Image Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.owner == '') {
            toast.error('Owner Name Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (!this.state.item_category_id) {
            toast.error('Please Select Category', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.price == '') {
            toast.error('Item price Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.edition_type == '') {
            toast.error('Item edition required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else {

            if (this.state.edition_type === '2') {
                this.state.quantity = '0'
            }
            let formData = new FormData();

            let formData1 = new FormData();

            Cookies.set('create_item_data', '');

            let allImages = []

            let filesLength = this.state.image_file1.length


            for (var j = 0; j < filesLength; j++) {
                let formData1 = new FormData();

                formData1.append('file', this.state.image_file1[j]);

                const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
                var resIPF = await axios.post(url,
                    formData1,
                    {
                        headers: {
                            'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                            'pinata_api_key': 'b26a087893e3f0033bbf',
                            'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                        }
                    }
                );

                allImages.push(resIPF.data.IpfsHash);

                this.setState({
                    allImages1: allImages
                })
            }
            let ImageFileHash = this.state.ImageFileHash;
            if (!ImageFileHash) {
                ImageFileHash = await this.imageUpload();
            }



            formData1.append('file', this.state.image_file);


            formData.append('name', this.state.item_name);
            formData.append('description', this.state.description);
            // if(this.state.image_file === null){
            //     formData.append('avatar', this.state.item_list.avatar);
            // }
            // else{
            //     formData.append('avatar', this.state.image_file);
            // }    
            formData.append('owner', this.state.owner);
            formData.append('item_category_id', this.state.item_category_id);
            formData.append('price', this.state.price);
            formData.append('start_date', this.state.start_date);
            formData.append('expiry_date', this.state.expiry_date);
            formData.append('sell_type', this.state.sell_type);
            formData.append('quantity', this.state.quantity);
            formData.append('file_type', this.state.file_type);
            formData.append('email', this.loginData?.data.user_email);
            formData.append('image1', this.state.allImages1);

            //  formData.append('IPFShash',resIPF.data.ipfsHash);


            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            var resIPF = await axios.post(url,
                formData1,
                {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                        'pinata_api_key': 'b26a087893e3f0033bbf',
                        'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                    }
                }
            );

            formData.append('image', resIPF.data.IpfsHash);

            const obj = Object.fromEntries(formData);

            axios({
                method: 'post',
                url: `${config.apiUrl}insertitem`,
                headers: { "Authorization": this.loginData?.Token },
                data: obj
            })
                //   axios.post(`${config.apiUrl}insertitem`,obj)
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            loader: ''
                        })
                        toast.success(result.data.msg, {
                            position: toast.POSITION.TOP_CENTER
                        }, setTimeout(() => {
                            window.location.reload();
                        }, 500));
                        this.state = {
                            item_name: '',
                            description: '',
                            image: '',
                            owner: '',
                            item_category_id: '',
                            price: '',
                            sell_type: '',
                            quantity: ''
                        }
                        this.getItemAPI();

                    }
                }).catch(err => {

                    toast.error(err.response.data?.msg, {
                        position: toast.POSITION.TOP_CENTER, autoClose: 1500

                    }, setTimeout(() => {

                    }, 500));

                })
        }
    }

    itemDetail = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getItemData: { ...prevState.getItemData, [event.target.name]: value }
        }))

        if (event.target.checked === true && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (event.target.checked === false && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }
    }

    async editDataAPI(id) {

        await axios.post(`${config.apiUrl}ItemDetailForEdit`, { item_id: id.id },)
            .then(result => {

                if (result.data.success === true) {
                    this.setState({
                        getItemData: result.data.response
                    })


                }

                else if (result.data.success === false) {

                }
            })

            .catch(err => {
            })
    }


    async updateItemData(e) {
        e.preventDefault()
        this.setState({
            loader: '1'
        })

        if (this.state.getItemData?.item_name == '') {
            toast.error('Item name Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.getItemData?.description == '') {
            toast.error('Item Description Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        // else if(!this.state.getItemData?.image_file){
        //     toast.error('Item Image Required', {
        //         position: toast.POSITION.TOP_CENTER
        //         });
        // }

        else if (!this.state.getItemData?.item_category_id) {
            toast.error('Please Select Category', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.getItemData?.price == '') {
            toast.error('Item price Required', {
                position: toast.POSITION.TOP_CENTER
            });
        } else {
            let formData = new FormData();

            let formData1 = new FormData();

            formData1.append('file', this.state.image_file);

            formData.append('id', this.state.update_id)
            formData.append('name', this.state.item_name);
            formData.append('description', this.state.description);
            if (this.state.image_file === null) {
                formData.append('image', this.state.image);
            }
            else {
                const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
                var resIPF = await axios.post(url,
                    formData1,
                    {
                        headers: {
                            'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                            'pinata_api_key': 'b26a087893e3f0033bbf',
                            'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                        }
                    }
                );


                formData.append('image', resIPF.data.IpfsHash);
                if (resIPF.data.IpfsHash !== '' || resIPF.data.IpfsHash !== null) {

                    this.state.getItemData.image = resIPF.data.IpfsHash
                    this.state.getItemData.file_type = this.state.file_type

                }
            }
            this.state.getItemData.email = this.loginData?.data.user_email
            //  formData.append('IPFShash',resIPF.data.ipfsHash);

            axios({
                method: 'post',
                url: `${config.apiUrl}updateitem`,
                headers: { "Authorization": this.loginData?.Token },
                data: this.state.getItemData
            })
                //   axios.post(`${config.apiUrl}updateitem`,this.state.getItemData)
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            loader: ''
                        })
                        toast.success(result.data.msg, {
                            position: toast.POSITION.TOP_CENTER
                        },
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500));

                        this.getItemAPI();

                    }
                }).catch(err => {

                    toast.error(err.response.data?.msg, {
                        position: toast.POSITION.TOP_CENTER, autoClose: 1500

                    }, setTimeout(() => {

                    }, 500));

                })
        }
    }

    deleteItem = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this NFTs.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}deleteitem`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, item_edition_id: id.item_edition_id }
                        })
                            //  axios.post(`${config.apiUrl}deleteitem`,{item_edition_id :  id.item_edition_id} )
                            .then(result => {
                                if (result.data.success === true) {
                                    toast.success(result.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });
                                    this.getItemAPI();
                                }

                            }).catch(err => {
                                toast.warning(err.response.data?.msg, {
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

    // async updateItemData(e) {
    //     e.preventDefault()
    //    await axios({
    //      method: 'post',
    //      url: `${config.apiUrl}updateitem`,
    //      headers: { "Authorization": this.loginData.message },
    //      data: this.state.getItemData
    //    }).then(response => {
    //      if (response.data.success === true) {
    //         toast.success(response.data.msg, {
    //             position: toast.POSITION.TOP_CENTER
    //         });
    //         // window.location.reload()
    //      }
    //      else if (response.data.success === false) {
    //         toast.error(response.data.msg, {
    //             position: toast.POSITION.TOP_CENTER
    //         });
    //     }
    // })
    // .catch(err => {
    //     toast.error(err?.response?.data?.msg, {
    //         position: toast.POSITION.TOP_CENTER
    //     });

    // })
    //    }


    hideNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to hide this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}hideNFT`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, item_id: id.id }
                        })

                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount();
                            }).catch((error) => {
                                toast.danger(error.data?.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }


    showNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to show this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}showNFT`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, item_id: id.id }
                        })
                            //    axios.post(`${config.apiUrl}showNFT`,
                            //  {item_id :  id.id} )
                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount();
                            }).catch((error) => {
                                toast.danger(error.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }



    async updateUserNftFeature(id, featured) {
        console.log('id', id)
        axios({
            method: 'post',
            url: `${config.apiUrl}addUserNftFeatured`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, is_featured: featured === 0 ? '1' : '0' }
        })
            .then(result => {

                if (result.data.success === true) {
                    if (featured == 0) {
                        toast.success('Added In Trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (featured == 1) {
                        toast.error('Removed From Trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    this.getItemAPI();

                }
            }).catch(err => {

                // toast.error(err.response.data?.msg, {
                //     position: toast.POSITION.TOP_CENTER, autoClose: 1500
                // }, setTimeout(() => {
                // }, 500));

            })
    }


    async deleteNFTAPI (id) {
        await confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to Delete this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                         axios({
                            method: 'post',
                            url: `${config.apiUrl}deleteitem`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, item_id: id.id }
                        })

                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount();
                            }).catch((error) => {
                                toast.error('Transaction in this Nft so it cant be deleted!', {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
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
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="" style={{ color: '#fff' }}>User Products</h5>
                                </div>
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
                            {/* <!-- /Title --> */}

                            {/* <!-- Row --> */}
                            <div className="row">

                                <div className="col-sm-12">
                                    {/* <div className="table-responsive"> */}
                                    <div className="panel panel-default card-view" id="users">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">


                                                <br />
                                                <br />

                                                <div className="form-wrap">
                                                    <div class="table-responsive" style={{ overflowX: "auto" }}>
                                                        {/* <table class="table table-striped mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th> 
                                                            <th>Name</th>
                                                            <th>Description</th>                                                          
                                                            <th>Image</th>
                                                            <th>owner</th>
                                                            <th>Category Name</th>
                                                            <th>Bid Detail</th>
                                                            <th>price</th>
                                                            <th>Action</th>
                                                            
                                                        </tr>
                                                    </thead>
														
														<tbody>
                                                        {this.state.item_list.map(item=>(
                                                        <tr>
                                                           
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.description}</td>
                                                            <td ><img src={`${config.imageUrl}${item.image}`} className="product-img"/></td>
                                                            <td>{item.owner}</td>
                                                            <td style={{textAlign:"center"}}>{item.category_name}</td>
                                                            <td>   <button type='button'  onClick={this.getBidDetailAPI.bind(this,item)}  data-toggle="modal" data-target="#exampleModalCenter" className="btn btn-primary">View Bid </button>
               </td>
                                                            <td>{item.price}</td>
                                                            <td>
                                                            <td class="text-nowrap"><button type="submit"    onClick={this.editDataAPI.bind(this,item)}  data-toggle="modal" data-target="#responsive-modal1" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp;
                                                             <button  className=" btn-danger" onClick={this.deleteItem.bind(this,item)}  data-toggle="tooltip" data-original-title="Close"> <i class="fa fa-close m-r-10"></i> </button> </td>
											
                                                            </td> 
                                                        </tr>
                                                       ))}
																					</tbody>
													</table> */}
                                                        <ReactDatatable
                                                            config={this.config}
                                                            records={this.state.item_list}
                                                            columns={this.columns}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="capitalize-font" style={{ color: '#fff' }}><i className="zmdi zmdi-info-outline mr-10"></i>Add Product</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Item Name</label>
                                                                <input type="text" onChange={this.handleChange1} name="item_name" className="form-control" placeholder="Item Name" value={this.state.item_name} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Description</label>
                                                                <input type="text" onChange={this.handleChange1} name="description" className="form-control" placeholder="Description" value={this.state.description} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Image(jpg, jpeg, png, gif, mp3, mp4)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4" onChange={this.handleImagePreview} className="form-control" placeholder="Image File" />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Multiple Images</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png, .mp4" onChange={this.handleImagePreviewMultiple} className="form-control" placeholder="Image File" multiple />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Owner</label>
                                                                <input type="text" onChange={this.handleChange1} name="owner" className="form-control" placeholder="Owner Name" value={this.state.owner} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">

                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Category</label>
                                                                <div className="customSelectHolder">

                                                                    <select name="item_category_id" onChange={this.handleChange1} value={this.state.item_category_id} class="form-control  basic">
                                                                        <option selected="selected" value="">Select Category</option>
                                                                        {this.state.category_list.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Fixed price (In ETH)</label>
                                                                <input type="text" onChange={this.handleChange1} name="price" className="form-control" placeholder="Price" value={this.state.price} />
                                                            </div>
                                                        </div>




                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Sell Type</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="sell_type" onChange={this.handleChange1} value={this.state.sell_type} >

                                                                        <option selected="selected" value="">Select Options</option>

                                                                        <option value="1">Price</option>
                                                                        <option value="2">Auction</option>


                                                                    </select>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-6" style={{ display: 'none' }}>
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Edition Type</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="edition_type" onChange={this.handleChange1} value={this.state.edition_type} >

                                                                        <option selected="selected" value="">Select Options</option>

                                                                        <option value="1">Limited Edition</option>
                                                                        <option value="2">Open Edition</option>


                                                                    </select>

                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Quantity</label>
                                                                <input type="text" onChange={this.handleChange1}
                                                                    disabled={this.state.edition_type === '2'}
                                                                    name="quantity" className="form-control" placeholder="" value={this.state.quantity} />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-12">
                                                            <label className="control-label mb-10">
                                                                <input className="input-checkbox100" id="ckb1" type="checkbox" name="end_start_date" onChange={this.handleChange1} /> &nbsp;

                                                                click here to create Upcoming NFTs </label>

                                                        </div> */}
                                                        {console.log(this.state.sell_type)}
                                                        {(this.state.sell_type === '2') ?
                                                            <>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Start Date</label>
                                                                        <input type="date" onChange={this.handleChange1} className="form-control" name="start_date" value={this.state.start_date} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Expiry Date</label>
                                                                        <input type="date" onChange={this.handleChange1} className="form-control" name="expiry_date" value={this.state.expiry_date} />
                                                                    </div>
                                                                </div>
                                                            </>
                                                            : ''}


                                                    </div>

                                                    <div className="form-actions">

                                                        <div className="clearfix"></div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            {this.state.loader === '' ?
                                                <button type='submit' onClick={this.handleSubmit} className="btn btn-primary">Add </button>
                                                :
                                                <button type='submit' disabled className="btn btn-primary">Loading... </button>


                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="responsive-modal2" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Update Product</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Item Name</label>
                                                                <input type="text" onChange={this.itemDetail} name="name" className="form-control" placeholder="Item Name" value={this.state.getItemData?.name} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Description</label>
                                                                <input type="text" onChange={this.itemDetail} name="description" className="form-control" placeholder="Description" value={this.state.getItemData?.description} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Image(jpg, jpeg, png, gif, mp3, mp4)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4" onChange={this.handleImagePreview} className="form-control" placeholder="Image File" />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">

                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Category</label>
                                                                <div className="customSelectHolder">

                                                                    <select name="item_category_id" onChange={this.itemDetail} value={this.state.getItemData?.item_category_id} class="form-control  basic">
                                                                        <option selected="selected" value="">Select Category</option>
                                                                        {this.state.category_list.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Fixed price (In ETH)</label>
                                                                <input type="text" onChange={this.itemDetail} name="price" className="form-control" placeholder="Price" value={this.state.getItemData?.price} />
                                                            </div>
                                                        </div>



                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Expiry Date</label>
                                                                <input type="date" onChange={this.itemDetail} className="form-control" name="expiry_date" value={this.state.getItemData?.expiry_date} />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label mb-10">Quantity</label>
                                                        <input type="text" onChange={this.itemDetail}
                                                        disabled={this.state.getItemData?.edition_type === '2'}
                                                            name="quantity" className="form-control" placeholder=""  value={this.state.getItemData?.quantity} />
                                                    </div>
                                                </div>  */}
                                                        <div className="col-md-12">
                                                            <label className="control-label mb-10">
                                                                <input className="input-checkbox100" id="ckb1" type="checkbox" name="end_start_date" onChange={this.itemDetail} /> &nbsp;

                                                                click here to create Upcoming NFTs </label>

                                                        </div>
                                                        {(this.state.dateShow === 1) ?
                                                            <>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Start Date</label>
                                                                        <input type="date" onChange={this.itemDetail} className="form-control" name="start_date" value={this.state.getItemData?.start_date} />
                                                                    </div>
                                                                </div>
                                                            </>
                                                            : ''}


                                                    </div>

                                                    <div className="form-actions">

                                                        <div className="clearfix"></div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            {this.state.loader === '' ?
                                                <button type='submit' onClick={this.updateItemData} className="btn btn-primary">Update</button>
                                                :
                                                <button type='submit' disabled className="btn btn-primary">Loading... </button>


                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>




                            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle">Item Bid Details</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ marginTop: '-25px' }}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="table-responsive" >
                                            <table class="table table-striped mb-0">
                                                <thead>
                                                    <tr>

                                                        <th>UserName</th>
                                                        <th>Profile Pic</th>
                                                        <th>Item Name</th>
                                                        <th>Bid Price</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {this.state.bid_list.length === 0 ?
                                                        <tr >
                                                            <td colspan="6" className="text-center"><p>No data found!!</p></td></tr> :
                                                        this.state.bid_list.map(item => (
                                                            <tr>

                                                                <td>{item.user_name}</td>
                                                                <td >
                                                                    {item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                                        ?
                                                                        <img src='images/noimage.png' className="product-img" />

                                                                        :
                                                                        <img src={`${config.imageUrl1}${item.profile_pic}`} className="product-img" />}

                                                                </td>
                                                                <td>{item.item_name}</td>
                                                                <td>{item.bid_price}</td>
                                                                <td><button type='submit' onClick={this.BidAcceptAPI.bind(this, item)} className="btn btn-primary">Accept</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>

                                            </table>
                                        </div>
                                        <div class="modal-footer">


                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* </div> */}
                            {/* <!-- /Row --> */}

                            {/* </div> */}
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