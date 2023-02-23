import Card from "@/components/Card";
import SearchPage from "@/components/Search";
import Head from "next/head";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Movies() {
  const { data: shows, isLoading: popularIsLoading } = useSWR(
    "https://api.consumet.org/movies/flixhq/recent-shows",
    fetcher
  );
  console.log(popularIsLoading, shows);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchPage />
      {popularIsLoading ? (
        <div>Loading</div>
      ) : (
        <div className=" overflow-hidden flex flex-wrap relative z-10 p-2  space-x-1 ">
          {shows.map((e) => (
            <Link key={e.id} as={e.id} href={`/${e.id}`}>
              <Card title={e.title} type={e.type} image={e.image} />
            </Link>
          ))}
        </div>
      )}
 
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
