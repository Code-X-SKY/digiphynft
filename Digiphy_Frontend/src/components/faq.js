import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import {
   Accordion,
   AccordionItem,
   AccordionItemHeading,
   AccordionItemButton,
   AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

const headers = {
   'Content-Type': 'application/json'
};

export default class faq extends Component {

   constructor(props) {
      super(props)
      this.state = {
         faqLists: [],
      };


   }

   async getFaqList() {
      await axios({
         method: 'get',
         url: `${config.apiUrl}faqlist`,
      }).then((res) => {
         if (res.data.success === true) {
            this.setState({ faqLists: res.data.response })
         }

      }).catch((error) => {

      })
   }

   componentDidMount() {
      this.getFaqList();
   }

   render() {
      return (

         <>
            <Header />
            <div id="content-block">
               <div className="head-bg">
                  <div className="head-bg-img"></div>
                  <div className="head-bg-content">
                     <h1>Frequently Asked Questions</h1>
                  </div>
               </div>
               <div className="container cart-detail-container faq-box">
                  <div className="row">
                     <div className="col-xs-12">
                        <div className="tab-wrapper style-2">
                           <h3>FAQ</h3>
                           <br/>
                           <div className="accordion accordion-flush" id="accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                              <Accordion preExpanded={['a']}>
                                 {this.state.faqLists.map(item => (
                                    <AccordionItem>
                                       <AccordionItemHeading>
                                          <AccordionItemButton>
                                             {item.question}

                                          </AccordionItemButton>
                                       </AccordionItemHeading>
                                       <AccordionItemPanel>
                                          <p className='text-white'>
                                             {item.answer}

                                          </p>
                                       </AccordionItemPanel>
                                    </AccordionItem>
                                 ))}



                              </Accordion>

                           </div>
                        </div>
                     </div>

                  </div>
               </div>

            </div>
            <br />
            <br />
            <Footer />
         </>
      )
   }
}