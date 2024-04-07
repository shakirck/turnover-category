import { PiShoppingCartSimple } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";
const Navbar = () => {
    return (
        <div className="bg-[#FFFFFF] flex-col w-full p-2 ">
          <div className="top flex justify-end text-sm">
            <div className="p-2 px-10">Help</div>
            <div className="p-2">Orders and returns</div>
            <div className="p-2">Hi Jhons</div>
          </div>
          <div className="bottom flex justify-between ">
          <div className="logo font-bold text-xl"  >
               <Link href="/">
               ECOMMERCE
               </Link>
            </div>
            <div className="links flex justify-evenly list-none p-1 text-lg">
                <li className="p-2 font-semibold ">Categories</li>
                <li className="p-2 font-semibold ">Sale</li>
                <li className="p-2 font-semibold ">Cleareance</li>
                <li className="p-2 font-semibold ">New Stock</li>
                <li className="p-2 font-semibold ">Trending</li>
            </div>
            <div className="icons flex">
                <div className="search px-2 text-2xl">
                    <IoIosSearch/>
                </div>
                <div className="cart px-2 text-2xl">
                    <PiShoppingCartSimple/>
                </div>
            </div>
          </div>
        </div>
    );
    }

export default Navbar;