import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Home from './Home';
import Login from './Login';
import Favorite from './Favorite';
import Displaymovies from './Displaymovies';
import Appheader from './Appheader';
import {ToastContainer} from "react-toastify";


function App() {
  return (
    <div className="App">
    <ToastContainer theme='colored' position='top-center'></ToastContainer>
     <BrowserRouter>
    
     <Appheader>  </Appheader>
     
     <Routes>     
        <Route path='/' element={<Home/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>  
        <Route path='/favorite' element={<Favorite/>}></Route>  
        <Route path='/displaymovies' element={<Displaymovies/>}></Route>        
      </Routes>
    
     </BrowserRouter> 
    </div>
  );
}

export default App;
