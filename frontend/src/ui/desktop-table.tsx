import { OverviewData } from "@/types/globals";
import { useState } from "react";

interface DesktopTableProps {
  paginatedData: OverviewData[];
  sortValue: string;
  sortOrder: string;
  handleSort: (value: string, order: string) => void;
  openDailyViewPopup: (date: string) => void;
}

export const DesktopTable = ({ paginatedData, sortValue, sortOrder, handleSort, openDailyViewPopup }: DesktopTableProps) => {

  return (
    <table className='w-screen hidden table-auto border-collapse sm:table text-left sm:w-full rounded-md shadow-sm'>
      <thead>
        <tr className='text-[#59677D] text-xs h-12 border-b text-center sm:h-9'>
          <th className='border-r border-t-2 border-transparent hover:bg-[#0000750a] hover:border-[#59677D1A]'>
            <button className={`text-[#59677D] text-xs rounded-md w-full h-9 text-xs`} onClick={() => handleSort('date', sortValue !== 'date' ? 'desc' : sortOrder === 'desc' ? 'asc' : 'desc')}>
              <div className="flex items-center justify-center gap-2">
                <p>Date</p>
                <p className={`${sortValue !== 'date' && 'invisible'}`}>{sortOrder === 'asc' ? '↑' : '↓'}</p>
              </div>
            </button>
          </th>
          <th className='border-x border-t-2 border-transparent hover:bg-[#0000750a] hover:border-[#59677D1A]'>
            <button className={`text-[#59677D] text-xs rounded-md w-full h-9 text-xs`} onClick={() => handleSort('totalConsumption', sortValue !== 'totalConsumption' ? 'desc' : sortOrder === 'desc' ? 'asc' : 'desc')}>
              <div className="flex items-center justify-center gap-2">
                <p>Total Consumption</p>
                <p className={`${sortValue !== 'totalConsumption' && 'invisible'}`}>{sortOrder === 'asc' ? '↑' : '↓'}</p>
              </div>
            </button>
          </th>
          <th className='border-x border-t-2 border-transparent hover:bg-[#0000750a] hover:border-[#59677D1A]'>
            <button className={`text-[#59677D] text-xs rounded-md w-full h-9 text-xs`} onClick={() => handleSort('totalProduction', sortValue !== 'totalProduction' ? 'desc' : sortOrder === 'desc' ? 'asc' : 'desc')}>
              <div className="flex items-center justify-center gap-2">
                <p>Total Production</p>
                <p className={`${sortValue !== 'totalProduction' && 'invisible'}`}>{sortOrder === 'asc' ? '↑' : '↓'}</p>
              </div>
            </button>
          </th>
          <th className='border-x border-t-2 border-transparent hover:bg-[#0000750a] hover:border-[#59677D1A]'>
            <button className={`text-[#59677D] text-xs rounded-md w-full h-9 text-xs`} onClick={() => handleSort('avgPrice', sortValue !== 'avgPrice' ? 'desc' : sortOrder === 'desc' ? 'asc' : 'desc')}>
              <div className="flex items-center justify-center gap-2">
                <p>Avg. Price</p>
                <p className={`${sortValue !== 'avgPrice' && 'invisible'}`}>{sortOrder === 'asc' ? '↑' : '↓'}</p>
              </div>
            </button>
          </th>
          <th className='border-l border-t-2 border-transparent hover:bg-[#0000750a] hover:border-[#59677D1A]'>
            <button className={`text-[#59677D] text-xs rounded-md w-full h-9 text-xs`} onClick={() => handleSort('longestNegStreak', sortValue !== 'longestNegStreak' ? 'desc' : sortOrder === 'desc' ? 'asc' : 'desc')}>
              <div className="flex items-center justify-center gap-2">
                <p>Longest Neg. Hours</p>
                <p className={`${sortValue !== 'longestNegStreak' && 'invisible'}`}>{sortOrder === 'asc' ? '↑' : '↓'}</p>
              </div>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map((row: OverviewData, index: number) =>
          <tr key={index} onClick={() => openDailyViewPopup(row.date)} className='text-xs border-y h-12 p-2 sm:h-9 cursor-pointer hover:bg-[#0000750a]'>
              <td className='border-r text-center'>{row.date}</td>
              <td className='border-x text-center'>{row.date ? (row.totalConsumption?.toFixed(2) || '-') : ''}</td>
              <td className='border-x text-center'>{row.date ? (row.totalProduction?.toFixed(2) || '-') : ''}</td>
              <td className='border-x text-center'>{row.date ? (row.avgPrice?.toFixed(2) || '-') : ''}</td>
              <td className='border-l text-center'>{row.date ? (row.longestNegStreak || '-') : ''}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
};