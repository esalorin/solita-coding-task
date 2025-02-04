import { OverviewData } from "@/types/globals"
import { useState } from "react";

interface MobileTableProps {
  data: OverviewData[];
  sortValue: string;
  sortOrder: string;
  handleSort: (value: string, order: string) => void;
}

const MobileTableRows = ({ row, index }: { row: OverviewData, index: number }) => {
  return (
    <>
      <tr key={`${index}-date`} className={`sm:hidden text-xs text-center font-bold text-[#59677D] h-7 ${row.date && 'border-y-[1px] border-[#59677D1A]'}`}>
        <td colSpan={2}>{row.date}</td>
      </tr>
      <tr key={`${index}-consumption`} className="sm:hidden text-xs h-6">
        <td className="pl-6">{row.date ? 'Total Consumption' : ''}</td>
        <td className="pl-18">{row.date ? (row.totalConsumption?.toFixed(2) || '-') : ''}</td>
      </tr>

      <tr key={`${index}-production`} className="sm:hidden text-xs h-6">
        <td className="pl-6">{row.date ? 'Total Production' : ''}</td>
        <td className="">{row.date ? (row.totalProduction?.toFixed(2) || '-') : ''}</td>
      </tr>

      <tr key={`${index}-price`} className="sm:hidden text-xs h-6">
        <td className="pl-6">{row.date ? 'Avg. Price' : ''}</td>
        <td className="">{row.date ? (row.avgPrice?.toFixed(2) || '-') : ''}</td>
      </tr>

      <tr key={`${index}-negative`} className="sm:hidden text-xs h-6">
        <td className="pl-6">{row.date ? 'Longest Neg. Hours' : ''}</td>
        <td className="">{row.date ? (row.longestNegStreak || '-') : ''}</td>
      </tr>
    </>
  )
}

export const MobileTable = ({ data, sortValue, sortOrder, handleSort }: MobileTableProps) => {
  const selectedValues = {'date': 'Date', 'totalConsumption': 'Total Consumption', 'totalProduction': 'Total Production', 'avgPrice': 'Avg. Price', 'longestNegStreak': 'Longest Neg. Hours'};
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(selectedValues[sortValue as keyof typeof selectedValues]);

  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const handleSelection = (value: string, order: string) => {
    handleSort(value, order);
    setSelectedValue(selectedValues[value as keyof typeof selectedValues]);
    setDropdownOpen(false)
  }

  return (
    <div className="sm:hidden">
      <div className="flex w-full max-w-[375px] mx-auto pl-6 items-center gap-2 text-xs text-[#59677D]">
        <p>Sort by:</p>
        <button className="border w-32 h-5 rounded-md text-left pl-2 hover:bg-[#0000750a]" onClick={handleDropdown}>{selectedValue}</button>
        <button className="border w-12 h-5 rounded-md text-left pl-2 active:bg-[#0000750a]" onClick={() => handleSelection(sortValue, sortOrder === 'asc' ? 'desc' : 'asc')}>{sortOrder.toUpperCase()}</button>
        {dropdownOpen && (
          <ul className="absolute z-10 w-32 top-[141px] left-[73px] bg-white border border-[#59677D1A] rounded-md mt-1">
            <li onClick={() => handleSelection('date', sortOrder)} className={`px-2 py-0.5 hover:bg-[#0000750a] ${sortValue === 'date' && 'hidden'}`}>Date</li>
            <li onClick={() => handleSelection('totalConsumption', sortOrder)} className={`px-2 py-0.5 hover:bg-[#0000750a] ${sortValue === 'totalConsumption' && 'hidden'}`}>Total Consumption</li>
            <li onClick={() => handleSelection('totalProduction', sortOrder)} className={`px-2 py-0.5 hover:bg-[#0000750a] ${sortValue === 'totalProduction' && 'hidden'}`}>Total Production</li>
            <li onClick={() => handleSelection('avgPrice', sortOrder)} className={`px-2 py-0.5 hover:bg-[#0000750a] ${sortValue === 'avgPrice' && 'hidden'}`}>Avg. Price</li>
            <li onClick={() => handleSelection('longestNegStreak', sortOrder)} className={`px-2 py-0.5 hover:bg-[#0000750a] ${sortValue === 'longestNegStreak' && 'hidden'}`}>Longest Neg. Hours</li>
          </ul>
          )}
      </div>
      <table className='w-full max-w-[375px] mx-auto mt-6 mb-16 sm:w-full shadow-[0px_2px_4px_-3px_#00000040]'>
        <thead>
        </thead>
        <tbody>
          {data.map((row: OverviewData, index: number) => (
            <MobileTableRows key={`${index}-mobile`} row={row} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  )
}