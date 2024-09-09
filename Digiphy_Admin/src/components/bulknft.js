import React, { useEffect, useState } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import config from '../config/config'
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import $ from 'jquery';
import Web3 from 'web3';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
// import { getCurrentProvider } from '../components/provider'
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment'
import { ALERT } from '@blueprintjs/core/lib/esm/common/classes';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function Productuser() {

    const [item_list, setitem_list] = useState([])
    const [mintItems, setMintItems] = useState([])
    const [peopleInfo, setPeopleInfo] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isDialogOpen, setisDialogOpen] = useState(false)


    const toggleHandler = (item) => {
        if (selectedItems.filter(d => d.id == item.id).length) {
            let data = selectedItems.filter(d => d.id != item.id);
            setSelectedItems(data)
        } else {
            setSelectedItems((old) => ([...old, item]))
        }
    }




    const putOnSaleAPI = async () => {
        await axios({
            method: 'post',
            url: `${config.apiUrl}/updateItemMarketBulkNft`,
            data: {
                "dataArr": selectedItems
            }
        })
            .then(async result => {
                if (result.data.success === true) {
                    await Swal.fire({
                        icon: 'success',
                        text: "Bulk Nft Uploaded Successfully!"
                    })
                    setisDialogOpen(false)
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }
                else if (result.data.success === false) {
                    await Swal.fire({
                        icon: 'error',
                        text: "Ethereum network overloaded, please try again later."
                    })
                    setisDialogOpen(false)
                }
            }).catch(err => {

            });
    }



    useEffect(() => {
        getItemAPI()
    }, [])


    const columns = [
        // {
        //     key: "",
        //     text: "#",
        //     cell: item => {
        //         return (
        //             <>
        //                 {item.is_on_sale == 0 ?
        //                     <input
        //                         name='item_info[]'
        //                         onChange={() => toggleHandler(item)}
        //                         value={item.id}
        //                         style={{ margin: "20px" }}
        //                         checked={selectedItems.filter(ii => ii.id == item.id).length > 0 ? true : false}
        //                         type="checkbox"
        //                     /> : ''}

        //             </>
        //         )
        //     }
        // },

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
                    <a target="_blank" href={config.redirectUrl + 'nftdetail/' + row.item_edition_id}>{row.name}</a>
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
                       {!item.image ?
                                ""
                                :
                                <img width="80px" src={`${config.imageUrl}`+ item.image} />
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
                        <a href={`${config.redirectUrl}featurescreator/` + item.owner_id} target="_blank" >
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
                        <a href={`${config.redirectUrl}featurescreator/` + item.creator_id} target="_blank" >
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

    ];

    const config1 = {
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

    const getItemAPI = async () => {
        let loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'))
        axios.post(`${config.apiUrl}getBulkNFT`, {
            user_id: loginData?.data?.id
        })
            .then(response => {
                if (response.data.success === true) {
                    setitem_list(response.data.response)
                }
                else if (response.data.success === false) {
                }
            })
            .catch(err => {
            })
    }



    return (
        <>
            {
                console.log("selectedItems", selectedItems)}
            <ToastContainer />
            <Dialog
                title="Warning"
                icon="warning-sign"
                style={{
                    color: 'red'
                }}
                isOpen={isDialogOpen}
                isCloseButtonShown={false}
            >
                <div className="text-center">
                    <BarLoader color="#e84747" height="2" />
                    <br />
                    <h4 style={{ color: '#000' }}>Transaction under process...</h4>
                    <p style={{ color: 'red' }}>
                        Please do not refresh page or close tab.
                    </p>
                    <div>
                    </div>
                </div>
            </Dialog>
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
                                <h5 className="" style={{ color: '#fff' }}>Bulk Admin Products</h5>
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
                                            <a href={`${config.baseUrl}create_bulk_item`}>
                                                <button type='button' className="btn btn-primary pb-4">Add Bulk Nft's </button></a>

                                                {/* <a href="javascript:void(0)" style={{float:'right'}}>
                                                <button type='submit' onClick={(e) => putOnSaleAPI()} disabled={!selectedItems.length > 0} className="btn btn-primary pb-4">Add Nfts</button></a> */}

                                            <br />
                                            <br />

                                            <div className="form-wrap">
                                                <div class="table-responsive" style={{ overflowX: "auto" }}>
                                                    <ReactDatatable
                                                        config={config1}
                                                        records={item_list}
                                                        columns={columns}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>        </div></div>
        </>
    )



}