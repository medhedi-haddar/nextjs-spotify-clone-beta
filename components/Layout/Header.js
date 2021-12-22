import { ExternalLinkIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { signIn } from "next-auth/react" 

function Header({providers}) {
  
    const { data: session } = useSession();
    const headerDiv = useRef()
    const dropDownMenu = useRef()
    const [dropdownActive,setDropdownActive] = useState(false);
    const handleDorpdown = () => { 
        dropdownActive ? setDropdownActive(false) : setDropdownActive(true);
    }

    const handleClickOutside = (event) => {
        if (dropDownMenu.current && !dropDownMenu.current.contains(event.target)) {
            setDropdownActive(false)
        }
    };

    
    // useEffect(() => {
    //     document.addEventListener('click', handleClickOutside, true);
    //     const historyNavigation = localStorage.getItem('historyNavigation');
    //     localStorage.setItem('historyNavigation',
    //     {
    //         ...historyNavigation,
    //         currentPath : router.asRouter
    //     }
    //     )
    // }, [router.asPath])
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
    }, [])

    return (
        <>
        {!session && 

         providers ? Object.values(providers).map((provider) => (
         
          <div className={`sticky flex justify-end items-center top-0 right-0 px-5 py-3 z-30 w-[100%] bg-zinc-900`} >

              <div  onClick={() => signIn(provider.id, { callbackUrl : "/"})} type="button" 
              className="flex relative width-w-screen items-center spaces-x-3 bg-white  hover:opacity-80 cursor-pointer rounded-full px-4 py-2"
              id="menu-button" aria-expanded="true" aria-haspopup="true" >
                  Connexion   
              </div>
          </div>
        ))
        : ''
        }
        {
        session && 
        <div className={`sticky flex justify-between items-center top-0 right-0 px-5 py-3 z-30 w-[100%] text-white `} ref={headerDiv} >

            <div className="flex">
                <button  onClick={() => router.back()} className="ml-1 flex justify-center  items-center h-8 w-8 bg-black/50 hover:bg-black transition-all duration-100 ease-in-out rounded-full"> 
                <IoIosArrowBack/>
            </button>
                <button onClick={() => router.beforePopState()}  className="ml-1 flex justify-center  items-center h-8 w-8 bg-black/50 hover:bg-black transition-all duration-100 ease-in-out rounded-full">
                    <IoIosArrowForward/>
                </button> 
            </div>
            <div onClick={handleDorpdown} type="button" 
                className=" flex relative width-w-screen items-center spaces-x-3 bg-black/80  hover:opacity-80 cursor-pointer rounded-full p-0.5 pr-2"
                id="menu-button" aria-expanded="true" aria-haspopup="true" >
                
                <img className="rounded-full w-9 h-9" src={session?.user.image}/>
                <h2 className="pl-2 pr-1 text-[0.8rem] font-light">{session?.user.name}</h2>
                <IoMdArrowDropdown className="h-5 w-5"/>
            </div>
        
            <div className={`${!dropdownActive ? 'hidden' : 'absolute'} origin-top-right  right-5 mt-[170px] w-56 rounded-md shadow-lg  
                bg-neutral-900 text-white ring-1 ring-black focus:outline-none`} role="menu" ref={dropDownMenu}>
                <div className="py-1" role="none">
                    <a href="#" className="flex justify-between items-center text-zinc-100 hover:bg-neutral-800  px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-0">Account <ExternalLinkIcon className="w-5 text-zinc-400"/></a>
                    <a href="#" className="text-zinc-100 hover:bg-neutral-800 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-1">Profile</a>
                    
                    <button type="submit" className="text-zinc-100 border-t border-neutral-700 border- hover:bg-neutral-800 block w-full text-left px-4 py-2 text-sm" role="menuitem" tabIndex="-1" id="menu-item-3" onClick={() => signOut()}>
                        Sign out 
                    </button>
                </div>
            </div>
        </div>  
        }
        </>
    )
}

export default Header
