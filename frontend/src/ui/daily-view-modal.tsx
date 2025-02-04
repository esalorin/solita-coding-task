import { DailyData } from "@/types/globals";
import axios from "axios";
import { useEffect, useState } from "react";

interface DailyViewModalProps {
  date: string;
  closeModal: () => void;
}

// TODO: Finnish UI, add date selection, add data to the modal
export const DailyViewModal = ({ date, closeModal }: DailyViewModalProps) => {
  const [data, setData] = useState<DailyData>();
  const [queryDate, setQueryDate] = useState(date);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await axios.get(`http://localhost:3001/api/dailyview?date=${queryDate}&timezone=${userTimeZone}`);
        setData(response.data);
      } catch (err) {
        console.log("Failed to fetch data.");
      }
    };

    fetchData();
  },[])
  
  return (
    <div className="w-screen h-screen fixed top-0 left-0 sm:bg-[#59677D8A]">
      <div className="w-full h-full bg-white px-4 py-8 sm:w-4/5 sm:h-auto sm:rounded-2xl sm:relative sm:m-auto sm:mt-20">
        <button onClick={closeModal} className="absolute right-4 top-4">X</button>
        <div className='px-4 pt-8 pb-4 mb-4 bg-white px-12 text-center'>
          <h1 className='text-[25px] sm:text-[25px] text-[#000075] font-bold pb-10'>Daily electricity statistics for {queryDate}</h1>
          <div className='flex flex-wrap md:gap-20 justify-center'>
            <div className='mx-4 mb-7'>
              <p className='text-[#59677D] text-xs'>Average price</p>
              <p className='text-[#59677D] font-bold sm:text-sm'>{data?.avgPrice?.toFixed(2)}</p>
            </div>
            <div className='mx-4 mb-7'>
              <p className='text-[#59677D] text-xs'>Total consumption</p>
              <p className='text-[#59677D] font-bold sm:text-sm'>{data?.totalConsumption?.toFixed(2) ?? '-'}</p>
            </div>
            <div className='mx-4 mb-7'>
              <p className='text-[#59677D] text-xs'>Total production</p>
              <p className='text-[#59677D] font-bold sm:text-sm'>{data?.totalProduction?.toFixed(2) ?? '-'}</p>
            </div>
            <div className='mx-4 mb-7'>
              <p className='text-[#59677D] text-xs'>Cheapest hours</p>
              <p className='text-[#59677D] font-bold sm:text-sm'>{data?.cheapestHours.map(hour => hour + ':00').join(', ')}</p>
            </div>
            <div className='mx-4 mb-7'>
              <p className='text-[#59677D] text-xs'>Hour with most electricity consumption compared to production</p>
              <p className='text-[#59677D] font-bold sm:text-sm'>{data?.hourWithBiggestConsAndProdDiff ? data?.hourWithBiggestConsAndProdDiff + ':00' : '-'}</p>
            </div>
          </div>
        </div>
        <button onClick={closeModal} className="text-[#000075b9] text-base mx-auto w-full mt-8 sm:text-sm">Close</button>
      </div>
    </div>
  )
};