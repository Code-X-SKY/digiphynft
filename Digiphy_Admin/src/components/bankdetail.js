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
            account_id :'',
            bank_detail_list:[]
        }
        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },
            {
                key: "full_name",
                text: "Full name",
                sortable: true
            },
            {
                key: "account_email",
                text: "Account email"
               
            },
            {
                key: "account_name",
                text: "Account name",
                sortable: true
            },
      
            {
                key: "account_number",
                text: "Account number",
                
            },
            {
                key: "bank_name",
                text: "Bank name",
              
            },
            {
                key: "ifsc_code",
                text: "ifsc code",
                sortable: true
            },
            {
                key: "holder_name",
                text: "Holder name",
                sortable: true
            },
            
          
            {
                key: "account_id",
                text: "Razor Pay Account id",
                cell: (item) => {
                    return (
                        // onClick={this.updateBankAccountId.bind(this,item)}
                      
                        item.account_id ==null 
                   ?     <>
                        <button type="button" data-toggle="modal" data-target="#responsive-modal1" className="btn-primary" data-original-title="Edit" onClick={this.editAccount.bind(this,item)}>Update</button>
                        </>:
                        <>
                        {item.account_id}
                        <button type="button" data-toggle="modal" data-target="#responsive-modal1" className="btn-primary" data-original-title="Edit" onClick={this.editAccount.bind(this,item)}>Update</button>
                     
                     </>
                     )

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
        this.bankDetailList()
    }


  

   


    //============================  update item ==========================================

   


    async bankDetailList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getBankDetailinAdmin`,
                data: {}
            })

                // axios.get(`${config.apiUrl}getDigitalCategory`, {}, )
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            bank_detail_list: result.data.response
                        })


                    }

                    else if (result.data.success === false) {

                    }
                })

                .catch(err => {
                })
    }




    handleChange = e => {

        this.setState({
            [e.target.name]: e.target.value
        })

    }


    editAccount = (id) => {
        console.log('geee',id)

        this.setState({
            user_id: id.user_id,
            account_id : id.account_id
                })

    }


  

    handlesubmit = async e =>{
        e.preventDefault()

        await axios.post(`${config.apiUrl}updateBankAccountinadmin`, {user_id : this.state.user_id, account_id: this.state.account_id},)
        .then(result => {

            if (result.data.success === true) {
                toast.success(result.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                }, setTimeout(() => {
                    window.location.reload();
                }, 500));

            }

            else if (result.data.success === false) {

            }
        })

        .catch(err => {
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
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="" style={{ color: '#fff' }}>User Bank Details</h5>
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
                                                    <div class="table-responsive" style={{overflowX:"auto"}}>
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
                                                            records={this.state.bank_detail_list}
                                                            columns={this.columns}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
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
                {/* ----------update fom------ */}
                <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                <div class="modal-dialog">
                                    <div class="modal-content" style={{backgroundColor:"#000"}}>
                                     
                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className=" capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Account Update</h6>
                                                    <button type="button" className=" close_btn close" data-dismiss="modal" aria-hidden="true">×</button>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <input type="text"  className="form-control" placeholder="Enter razor pay Account id" onChange={this.handleChange} value={this.state.account_id} name='account_id' />
                                                            </div>
                                                        </div>
                                                
                                                       </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="modal-footer pt-0">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                            <button type='button'  className="btn btn-success btn-icon left-icon mr-10 pull-left" onClick={this.handlesubmit.bind(this)}>Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
            </>


        )

    }
}