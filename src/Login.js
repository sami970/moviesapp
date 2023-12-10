import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {db} from './config/firestore';

import { collection, query, where, getDoc,getDocs,deleteDoc,doc,onSnapshot  } from "firebase/firestore";

const Login = () => {
    const [users, setUsers] = useState();
    const [username, usernameupdate] = useState('');
    const [password, passwordupdate] = useState('');

    const usenavigate=useNavigate();

    useEffect(()=>{
        sessionStorage.clear();
        
          getUsers();
    },[]);


    const getUsers = async () => {

        // Query a reference to a subcollection
        const querySnapshot = await getDocs(collection(db, "users"));        
        const users = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
        setUsers(users)

       // console.log(users)
 
     }
     
    
    const ProceedLogin = (e) => {
        e.preventDefault();
        if (validate()) {

            const [findUser] = users.filter(findUser => findUser.id === username);
            if(findUser === undefined)
            {
                toast.error('Please Enter valid username');
            } else
            {               
                if (findUser.password === password)
                {
                    toast.success('Success');
                    sessionStorage.setItem('username',username);
                    usenavigate('/')
                }else
                {
                    toast.error('Please Enter valid credentials');  
                }
            }   
      
        }
    }
    
    const validate = () => {
        let result = true;
        if (username === '' || username === null) {
            result = false;
            toast.warning('Please Enter Username');
        }
        if (password === '' || password === null) {
            result = false;
            toast.warning('Please Enter Password');
        }
        return result;
    }
    return (
        <div className="row">
            <div className="login" style={{ marginTop: '100px' }}>
                <form onSubmit={ProceedLogin} className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>User Id <span className="errmsg">*</span></label>
                                <input value={username} onChange={e => usernameupdate(e.target.value)} className="form-control"></input>
                            </div>
                            <div className="form-group">
                                <label>Password <span className="errmsg">*</span></label>
                                <input type="password" value={password} onChange={e => passwordupdate(e.target.value)} className="form-control"></input>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Login</button> |
                            <Link className="btn btn-success" to={'/register'}>New User</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;