import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDoc,getDocs,deleteDoc,doc,onSnapshot  } from "firebase/firestore";
import {db} from './config/firestore';
import { toast } from "react-toastify";

let username = sessionStorage.getItem('username')

const Home = () => {
    const usenavigate = useNavigate();
   /* const [email, emailupdate] = useState('');
    const [user, setUser] = useState('');
    const [name, usernameupdate] = useState('');
    const [password, passwordupdate] = useState('');*/
    let email
    let user
    let password
    let name
   
    useEffect(() => {
        getUserInfo()


    }, []);



    return (
        <div>
            
            <h1 className="home" >Welcome to Sp6 Movies</h1>
            {<table className="table table-bordered">
                <thead>
                    <tr>
                        <td>User</td>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Password</td>
                       
                    </tr>
                </thead>
                <tbody>
                    {
                            <tr > 
                                <td>{user}</td>
                                <td>{name}</td>
                                <td>{email}</td>
                                <td>{password}</td>
                                
                            </tr>

                        
                    }
                </tbody>

            </table> }
        </div>
    );
}

export default Home;