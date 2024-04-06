import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

const Banner = () => {
  return (
    <div className="py5 flex w-full justify-center bg-red-50 items-center p-2">
      <MdArrowBackIos  />

      <h1 className="mx-5">Get 10% off on businees purchasesr</h1>
      <MdArrowForwardIos />
    </div>
  );
};

export default Banner;
