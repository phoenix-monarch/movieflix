import SearchPage from "@/components/Search";
import { addEpisode, deleteEpisode, updateFavoriteMovies, updateRecentlyWatched } from "@/redux/reducers/recentlyWatchedReducers";

import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Movies() {
  const dispatch = useDispatch();
  const recentlyWatched = useSelector(
    (state) => state.recentlyWatched.recentlyWatched
  );
  const movies = useSelector((state) => state.recentlyWatched.favoriteMovies);

  useEffect(() => {
    const storedTVState = localStorage.getItem("recentlyWatchedTvShow");
    const storedMovieState = localStorage.getItem("favoriteMovies");

    if (storedTVState && storedMovieState)
    {
      const parsedTVState = JSON.parse(storedTVState);
      const parsedMovieState = JSON.parse(storedMovieState);

      dispatch(updateRecentlyWatched(parsedTVState));
      dispatch(updateFavoriteMovies(parsedMovieState));
    }

  }, [dispatch]);


  return (
    <div>
      <Head>
        <title>Spicy-TV</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
      </Head>
      <SearchPage />

      {recentlyWatched && recentlyWatched.length > 0 && (
        <div className="flex flex-col w-11/12 overflow-x-scroll p-2 space-x-2 scrollbar-hide mx-auto ">
          <div className="text-2xl text-white mt-6 mb-2">Recently Watched TV Shows</div>
          <div className="flex flex-nowrap text-white">
            {recentlyWatched.map((e) => (
              <div key={e.tvid} className="episode-card flex-none relative w-64 h-36 mb-2 mx-2 rounded-lg max-w-xs">
                <div className="overlay absolute inset-0 bg-black opacity-50 rounded-lg"></div>
                <div className="episode-img-container w-full h-full rounded-lg overflow-hidden">
                  <img className="w-full h-full object-cover" src={e.episode.img?.hd} alt={`Episode ${e.episode.number}`} />
                </div>

                <div className="delete-btn absolute top-2 right-2">
                  <button className="bg-black rounded-full border-white border p-2 hover:scale-110 duration-150" onClick={() => dispatch(deleteEpisode(e.tvid))}>
                    <svg viewBox="0 0 512 512" fill="currentColor" height="1em" width="1em">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M400 256H112"></path>
                    </svg>
                  </button>
                </div>

                <div className="play-btn absolute top-2 left-2">
                  <Link key={e.tvid} href={`/${e.tvid}`}>
                    <button className="bg-white text-black border-black border-2 rounded-full hover:scale-110 duration-150 p-2">
                      <svg fill="currentColor" viewBox="0 0 16 16" height="1em" width="1em">
                        <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"></path>
                      </svg>
                    </button>
                  </Link>
                </div>

                <Link key={e.tvid} href={`/${e.tvid}`}>
                  <div className="episode-info absolute bottom-2 w-full px-4 text-white">
                    <h3 className="text-lg font-semibold line-clamp-1">{e.episode.title}</h3>
                    <p className="text-sm text-gray-400">S{e.episode.season} E{e.episode.episode}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      )}



      {
        movies && movies.length > 0 &&
        <div className="overflow-x-auto mx-auto mb-10 w-11/12 ">
            <div className="text-xl text-white mt-6  mb-2">
            Movies WatchList
          </div>
          <div className="flex overflow-x-scroll p-2 space-x-4 scrollbar-hide mx-auto ">
            {movies.map((e) => <Link key={e.movieid} href={`/movie/${e.movieid}`}>
              <div className="flex-none w-32 lg:w-40">
                <div className="relative">
                  <img
                    className="object-cover w-full h-48 lg:h-56 rounded-lg shadow-md transform transition-all duration-500"
                    src={e.deets.image}
                    alt={e.deets.title}
                  />
                  <div className="absolute flex flex-col-reverse inset-0 p-2 bg-gradient-to-t from-black w-full ">
                    <p className="text-xs text-white/40">
                      {e.deets.releaseDate}
                    </p>
                    <p className="text-xs text-white/40">
                      <span className="text-red-500">
                        {" "}
                        {e.deets.type}
                      </span>{" "}
                      • {e.deets.rating.toFixed(1)}⭐
                    </p>
                    <h3 className="text-white  text-sm lg:text-lg  ">
                      {e.deets.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>)
            }</div></div>}
    </div>
  );
}

export default function Home() {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <Movies />
    </SWRConfig>
  );
}
