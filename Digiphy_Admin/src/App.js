import logo from './logo.svg';
import './App.css';
//==================================  Import all dependencies  ============================

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import config from './config/config'
import login from './components/login'
import dashboard from './components/dashboard'
import Header from './directives/header'
import Leftsidebar from './directives/leftsidebar'
import Footer from './directives/footer'
import product from './components/product'
import category_list from './components/categorylist'
import users from './components/users'
import changePassword from './components/changepassword'
import changeProfile from './components/changeprofile'
import icon from './components/icons'
import contact from './components/contact'
import usercollection from './components/usercollection'
import wallet from './components/wallet'
import royalty from './components/royalty'
import subscribed from './components/subscribed';
import faqs from './components/faqs';
import privacyAndPolicy from './components/privacyAndPolicy'
import termsAndCondition from './components/termsAndCondition'
import about from './components/about'
import create_an_item from './components/create_an_item';
import Productuser from './components/productuser';
import admincollection from './components/admincollection';
import bulk_item from './components/bulknft';
import create_bulk_item from './components/create_bulk_item'
import user_bank_detail from './components/bankdetail'
import transactions from './components/transactions'
import withdrawRequest from './components/withdraw-request';
import product_pricing from './components/product_pricing';
import refund_pricing from './components/refund_pricing';
import tokenManagement from './components/tokenManagement';
function App() {
  return (
    <BrowserRouter>
      <div>
        {/* <Menu /> */}
        <Switch>
          <Route path={`${config.baseUrl}`} exact component={login} />
          <Route path={`${config.baseUrl}dashboard`} exact component={dashboard} />
          <Route path={`${config.baseUrl}product`} exact component={product} />
          <Route path={`${config.baseUrl}category`} exact component={category_list} />
          <Route path={`${config.baseUrl}users`} exact component={users} />
          <Route path={`${config.baseUrl}changepassword`} exact component={changePassword} />
          <Route path={`${config.baseUrl}changeprofile`} exact component={changeProfile} />
          <Route path={`${config.baseUrl}icons`} exact component={icon} />
          <Route path={`${config.baseUrl}contact`} exact component={contact} />
          <Route path={`${config.baseUrl}usercollection`} exact component={usercollection} />
          <Route path={`${config.baseUrl}wallet`} exact component={wallet} />
          <Route path={`${config.baseUrl}royalty`} exact component={royalty} />
          <Route path={`${config.baseUrl}subscribed`} exact component={subscribed} />
          <Route path={`${config.baseUrl}faqs`} exact component={faqs} />
          <Route path={`${config.baseUrl}privacyAndPolicy`} exact component={privacyAndPolicy} />
          <Route path={`${config.baseUrl}termsAndCondition`} exact component={termsAndCondition} />
          <Route path={`${config.baseUrl}about`} exact component={about} />
          <Route path={`${config.baseUrl}create_an_item`} exact component={create_an_item} />
          <Route path={`${config.baseUrl}productuser`} exact component={Productuser} />
          <Route path={`${config.baseUrl}admincollection`} exact component={admincollection} />
          <Route path={`${config.baseUrl}create_bulk_item`} exact component={create_bulk_item} />
          <Route path={`${config.baseUrl}bulk_item`} exact component={bulk_item} />
          <Route path={`${config.baseUrl}user_bank_detail`} exact component={user_bank_detail} />
          <Route path={`${config.baseUrl}transactions`} exact component={transactions} />
          <Route path={`${config.baseUrl}withdrawRequest`} exact component={withdrawRequest} />
          <Route path={`${config.baseUrl}product_pricing`} exact component={product_pricing} />
          <Route path={`${config.baseUrl}refund_pricing`} exact component={refund_pricing} />
          <Route path={`${config.baseUrl}tokenManagement`} exact component={tokenManagement} />
        </Switch>
      </div>
    </BrowserRouter>

  );
}

export default App;
