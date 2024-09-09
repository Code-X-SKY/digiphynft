import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
// import ReactDatatable from 'react-datatable';




export default class subscribed extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            name: '',
            subject : '',
            comments : '',
            contact_list : '',
            index : 0,
           
            
        };
        this.loginData = (!Cookies.get('loginSuccessdigiphyNFTAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessdigiphyNFTAdmin'));
        // this.onChange = this.onChange.bind(this);

        this.columns = [
            
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
              },
           
            {
                key: "email",
                text: "email",
                sortable: true
            }, 
           
            {
                key: "datetime",
                text: "Time",
                sortable: true
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

        

    componentDidMount() {
        
         this.contactList();
    }

    async contactList() {
        await    axios.get(`${config.apiUrl}getSubscriber`, {}, )
                .then(result => {
                    
                    if (result.data.success === true) {
                        this.setState({
                            contact_list: result.data.response
                        })
                        
                       
                    }
    
                    else if (result.data.success === false) {
    
                    }
                })
    
                .catch(err => {
                })
        }
 

    

    
    



   




    render() {

        return (

            <>

                <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div>
                <ToastContainer />
                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">

                    {/* <!-- Top Menu Items --> */}
                    <Header />
                    {/* <!-- /Top Menu Items --> */}

                    {/* <!-- Left Sidebar Menu --> */}
                    <Leftsidebar />
                    
                 

                    {/* <!-- Main Content --> */}
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="">Users Subscribed Details</h5>
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
                                    <div className="" id="contact">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="form-wrap">
                                                    <form action="#">
                                                       
                                                        {/* <hr className="light-grey-hr" /> */}
                                                        <div className="row">
                                                          
                                                        </div>
                                                       


                                                        <div className="form-actions">
                                                           
                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">

                                                    <div class="table-responsive">
                                                        {/* <table class="table table-striped mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>User Name</th>
                                                                    <th>Full Name</th>

                                                                    <th>Email</th>
                                                                    <th>Email Verify</th>
                                                                    <th>Talent Status</th>
                                                                    <th>Talent Action</th>
                                                                    <th>Action</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.user_list.map(item => (
                                                                    <tr>

                                                                        <td>{item.id}</td>
                                                                        <td>{item.user_name}</td>
                                                                        <td>{item.your_name}</td>

                                                                        <td>{item.email}</td>
                                                                        <td>{(item.is_email_verify === 0) ? 'Not Verified' : "Verified"}</td>
                                                                        <td class="text-nowrap">

                                                                            {item.telent_status === 0 ? <span style={{ color: 'yellow' }}>Pending</span> :
                                                                                item.telent_status === 1 ? <span style={{ color: 'green' }}>Approve</span> :
                                                                                    <span style={{ color: 'red' }}>Reject</span>}
                                

                                                                        </td>


                                                                        <td class="text-nowrap">
                                                                       
                                                                        {item.telent_status === 0 ? 
                                                                        <>
                                                                      
                                                                            <button type="submit" className=" btn-danger" onClick={this.updateRejectAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Reject </button>&nbsp;&nbsp;
                                                                            <button type="submit" className=" btn-success" onClick={this.updateApprovedAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Approve </button> 
                                                                 </>
                                                                 
                                                                            :item.telent_status === 1 ?
                                                                            <button type="submit" className=" btn-danger" onClick={this.updateRejectAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Reject </button>:
                                                                 <button type="submit" className=" btn-success" onClick={this.updateApprovedAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Approve </button> 


                                                                        }
                                                                        
                                                                    
        
                                                             </td>

                                                                        <td class="text-nowrap"><button className=" btn-danger" onClick={this.deleteUser.bind(this, item)} data-toggle="tooltip" data-original-title="Close"> <i class="fa fa-close m-r-10"></i> </button> </td>
                                                                        
                                                                    </tr>
                                                                ))}
                                                               
                                                                
                                                              
                                                                </tbody>
                                                        </table> */}

                                                        <ReactDatatable
                                               config={this.config}
                                               records={this.state.contact_list}
                                             columns={this.columns}
                                                                   /> 

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
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
