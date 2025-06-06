import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Provider as ReduxProvider } from "react-redux";
import { redux } from "./store/redux";
import './index.css';
import { Layout } from './components/layout';
import { Login } from './components/login';
import { LoginRedirect } from './components/login.redirect'
import { TestPage } from './components/testpage';

import { Trade } from './components/Trade';
//import { Gonggu } from './components/Gonggu';
import { Product } from './components/Product';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { UsedSell } from './components/UsedSell';
import { UsedShare } from './components/UsedShare';
import { UsedBuy } from './components/UsedBuy';
import { UsedCreate } from './components/UsedCreate';
import { UsedDetail } from './components/UsedDetail';
import { UsedUpdate } from './components/UsedUpdate';
import { UsedOrder } from './components/UsedOrder';


function Home() {

  return (
    <>
      <div>메인 페이지</div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ReduxProvider store={redux}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/login/redirect' element={<LoginRedirect />} />
            <Route path='/test' element={<TestPage />} />
            <Route path='/trade/gonggu' element={<Trade />} />
            <Route path='/trade/sell' element={<UsedSell />} />
            <Route path='/trade/share' element={<UsedShare />} />
            <Route path='/trade/buy' element={<UsedBuy />} />
            <Route path='/trade/write' element={<UsedCreate />} />
            <Route path='/trade/:id/:item/update' element={<UsedUpdate />} />
            <Route path='/trade/:id/:item/order' element={<UsedOrder />} />
            {/* :id: 파라미터 */}
            <Route path='/trade' element={<Trade />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/trade/:id/:item" element={<UsedDetail />} />
          </Routes>
        </Layout>
      </ReduxProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);