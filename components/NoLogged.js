import { BsSpotify } from 'react-icons/bs';

function NoLogged() {
    return (
        <div className="flex flex-col items-center text-gray-500 bg-black min-h-screen justify-start pt-20" >
              <BsSpotify size="190" className="mb-5" color="gray" />
            <p className=" text-sm text-center">spotify Removed the Unauthenticated calls to the Web API. <br/>So to see the home page content you have to Signin </p>
            <br/>
            <a className="text-green-300 hover:text-cyan-700"
            target="_blank"
            href="https://developer.spotify.com/community/news/2017/01/27/removing-unauthenticated-calls-to-the-web-api/"> Link to the article</a>
        </div>
    )
}

export default NoLogged
