import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import config from './config/config'
import home from './components/home'
import marketplace from './components/marketplace'
import nftdetail from './components/nftdetail'
import create_an_item from './components/create_an_item'
import Swapdigiphy from './components/swapdigiphy'
import userprofile from './components/userprofile'
import login from './components/login'
import register from './components/register'
import authoredit from './components/authoredit'
import about from './components/about'
import faq from './components/faq'
import paymentsetting from './components/paymentsetting'
import salehistory from './components/salehistory'
import yourpurchase from './components/yourpurchase'
import VerifyAccount from './components/register'
import generatepassword from './components/generatepassword'
import resetpassword from './components/resetpassword'
import privacypolicy from './components/privacypolicy'
import termscondition from './components/termscondition'
import twoauthsecurity from './components/twoauthsecurity'
import aboutus from './components/aboutus'
import support from './components/support'
import purchasedetail from './components/purchasedetail'
import royalty from './components/royalty'
import usercollection from './components/usercollection';
import contactus from './components/contactus'
import bulk_item from './components/create_bulk_item';
import bulk_nft from './components/bulk_nft';
import product_pricing from './components/product_pricing';
import refund_pricing from './components/refund_policy';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={`${config.baseUrl}`} exact component={home} />
        <Route path={`${config.baseUrl}marketplace`} exact component={marketplace} />
        <Route path={`${config.baseUrl}:collection_name/:item_name/:id`} exact component={nftdetail} />
        <Route path={`${config.baseUrl}create_an_item`} exact component={create_an_item} />
        <Route path={`${config.baseUrl}swapdigiphy`} exact component={Swapdigiphy} />
        <Route path={`${config.baseUrl}userprofile/:user_id`} exact component={userprofile} />
        <Route path={`${config.baseUrl}collectiondetail/:collection_id`} exact component={usercollection} />
        <Route path={`${config.baseUrl}contactus`} exact component={contactus} />
        <Route path={`${config.baseUrl}login`} exact component={login} />
        <Route path={`${config.baseUrl}register`} exact component={register} />
        <Route path={`${config.baseUrl}authoredit`} exact component={authoredit} />
        <Route path={`${config.baseUrl}about`} exact component={about} />
        <Route path={`${config.baseUrl}faq`} exact component={faq} />
        <Route path={`${config.baseUrl}paymentsetting`} exact component={paymentsetting} />
        <Route path={`${config.baseUrl}salehistory`} exact component={salehistory} />
        <Route path={`${config.baseUrl}yourpurchase`} exact component={yourpurchase} />
        <Route path={`${config.baseUrl}verifyAccount/:token`} component={VerifyAccount} />
        <Route path={`${config.baseUrl}generatepassword`} exact component={generatepassword} />
        <Route path={`${config.baseUrl}resetpassword`} exact component={resetpassword} />
        <Route path={`${config.baseUrl}resetpassword/:token`} component={resetpassword} />
        <Route path={`${config.baseUrl}privacypolicy`} component={privacypolicy} />
        <Route path={`${config.baseUrl}termscondition`} component={termscondition} />
        <Route path={`${config.baseUrl}googleauthentication`} component={twoauthsecurity} />
        <Route path={`${config.baseUrl}aboutus`} component={aboutus} />
        <Route path={`${config.baseUrl}support`} component={support} />
        <Route path={`${config.baseUrl}purchasedetail/:item_id_id`} component={purchasedetail} />
        <Route path={`${config.baseUrl}purchasedetail`} component={purchasedetail} />
        <Route path={`${config.baseUrl}royalty`} component={royalty} />
        <Route path={`${config.baseUrl}bulk_item`} component={bulk_item} />
        <Route path={`${config.baseUrl}bulk_nft`} component={bulk_nft} />
        <Route path={`${config.baseUrl}product_pricing`} component={product_pricing} />
        <Route path={`${config.baseUrl}refund_pricing`} component={refund_pricing} />
      </Switch>
    </BrowserRouter>
  );
}
export default App;




