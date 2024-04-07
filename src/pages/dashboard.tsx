import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { AiOutlineDoubleLeft } from "react-icons/ai";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoChevronForwardOutline } from "react-icons/io5";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const myquery = api.categories.getCategories.useQuery({
    page: currentPage,
    limit: 6,
  });
  const mymutate = api.categories.markCategory.useMutation();
  const data = myquery.data;
  console.log(data, "data type");
  const categories: any = data?.categories;
  const totalItems = data?.totalItems as number;
  const totalPages = Math.ceil(totalItems / 6);
  console.log(categories);
  const [checkedStates, setCheckedStates] = useState<any>({});
  const checkedStatus: { [key: number]: boolean } = {};
  console.log(checkedStatus);
  useEffect(() => {
    if (categories) {
      categories.forEach((categories: any) => {
        checkedStatus[categories.id] = categories.UserCategory.length > 0;
      });

      setCheckedStates(checkedStatus);
    }
  }, [categories]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkedId = event.target.value;
    const checked = event.target.checked;

    // Update checkedStates
    setCheckedStates((prevStates: any) => ({
      ...prevStates,
      [checkedId]: checked,
    }));

    mymutate.mutateAsync({
      category_id: Number(checkedId),
    });
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    myquery.refetch();
  };

  const checkboxList = categories?.map((category: any, index: number) => {
    return (
      <div className="inline-flex items-center" 
      key={`${category.id}-${currentPage}-${index}-parent`}
      
      >
        <label
          key={`${category.id}-${currentPage}-${index}`}
          className="relative flex cursor-pointer items-center rounded-full p-3"
          htmlFor={category.id.toString()}
        >
          <input
            type="checkbox"
            className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
            id={category.id.toString()}
            checked={checkedStates[category.id] || false}
            value={category.id}
            onChange={handleCheckboxChange}
          />

          <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </label>
        <label htmlFor={category.id.toString()} key={category.id}>
          {category.name}
        </label>
      </div>
    );
  });
  const pages = () => {
    // return first  5 pages  , then current Page if it is not in first 5 pages and then .....
    if (currentPage <= 5) {
      return [...Array(5).keys()].map((i) => {
        return (
          <div
            className={`mx-2 cursor-pointer ${currentPage === i + 1 ? "text-black" : "text-gray-500"}`}
            key={i +1}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </div>
        );
      });
    } else {
      return (
        <>
          <div
            className={`mx-2 cursor-pointer ${currentPage === 1 ? "text-black" : "text-gray-500"}`}
            onClick={() => goToPage(1)}
          >
            1
          </div>
          <div className="mx-2 cursor-pointer text-gray-500">...</div>
          <div
            className={`mx-2 cursor-pointer ${currentPage === currentPage ? "text-black" : "text-gray-500"}`}
            onClick={() => goToPage(currentPage)}
          >
            {currentPage}
          </div>
        </>
      );
    }
  };
  return (
    <div className="flex h-auto justify-center">
      <div className="my-20 flex h-auto w-1/4 flex-col rounded-2xl border-2 p-10 [&>*]:p-5">
        <div className="flex w-full flex-col items-center">
          <div className="my-5 text-3xl  font-semibold">
            Please mark your interests
          </div>
          <div className="text-1xl  ">We will keep you notified</div>
        </div>
        <div className="text-2xl font-medium">My Saved interests!</div>
        <div className="flex w-full flex-col justify-center [&>*]:py-5">
          {checkboxList}
        </div>

        <div className="flex justify-center">
          <div>
            <AiOutlineDoubleLeft onClick={() => goToPage(1)} />
          </div>
          <div>
            <IoChevronBackOutline onClick={() => goToPage(currentPage - 1)} />
          </div>
          <div className="flex">
            {pages()}
            <div>....</div>
          </div>
          <div>
            <IoChevronForwardOutline
              onClick={() => goToPage(currentPage + 1)}
            />
          </div>
          <div>
            <AiOutlineDoubleRight onClick={() => goToPage(totalPages)} />
          </div>
        </div>
      </div>
    </div>
  );
}
