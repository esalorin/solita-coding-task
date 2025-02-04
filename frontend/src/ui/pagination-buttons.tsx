interface PaginationButtonsProps {
  paginationInput: string;
  totalPages: number;
  pageSize: number;
  dataLen: number;
  prevPage: () => void;
  nextPage: () => void;
  handlePageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PaginationButtons = ({ paginationInput, totalPages, pageSize, dataLen, prevPage, nextPage, handlePageChange }: PaginationButtonsProps) => {
  return (
    <div className="flex justify-between text-[#59677D] px-6 mt-8 max-w-sm sm:max-w-md text-xs mx-auto">
      <p>{`Showing ${paginationInput ? ((parseInt(paginationInput) * pageSize - pageSize) + 1) + ' - ' + parseInt(paginationInput) * pageSize : '...'} of ${dataLen}`}</p>
      <div className="flex items-center">
        <button className="hover:bg-[#0000750a] border w-7 h-6 rounded-md drop-shadow-md" onClick={prevPage}>{'<'}</button>
        <div className="flex items-center w-20 justify-center">
          <input type="text" value={paginationInput} onChange={handlePageChange} className="w-[3ch] text-right"/>
          <p>{`/ ${totalPages}`}</p>
        </div>
        <button className="hover:bg-[#0000750a] border w-7 h-6 rounded-md" onClick={nextPage}>{'>'}</button>
      </div>
    </div>
  )
};