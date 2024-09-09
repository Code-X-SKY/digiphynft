import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';

export default class aboutus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      getAboutData: [],
    };
  }

  async getFaqList() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getAbout`,
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({ getAboutData: res.data.response[0] })
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
        <>
          <div id="content-block" className="mb-0">
            <div className="head-bg">
              <div className="head-bg-img"></div>
              <div className="head-bg-content" >
                <h1>About Us</h1>
              </div>
            </div>
            <div className="container">
              <div className="info-blocks" style={{ background: "transparent" }}>
                <div className="info-entry left table-block">
                  <div className="row table-row">
                    <p style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: this.state.getAboutData?.about }}></p>
                  </div>
                </div>
                <br /><br />
              </div>
            </div>
          </div>
        </>
        <Footer />
      </>
    )
  }
}