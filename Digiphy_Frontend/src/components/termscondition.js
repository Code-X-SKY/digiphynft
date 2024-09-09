import React, { Component } from 'react';
 import axios from 'axios';
 import Header from '../directives/header'
 import Footer from '../directives/footer'
 import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const headers = {
    'Content-Type': 'application/json'
 };

export default class termscondition extends Component {

    constructor(props) {
        super(props)
        this.state = {
          landingPage : '',
      }
    }

    componentDidMount() {
      this.getTermsConditions();
  }    

 async getTermsConditions() {
  await axios({
      method: 'get',
      url: `${config.apiUrl}getTermsConditions`
  })
      .then(response => {
          if (response.data.success === true) {
              // alert('333')
              this.setState({
                  landingPage: response.data.response[0]
              }) 
              
          }
      })
  }

    render() {
        return (    

            <>
            <Header/>

            <div id="content-block">
            <div class="breadcrumb-wrap bg-f" style={{backgroundImage:"url('images/termscondition.jpg')"}}>
                        <div class="overlay bg-black op-7">
                        </div><div class="container">
                            <div class="breadcrumb-title text-center">
                                <h2>Terms of Service</h2>
                            </div>
                        </div>
                    </div>
         <div className="container be-detail-container privacy_policy">
            {/* <h2 className="content-title text-white">Terms of Service</h2> */}
            <div className="row">
               <div className="col-xs-12 col-sm-12 text-white" dangerouslySetInnerHTML={{__html:this.state.landingPage?.terms_conditions}}>
               </div>
            </div>
         </div>
      </div>


            <Footer/>
            </>
        )
    }
}