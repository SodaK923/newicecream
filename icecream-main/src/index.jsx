import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import { Provider as ReduxProvider } from "react-redux";
import { redux } from "./store/redux";
import './index.css';
import { Layout } from './components/layout';
import { Login } from './components/login';
import { LoginRedirect } from './components/login.redirect'
import { MyPage } from './components/Mypage';
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



function App() {
  return (
    <BrowserRouter>
      {/* 리덕스 사용 */}
      <ReduxProvider store={redux}>
        <Layout>
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/login/redirect' element={<LoginRedirect/>} />
            <Route path='/my' element={<MyPage />} />
            <Route path='/my/:tap' element={<MyPage />} />
            <Route path='/my/:tap/:item' element={<MyPage />} />
            <Route path='/test' element={<TestPage />} />
            <Route path='/trade/gonggu' element={<Trade />} />
            <Route path='/trade/sell' element={<UsedSell />} />
            <Route path='/trade/share' element={<UsedShare />} />
            <Route path='/trade/buy' element={<UsedBuy />} />
            <Route path='/trade/deal/register' element={<UsedCreate />} />
            <Route path='/trade/:id/:item/update' element={<UsedUpdate />} />
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

