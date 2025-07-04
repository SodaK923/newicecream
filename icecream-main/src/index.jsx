import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import { Provider as ReduxProvider } from "react-redux";
import { redux } from "./store/redux";
import './index.css';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { LoginRedirect } from './components/Login.redirect'
import { MyPage } from './components/Mypage';
import { TestPage } from './components/testpage';
import { Trade } from './components/Trade'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { UsedSell } from './components/UsedSell';
import { UsedShare } from './components/UsedShare';
import { UsedBuy } from './components/UsedBuy';
import { UsedCreate } from './components/UsedCreate';
import { UsedDetail } from './components/UsedDetail';
import { UsedUpdate } from './components/UsedUpdate';
import { Main } from './components/main';



function App() {
  return (
    <BrowserRouter>
      {/* 리덕스 사용 */}
      <ReduxProvider store={redux}>
        <Layout>
          <Routes>
            <Route path='/' element={<Main/>} />
            <Route path='/' element={<TestPage/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/login/redirect' element={<LoginRedirect/>} />
            <Route path='/my' element={<MyPage />} />
            <Route path='/my/:tap' element={<MyPage />} />
            <Route path='/my/:tap/:item' element={<MyPage />} />
            {/* 강수아 작업 -- 중고거래, 나눔, 판매 */}
            <Route path='/trade/sell' element={<UsedSell />} />
            <Route path='/trade/share' element={<UsedShare />} />
            <Route path='/trade/buy' element={<UsedBuy />} />
            <Route path='/trade/deal/register' element={<UsedCreate />} />
            <Route path='/trade/:id/:item/update' element={<UsedUpdate />} />
            <Route path="/trade/:id/:item" element={<UsedDetail />} />
            {/* 김종현 작업 -- 공구, 전체 */}
            <Route path='/trade' element={<Trade />} />
            <Route path='/trade/gonggu' element={<Trade />} />
            
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

