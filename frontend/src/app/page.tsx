import { Overview } from "@/ui/overview";
import Image from "next/image";

const Home = () => {
  return (
    <div className='w-full h-screen bg-white relative overflow-y-scroll pt-6 sm:pb-14 sm:pt-4 sm:w-4/5 sm:h-full sm:rounded-2xl sm:m-auto sm:mt-12'>
      <div className='px-4 pt-8 pb-4 mb-4 bg-white px-12 text-center'>
        <h1 className='text-[25px] sm:text-[32px] text-[#000075] font-bold'>Daily electricity statistics</h1>
      </div>
      <Overview />
  </div>
  );
}
export default Home