import logo from './logo.svg';
import './App.css';
import Header from './MyComponents/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import React_href_xss from './MyComponents/React_href_xss';
import React_ref_innerHTML_xss from './MyComponents/React_ref_innerHTML_xss';
function App() {
  return (
    <>
    <Header/>
    <BrowserRouter>
      <Routes>
        <Route exact path="/react-href-xss" element={<React_href_xss/>}/>
        <Route exact path="/react-ref-innerHTML-xss"  element={<React_ref_innerHTML_xss/>}/>     
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
