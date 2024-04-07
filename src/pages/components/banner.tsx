import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

const Banner = () => {
  return (
    <div className="py5 flex w-full items-center justify-center bg-[#F4F4F4] p-2">
      <MdArrowBackIos />

      <h1 className="mx-5">Get 10% off on businees purchasesr</h1>
      <MdArrowForwardIos />
    </div>
  );
};

export default Banner;
