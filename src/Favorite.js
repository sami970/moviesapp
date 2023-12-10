import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {db} from './config/firestore';
import { collection, query, where, getDoc,getDocs,deleteDoc,doc,onSnapshot  } from "firebase/firestore";


const Favorite = () => {
    const [favoritlist, favoritupdate] = useState([]);
   
    const navigate=useNavigate();


    useEffect(() => {
        //GetUserAccess();
        loadfavorite();
       
       
    }, []);

    const loadfavorite = async (id) => {
         // Query a reference to a subcollection
         let userid = sessionStorage.getItem('username');

         const querySnapshot = await getDocs(collection(db, "favorites"));        
         const favoritlist = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
         const favoritlistCopy = favoritlist.filter(favoritFilm => favoritFilm.userid == userid);
         favoritupdate(favoritlistCopy)
 
         //console.log(favoritlist)
        
        
    }  

    function  handleremove (id) {
           
            const favoritlistCopy = favoritlist.filter(favoritFilm => favoritFilm.id !== id);            

            deleteDoc(doc(db, "favorites", id));
            
            favoritupdate(favoritlistCopy);

            // toast.success('removed')   
    }


    return (
        <div className="favorits">

            <div className="card">
                <div className="card-header">
                    <h3>Favorite Listing</h3>
                </div>
                <div className="card-body">
                   
                    <br></br>
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>User</th>
                                <th>Film name</th>
                                <th>Rate</th>
                                <th>Popularity</th>
                                <th>Number of votes</th>


                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favoritlist &&
                                favoritlist.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.userid}</td>
                                        <td>{item.filmname}</td>
                                        <td>{item.rate}</td>
                                        <td>{item.popularity}</td>
                                        <td>{item.vote_count}</td>

                                        <td>                                            
                                            <button onClick={() =>handleremove(item.id)} className="btn btn-danger">Remove</button>
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Favorite;