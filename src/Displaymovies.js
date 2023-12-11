import {useEffect, useState} from "react"
import axios from 'axios'
import Movie from "./components/Movie"
import { toast } from "react-toastify";
import Youtube from 'react-youtube'
import {db} from './config/firestore';
import { collection, addDoc } from "firebase/firestore"; 


const Displaymovies = () => {
    const MOVIE_API = "https://api.themoviedb.org/3/"
    const movieUrl = `${MOVIE_API}movie`;
    const SEARCH_API = MOVIE_API + "search/movie"
    const DISCOVER_API = MOVIE_API + "discover/movie"
    const API_KEY = "2a99dc03f08c23158b2469263f803e70"
    const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280"
    const personUrl = MOVIE_API +"trending/person/week";

    const [playing, setPlaying] = useState(false)
    const [casts, setCasts] = useState([]);
    const [trailer, setTrailer] = useState(null)
    const [movies, setMovies] = useState([])
    const [searchKey, setSearchKey] = useState("")
    const [movie, setMovie] = useState({title: "Loading Movies"})
   

    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async (event) => {
        if (event) {
            event.preventDefault()
        }

        const {data} = await axios.get(`${searchKey ? SEARCH_API : DISCOVER_API}`, {
            params: {
                api_key: API_KEY,
                query: searchKey
            }
        })

       // console.log(data.results[0])
        setMovies(data.results)
        setMovie(data.results[0])

        if (data.results.length) {
            await fetchMovie(data.results[0].id)
        }
    }

     
    const fetchCasts = async (id) => {
        try {
            const { data } = await axios.get(`${movieUrl}/${id}/credits`, {
                params: {
                    api_key: API_KEY,
                }
            });
            const modifiedData = data['cast'].map((c) => ({
                id: c['cast_id'],
                character: c['character'],
                name: c['name'],
                img: 'https://image.tmdb.org/t/p/w200' + c['profile_path'],
            }))
    
            return modifiedData;
        } catch (error) { }
    }

    const saveFavorite  = async () => {
        let userid=""
        let filmname=""
        let rate =""
        let popularity =""
        let vote_count =""

        let newFavorites = {userid,filmname,rate,popularity,vote_count}
        newFavorites.userid = sessionStorage.getItem('username');
        newFavorites.filmname =movie.title;
        newFavorites.rate =movie.vote_average;
        newFavorites.popularity =movie.popularity;
        newFavorites.vote_count =movie.vote_count;

        console.log(movie)

        try {
            await addDoc(collection(db, "favorites"), {
              ...newFavorites
            });
            toast.success('Favorites successfully added.')
           
          } catch (error) {
            toast.error('Failed :' + error.message);
          }
    }

    const fetchMovie = async (id) => {
        const {data} = await axios.get(`${MOVIE_API}movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos"
            }
           
        }  )
       // console.log(data)

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(vid => vid.name === "Official Trailer")
            setTrailer(trailer ? trailer : data.videos.results[0])
        }

        setMovie(data)
    }


    const selectMovie = async (movie) => {
        fetchMovie(movie.id)
        setPlaying(false)
        setMovie(movie)
     
       setCasts(await fetchCasts(movie.id));
        window.scrollTo(0, 0)
    }

    const renderMovies = () => (
        movies.map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie.id}
                movie={movie}
            />
        ))
    )

    const castList = casts.slice(0, 4).map((c, i) => {
        return (
          <div className="col-md-3 text-center" key={i}>
            <img
              className="img-fluid rounded-circle mx-auto d-block"
              src={c.img}
              alt={c.name}
            ></img>
            <p className="font-weight-bold text-center">{c.name}</p>
            <p
              className="font-weight-light text-center"
              style={{ color: "#5a606b" }}
            >
              {c.character}
            </p>
          </div>
        );
      });

    return (
        <div className="App">
            <header className="center-max-size header">
                <span className={"brand"}>Movies App</span>
                <form className="form" onSubmit={fetchMovies}>
                    <input className="search" type="text" id="search"
                           onInput={(event) => setSearchKey(event.target.value)}/>
                    <button className="submit-search" type="submit"><i className="fa fa-search"></i></button>
                </form>
            </header>
            {movies.length ?
                <main>
                    {movie ?
                        <div className="poster"
                             style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`}}>
                            {playing ?
                                <>
                                    <Youtube
                                        videoId={trailer.key}
                                        className={"youtube amru"}
                                        containerClassName={"youtube-container amru"}
                                        opts={
                                            {
                                                height: '390',
                                                width: '640',
                                                playerVars: {
                                                    autoplay: 1,
                                                    controls: 0,
                                                    cc_load_policy: 0,
                                                    fs: 0,
                                                    iv_load_policy: 0,
                                                    modestbranding: 0,
                                                    rel: 0,
                                                    showinfo: 0,
                                                },
                                            }
                                        }
                                    />
                                    <button onClick={() => setPlaying(false)} className={"button close-video"}>Close
                                    </button>
                                </> :
                                <div className="center-max-size">
                                    <div className="poster-content">
                                        {trailer ?
                                            <button className={"button play-video"} onClick={() => setPlaying(true)}
                                                    type="button">PlayTrailer</button>

                                                    
                                            : 'Sorry, no trailer available'}
                                            <span>  </span>
                                            <button className={"button add-favorite"} onClick={() => saveFavorite(true)}
                                                    type="button">Add favorite</button>

                                        <h1>{movie.title}</h1>
                                        <p >{movie.overview}</p>

                                    </div>
                                </div>
                            }
                        </div>
                        : null}

                        <div className="row mt-3">
                            <div className="col">
                                <p style={{ color: "#5a606b", fontWeight: "bolder" }}>CASTS</p>
                            </div>
                        </div>
                        <div className="row mt-3">{castList}</div>

                    <div className={"center-max-size container"}>
                        {renderMovies()}
                    </div>
                </main>
                : 'Sorry, no movies found'}
        </div>
    );
}

export default Displaymovies;
