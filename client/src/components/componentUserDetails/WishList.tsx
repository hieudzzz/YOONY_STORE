
import { Pagination } from "antd"
import CardProductWishList from "../User/Products/CardProductWishList"
const WishList = () => {
    return (
        <>
            <div>
                <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                    <div>
                        <CardProductWishList />
                    </div>
                </div>
                <div className="mt-6 flex justify-center items-center ">
                    <button className="px-4 py-2  rounded hover:bg-primary text flex item-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                        </svg>

                        Previous
                    </button>
                    <Pagination defaultCurrent={1} total={100} showSizeChanger={false} />
                    <button className="px-4 py-2 rounded hover:bg-primary flex items-center">
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                </div>
            </div>

        </>


    )
}
export default WishList 

