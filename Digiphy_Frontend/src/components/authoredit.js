import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default class authoredit extends Component {
	constructor(props) {
		super(props)
		this.loginData = (!Cookies.get('loginDigiphyFrontend')) ? [] : JSON.parse(Cookies.get('loginDigiphyFrontend'));
		if (this.loginData.length === 0) {
			window.location.href = `${config.baseUrl}login`
		}
		this.state = {
			profileData: '',
			image_file: null,
			image_preview: '',
			image_file1: null,
			image_preview1: '',
			email: '',
			currentPassword: '',
			password: '',
			password2: '',
			twoAuthenticationData: '',
			enableTwoFactor: '',
			talentStatusAPIData: '',
			processButton: '',
			mobile_number: '',
			city: '',
			user_state: '',
			locality: '',
			shipping_address: '',
			landmark_address: "",
			pin_code: '',
			getShippingAddress: '',
			getBankDetail: '',
			account_name: '',
			account_email: '',
			account_number: '',
			bank_name: '',
			holder_name: '',
			beneficiary_name: ''
		}
		this.onChange = this.handleChange.bind(this);
		this.submitForm = this.submitForm.bind(this)
		this.onChange = this.handleChangePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this)
		this.onChange = this.handleTwoWay.bind(this)
		this.twoAuthenticationVerifyAPI = this.twoAuthenticationVerifyAPI.bind(this)
		this.handleChangeAddress = this.handleChangeAddress.bind(this)
		this.handleSubmitShippingAddress = this.handleSubmitShippingAddress.bind(this)
		this.handleSubmitBankDetail = this.handleSubmitBankDetail.bind(this)
	}

	componentDidMount() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		this.getProfilePicAPI();
		this.twoAuthenticationAPI()
		this.talentStatusAPI()
		this.getShippingAddressAPI()
		this.getBankDetailAPI()
	}

	async getShippingAddressAPI() {
		await axios({
			method: 'post',
			url: `${config.apiUrl}getshippingaddress`,
			data: { 'user_id': this.loginData.data?.id }
		})
			.then(result => {
				if (result.data.success === true) {
					this.setState({
						getShippingAddress: result.data.data,
					})
				}
				else if (result.data.success === false) {
				}
			}).catch(err => {
			});
	}


async getBankDetailAPI() {
		await axios({
			method: 'post',
			url: `${config.apiUrl}getbankdetail`,
			data: { 'user_id': this.loginData.data?.id }
		})
			.then(result => {
				console.log('result', result, this.state.getBankDetail)

				if (result.data.success === true) {
					this.setState({
						getBankDetail: result.data.data,
					})
				}
				else if (result.data.success === false) {
				}
			}).catch(err => {
				this.setState({
					getBankDetail: ''
				})
			});
	}

	async talentStatusAPI() {
		await axios({
			method: 'post',
			url: `${config.apiUrl}getTelentStatus`,
			data: { 'user_id': this.loginData.data?.id }
		})
			.then(result => {
				if (result.data.success === true) {
					this.setState({
						talentStatusAPIData: result.data.response[0]
					})
				}
				else if (result.data.success === false) {
				}
			}).catch(err => {
			});
	}
	//============================  Password change  ====================================
	handleChangePassword = e => {
		this.setState({
			[e.target.name]: e.target.value
	})
	}

	handleChange = event => {
		event.preventDefault()
		let value = event.target.value;
		this.setState(prevState => ({
			profileData: { ...prevState.profileData, [event.target.name]: value }
		}))
	}

	handleTwoWay = event => {
		event.preventDefault()
		if (event.target.checked === true && event.target.type === 'checkbox') {
			event.target.value = '1'
		}
		else if (event.target.checked === false && event.target.type === 'checkbox') {
			event.target.value = '0'
		}
		let value = event.target.value;
		this.setState(prevState => ({
			twoAuthenticationData: { ...prevState.twoAuthenticationData, [event.target.name]: value }
		}))

	}


	handleChangeAddress = event => {
		event.preventDefault()
		let value = event.target.value;
		this.setState(prevState => ({
			getShippingAddress: { ...prevState.getShippingAddress, [event.target.name]: value }
		}))
	}



	handleChangeBank = event => {
		event.preventDefault()
		let value = event.target.value;
		this.setState(prevState => ({
			getBankDetail: { ...prevState.getBankDetail, [event.target.name]: value }
		}))
	}

	async getProfilePicAPI() {
		await axios({
			method: 'post',
			url: `${config.apiUrl}getProfilePic`,
			headers: { "Authorization": this.loginData.Token },
			data: { "email": this.loginData.data?.user_email ? this.loginData.data?.user_email : this.loginData.data?.email }
		}).then(response => {
			if (response.data.success === true) {
				this.setState({
					profileData: response.data.response
				})
			}
		})
	}

	//================================================  Update information API integrate  =============
	handleImagePreviewAvatar = (e) => {
		let image_as_base64 = URL.createObjectURL(e.target.files[0])
		let image_as_files = e.target.files[0];
		this.setState({
			image_preview: image_as_base64,
			image_file: image_as_files,
		})
	}

	//================================================  Update information API integrate  =============
	handleImagePreviewBanner = (e) => {
		let image_as_base64 = URL.createObjectURL(e.target.files[0])
		let image_as_files = e.target.files[0];
		this.setState({
			image_preview1: image_as_base64,
			image_file1: image_as_files,
		})
	}

	async submitForm(e) {
		e.preventDefault()
		let formData = new FormData();
		formData.append('email', this.state.profileData.email);
		formData.append('profile_pic', this.state.image_file);
		formData.append('banner', this.state.image_file1);
		formData.append('user_name', this.state.profileData.user_name);

		axios({
			method: 'post',
			url: `${config.apiUrl}updateProfilePic`,
			headers: { "Authorization": this.loginData.Token },
			data: formData
		})
			.then(response => {
				if (response.data.success === true) {
					toast.success(response.data.msg, {
						position: toast.POSITION.TOP_CENTER
					});
					this.getProfilePicAPI()
					setTimeout(() => {
						window.location.reload()
					}, 1000);
				}

				else if (response.data.success === false) {
					toast.error(response.data.msg, {
						position: toast.POSITION.TOP_CENTER
					});
				}
			})

			.catch(err => {
				toast.error(err?.response?.data?.msg, {
					position: toast.POSITION.TOP_CENTER
				});

			})
	}

	//================================================= Update password ========================

	handleSubmit(e) {
		e.preventDefault();
		this.setState({
			processButton: 1
		})
		axios({
			method: 'post',
			url: `${config.apiUrl}changepassword`,
			headers: { "Authorization": this.loginData.Token },
			data: {
				email: this.state.profileData.email, currentPassword: this.state.currentPassword,
				password: this.state.password, password2: this.state.password2
			}
		})
			.then(result => {

				if (result.data.success === true) {
					this.setState({
						processButton: ''
					})
					toast.success(result.data.msg, {
						position: toast.POSITION.TOP_CENTER
					});
					setTimeout(() => {

						window.location.reload()
					});
				}
				else if (result.data.success === false) {
					this.setState({
						processButton: ''
					})
					toast.error(result.data.msg, {
						position: toast.POSITION.TOP_CENTER
					});
				}
			}).catch(err => {

				toast.error(err.response.data?.msg, {
					position: toast.POSITION.TOP_CENTER
				})
				this.setState({
					processButton: ''
				})
			})
	}

	//================================================= Update Shipping Address ========================

	handleSubmitBankDetail(e) {
		e.preventDefault();
		this.setState({
			processButton: 1
		})

		let data = {
			user_id: this.loginData.data.id,
			account_name: this.state.getBankDetail.account_name,
			account_email: this.state.getBankDetail.account_email,
			account_number: this.state.getBankDetail.account_number,
			bank_name: this.state.getBankDetail.bank_name,
			holder_name: this.state.getBankDetail.holder_name,
			beneficiary_name: this.state.getBankDetail.beneficiary_name,
			ifsc_code: this.state.getBankDetail.ifsc_code
		}
		axios({
			method: 'post',
			url: `${config.apiUrl}insertbankdetaill`,
			headers: { "Authorization": this.loginData.Token },
			data: data
		})
			.then(result => {

				if (result.data.success === true) {
					this.setState({
						processButton: ''
					})
					toast.success(result.data.msg, {
						position: toast.POSITION.TOP_CENTER
					});
					setTimeout(() => {

						window.location.reload()
					});
				}
				else if (result.data.success === false) {
					this.setState({
						processButton: ''
					})
					toast.error(result.data.msg, {
						position: toast.POSITION.TOP_CENTER
					});
				}
			}).catch(err => {

				toast.error(err.response.data?.msg, {
					position: toast.POSITION.TOP_CENTER
				})
				this.setState({
					processButton: ''
				})
			})
	}

	//================================================= Update Shipping Address ========================

	handleSubmitShippingAddress(e) {
		e.preventDefault();
		this.setState({
			processButton: 1
		})

		let data = {
			user_id: this.loginData.data.id,
			mobile_number: this.state.getShippingAddress.mobile_number,
			city: this.state.getShippingAddress.city,
			pin_code: this.state.getShippingAddress.pin_code,
			locality: this.state.getShippingAddress.locality,
			shipping_address: this.state.getShippingAddress.shipping_address,
			state: this.state.getShippingAddress.state,
			landmark_address: this.state.getShippingAddress.landmark_address
		}
		axios({
			method: 'post',
			url: `${config.apiUrl}updateshippingaddress`,
			headers: { "Authorization": this.loginData.Token },
			data: data
		})
			.then(result => {

				if (result.data.success === true) {
					this.setState({
						processButton: ''
					})
					toast.success(result.data.msg, {
						position: toast.POSITION.TOP_CENTER
					});
				}
				else if (result.data.success === false) {
					this.setState({
						processButton: ''
					})
					toast.error(result.data.msg, {
						position: toast.POSITION.TOP_CENTER
					});
				}
			}).catch(err => {
				toast.error(err.response.data?.msg, {
					position: toast.POSITION.TOP_CENTER
				})
				this.setState({
					processButton: ''
				})
			})
	}


	async twoAuthenticationAPI() {
		await axios({
			method: 'post',
			url: `${config.apiUrl}getQR`,
			headers: { "Authorization": this.loginData?.Token },
			data: { "email": this.loginData.data?.user_email, "user_id": this.loginData.data?.id }
		}).then(response => {
			if (response.data.success === true) {
				this.setState({
					twoAuthenticationData: response.data.response
				})
			}
		})
	}

	//==================================  twoupdateAuthentication ========================

	async twoAuthenticationVerifyAPI() {
		await axios({
			method: 'post',
			url: `${config.apiUrl}twoAuthenticationVerify `,
			headers: { "Authorization": this.loginData?.Token },
			data: { "email": this.loginData.data?.user_email, "user_id": this.loginData.data?.id, 'SecretKey': this.state.twoAuthenticationData.SecretKey, 'enableTwoFactor': this.state.twoAuthenticationData.enableTwoFactor }
		}).then(response => {
			if (response.data.success === true) {
				toast.success('2FA Authentication has been enabled successfully!', {
					position: toast.POSITION.TOP_CENTER
				});
				window.location.reload()
			}
		}).catch(err => {
			toast.error('Token mismatch', {
				position: toast.POSITION.TOP_CENTER
			})
		})
	}


	loading(id) {
		if (id == '1') {
			window.location.href = `${config.baseUrl}authoredit`
		}
		else if (id == '2') {
			window.location.href = `${config.baseUrl}about`
		}
		else if (id == '3') {
			window.location.href = `${config.baseUrl}salehistory`
		}
		else if (id == '4') {
			window.location.href = `${config.baseUrl}yourpurchase`
		}
		else if (id == '5') {
			window.location.href = `${config.baseUrl}paymentsetting`
		}
		else if (id == '6') {
			window.location.href = `${config.baseUrl}featurescreator/${this.loginData.data?.id}`

		}
		else if (id == '7') {
			window.location.href = `${config.baseUrl}royalty`
		}
		else if (id == '8') {
			window.location.href = `${config.baseUrl}bulk_nft`
		}

	}

	async textExpression(event) {
		return (event.charCode > 64 &&
			event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)
	};


	render() {
		return (
			<>
				<Header />
				<body className="page-login" >
					<div id="content-block">
						<div className="container be-detail-container userprofile">
							<div className="row">
								<div className="col-xs-12 col-md-3 left-feild">

									<div className="be-vidget" id="scrollspy">

										<div className="creative_filds_block">
											<ul className="ul nav">
												{this.state.talentStatusAPIData?.telent_status === 1 ?
													<li className="edit-ln" ><Link onClick={this.loading.bind(this, '6')} to={`${config.baseUrl}featurescreator/${this.loginData.data?.id}`}>My Profile</Link></li>
													: ''

												}
												<li className="edit-ln active" ><Link onClick={this.loading.bind(this, '1')} to={`${config.baseUrl}authoredit`}>Account Setting</Link></li>
												<li className="edit-ln" ><Link onClick={this.loading.bind(this, '2')} to={`${config.baseUrl}about`}>About</Link></li>
												<li className="edit-ln" ><Link onClick={this.loading.bind(this, '3')} to={`${config.baseUrl}salehistory`}>Sale history</Link></li>
												<li className="edit-ln" ><Link onClick={this.loading.bind(this, '4')} to={`${config.baseUrl}yourpurchase`}>Buy History</Link></li>
												<li className="edit-ln" ><Link onClick={this.loading.bind(this, '5')} to={`${config.baseUrl}paymentsetting`}>Wallet</Link></li>
												<li className="edit-ln" ><Link onClick={this.loading.bind(this, '7')} to={`${config.baseUrl}royalty`}>Royalty</Link></li>
																				</ul>
										</div>
									</div>
								</div>
								<div className="col-xs-12 col-md-9 _editor-content_">
									<div className="" data-sec="">
										<div className="be-large-post mb-4">
											<div className="info-block style-1">
												<div className="be-large-post-align "><h3 className="info-block-label">Account Setting</h3></div>
											</div>
											<div className="be-large-post-align">
												<ToastContainer />
												<div className="be-change-ava">
													<a className="be-ava-user style-2" href="javascript:void(0)">
														{this.state.image_preview === '' ?
															this.state.profileData.profile_pic === '' || this.state.profileData.profile_pic === null ?
																<img src="images/noimage.webp" className="image-auth" /> : <img className="image-auth" src={`${config.imageUrl1}${this.state.profileData.profile_pic}`} alt="" /> :
															<img className="image-auth" src={this.state.image_preview} />
														}
														<p class="mt-3">Profile Image</p>
													</a>

													<a className="be-ava-user style-2" href="javascript:void(0)">
														{this.state.image_preview1 === '' ?
															this.state.profileData.banner === '' || this.state.profileData.banner === null ?
																<img src="http://www.vigneshwartours.com/wp-content/uploads/2016/08/himachal-Pradesh-banner.jpg" className="image-auth" /> : <img className="image-auth" src={`${config.imageUrl1}${this.state.profileData.banner}`} alt="" /> :
															<img src={this.state.image_preview1} className="image-auth" />

														}<p class="mt-3">Cover Image</p>
													</a>
												</div>
											</div>
											<div className="be-large-post-align">
												<div className="row">
													<div className="col-xs-12 col-sm-12">
														<div className="input-group mb-4">
															<div className="custom-file">
																<input type="file" name="profile_pic" accept=".png,.jpg,.jpeg" onChange={this.handleImagePreviewAvatar} className="custom-file-input" id="inputGroupFile01" />
																<label className="custom-file-label" for="inputGroupFile01">Profile Picture</label>
															</div>
														</div>

														<div className="input-group mb-4">
															<div className="custom-file">
																<input type="file" name="banner" accept=".png,.jpg,.jpeg" onChange={this.handleImagePreviewBanner} className="custom-file-input" id="inputGroupFile01" />
																<label className="custom-file-label" for="inputGroupFile01">Cover Image</label>
															</div>
														</div>
													</div>
													<div className="input-col col-xs-12 col-sm-12">
														<div className="form-group fg_icon focus-2">
															<div className="form-label">User Name</div>
															<input className="form-input" type="text" name="user_name" onChange={this.handleChange} value={this.state.profileData.user_name ? this.state.profileData.user_name : ''} />
														</div>
													</div>

													<div className="input-col col-xs-12">
														<div className="form-group focus-2">
															<div className="form-label">Email Address</div>
															<input className="form-input" type="email" disabled name="email" onChange={this.handleChange} value={this.state.profileData.email} />
														</div>
													</div>


													<div className="col-xs-12 col-sm-12">
														<div className="mt-4">
															<a className="btn color-1 size-1 hover-1 btn-right" onClick={this.submitForm}>Update</a></div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="sec" data-sec="edit-password">
										<div className="be-large-post mb-4">
											<div className="info-block style-1">
												<div className="be-large-post-align"><h3 className="info-block-label">Password</h3></div>
											</div>
											<div className="be-large-post-align">
												<div className="row">
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label"> Old Password</div>
															<input className="form-input" type="password" placeholder="Old Password" autoComplete='off'
																name="currentPassword" onChange={this.handleChangePassword} value={this.state.currentPassword} />
														</div>
													</div>
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label"> New Password</div>
															<input className="form-input" type="password" placeholder="New Password"
																name="password" onChange={this.handleChangePassword} value={this.state.password} />
														</div>
													</div>
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label"> Confirm Password</div>
															<input className="form-input" type="password" placeholder="Repeat Password"
																name="password2" onChange={this.handleChangePassword} value={this.state.password2} />
														</div>
													</div>
													<div className="col-xs-12">
														{this.state.processButton === '' ?
															<a className="btn color-1 size-1 hover-1 btn-right"
																disabled={!this.state.password || !this.state.currentPassword || !this.state.password2} onClick={this.handleSubmit}>change password</a>
															: <a className="btn color-1 size-1 hover-1 btn-right"
																disabled>Processing...</a>
														}
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="sec" data-sec="edit-password">
										<div className="be-large-post mb-4">
											<div className="info-block style-1">
												<div className="be-large-post-align"><h3 className="info-block-label">Shipping Address</h3></div>
											</div>
											<div className="be-large-post-align">
												<div className="row">
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label">Mobile Number</div>
															<input className="form-input" type="text" placeholder="Mobile Number" autoComplete='off'
																onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} name="mobile_number" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.mobile_number} />
														</div>
													</div>
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label">Pin code</div>
															<input className="form-input" type="text" placeholder="Pin code"
																name="pin_code" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.pin_code} />
														</div>
													</div>
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label">Locality</div>
															<input className="form-input" type="text" placeholder="Locality"
																name="locality" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.locality} />
														</div>
													</div>
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label">Address</div>
															<input className="form-input" type="text" placeholder="Shipping Address"
																name="shipping_address" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.shipping_address} />
														</div>
													</div>
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label">City</div>
															<input className="form-input" type="text" placeholder="City"
																onKeyPress={this.textExpression} name="city" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.city} />
														</div>
													</div>
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label">State</div>
															<input className="form-input" type="text" placeholder="State"
																name="state" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.state} />
														</div>
													</div>
													<div className="input-col col-lg-6 col-sm-12">
														<div className="form-group focus-2">
															<div className="form-label">Landmark</div>
															<input className="form-input" type="text" placeholder="Landmark"
																name="landmark_address" onChange={this.handleChangeAddress} value={this.state.getShippingAddress.landmark_address} />
														</div>
													</div>

													<div className="col-xs-12">
														{this.state.processButton === '' ?
															<a className="btn color-1 size-1 hover-1 btn-right"
																disabled={!this.state.getShippingAddress.mobile_number || !this.state.getShippingAddress.shipping_address || !this.state.getShippingAddress.city || !this.state.getShippingAddress.locality || !this.state.getShippingAddress.pin_code || !this.state.getShippingAddress.state} onClick={this.handleSubmitShippingAddress}>Update Address</a>
															: <a className="btn color-1 size-1 hover-1 btn-right"
																disabled>Processing...</a>
														}
													</div>
												</div>
											</div>
										</div>
									</div>


									<div className="sec" data-sec="edit-password">
										<div className="be-large-post mb-4">
											<div className="info-block style-1">
												<div className="be-large-post-align"><h3 className="info-block-label">Bank Detail</h3></div>
											</div>
											<div className="be-large-post-align">
												<div className="row">
													<div className="input-col col-xs-6 col-sm-6">
														<div className="form-group focus-2">
															<div className="form-label">Account Name</div>
															<input className="form-input" type="text" placeholder="Account Name" autoComplete='off'
																name="account_name" onChange={this.handleChangeBank} value={this.state.getBankDetail.account_name} />
														</div>
													</div>
													<div className="input-col col-xs-6 col-sm-6">
														<div className="form-group focus-2">
															<div className="form-label">Account Email</div>
															<input className="form-input" type="text" placeholder="Account email"
																name="account_email" onChange={this.handleChangeBank} value={this.state.getBankDetail.account_email} />
														</div>
													</div>
													<div className="input-col col-xs-6 col-sm-6">
														<div className="form-group focus-2">
															<div className="form-label">Bank Name</div>
															<input className="form-input" type="text" placeholder="Bank Name"
																name="bank_name" onChange={this.handleChangeBank} value={this.state.getBankDetail.bank_name} />
														</div>
													</div>
													<div className="input-col col-xs-6 col-sm-6">
														<div className="form-group focus-2">
															<div className="form-label">IFSC Code</div>
															<input className="form-input" type="text" placeholder="Ifsc Code"
																name="ifsc_code" onChange={this.handleChangeBank} value={this.state.getBankDetail.ifsc_code} />
														</div>
													</div>
													<div className="input-col col-xs-6 col-sm-6">
														<div className="form-group focus-2">
															<div className="form-label">Account Number</div>
															<input className="form-input" type="text" placeholder="Account Number" onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }}
																name="account_number" onChange={this.handleChangeBank} value={this.state.getBankDetail.account_number} />
														</div>
													</div>
													<div className="input-col col-xs-6 col-sm-6">
														<div className="form-group focus-2">
															<div className="form-label">Holder Name</div>
															<input className="form-input" type="text" placeholder="Holder Name"
																name="holder_name" onChange={this.handleChangeBank} value={this.state.getBankDetail.holder_name} />
														</div>
													</div>
													<div className="input-col col-xs-6 col-sm-6">
														<div className="form-group focus-2">
															<div className="form-label">Beneficiary Name</div>
															<input className="form-input" type="text" placeholder="Beneficiary Name"
																name="beneficiary_name" onChange={this.handleChangeBank} value={this.state.getBankDetail.beneficiary_name} />
														</div>
													</div>

													<div className="col-xs-12">
														{this.state.processButton === '' ?
															<a className="btn color-1 size-1 hover-1 btn-right"
																disabled={!this.state.getBankDetail.account_name || !this.state.getBankDetail.account_email || !this.state.getBankDetail.account_number || !this.state.getBankDetail.bank_name || !this.state.getBankDetail.beneficiary_name} onClick={this.handleSubmitBankDetail}>Update Bank Detail</a>
															: <a className="btn color-1 size-1 hover-1 btn-right"
																disabled>Processing...</a>
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


					<div id="two-factor-modal" className="modal fade" role="dialog" style={{ display: "none" }} aria-hidden="true">
						<div className="modal-dialog  modal-dialog-centered">
							{/* <!-- Modal content--> */}
							<div className="modal-content no-padding">
								<div className="modal-body">
									<div className="row">
										<div className="col-12 text-right">
											<button type="button" className="close" data-dismiss="modal">×</button>
										</div>
									</div>
									<div className="row justify-content-center mt-1 mb-3">
										<h4 className="modal-title text-center">Two-Factor Verification</h4>
									</div>
									<div className="row justify-content-center text-center modal-content-padding">
										<p>Check your email for your one-time access code.</p>
										<p>Enter your code to <span className="with-confirm-text d-none">confirm your </span><span><strong className="two-factor-verification-reason">Enable Email 2FA.</strong></span></p>
									</div>
									<div className="row justify-content-center text-center px-4">
										<div id="two_factor_error_message" className="alert alert-danger d-none w-100" role="alert"></div>
									</div>
									<div className="row justify-content-center mt-1 mb-4">
										<div className="single-number">
											<div className="single-number-container">
												<div className="single-number-input">
													<div className="single-number-input-container">
														<div className="single-number-input-item single-number-input-item-0">
															<input type="number" pattern="\d*" min="0" max="9" />
														</div>
														<div className="single-number-input-item single-number-input-item-1">
															<input type="number" pattern="\d*" min="0" max="9" />
														</div>
														<div className="single-number-input-item single-number-input-item-2">
															<input type="number" pattern="\d*" min="0" max="9" />
														</div>
														<div style={{ marginTop: "-25px" }}>
															<span className="input-seperator">.</span>
														</div>
														<div className="single-number-input-item single-number-input-item-3">
															<input type="number" pattern="\d*" min="0" max="9" />
														</div>
														<div className="single-number-input-item single-number-input-item-4">
															<input type="number" pattern="\d*" min="0" max="9" />
														</div>
														<div className="single-number-input-item single-number-input-item-5">
															<input type="number" pattern="\d*" min="0" max="9" />
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="row justify-content-center m-3">
										<button id="two-factor-modal-confirm-button" type="button" className="btn btn-primary btn-lg btn-ext-padding" disabled="">Confirm</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</body>
				<Footer />
			</>
		)
	}

}