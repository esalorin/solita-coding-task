'use client';
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { PaginationButtons } from "@/ui/pagination-buttons";
import { OverviewData } from "@/types/globals";
import { MobileTable } from "@/ui/mobile-table";
import { DesktopTable } from "@/ui/desktop-table";
import { DailyViewModal } from "@/ui/daily-view-modal";

export const Overview = () => {
  const [data, setData] = useState<OverviewData[]>([]);
  const [paginatedData, setPaginatedData] = useState<OverviewData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(Math.ceil(data.length / 10));
  const [paginationInput, setPaginationInput] = useState('1');
  const [dailyViewOpen, setDailyViewOpen] = useState(false);
  const [dateForDailyView, setDateForDailyView] = useState('');
  const [sortValue, setSortValue] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openDailyViewModal = (date: string) => {
    setDateForDailyView(date);
    setDailyViewOpen(true);
  }

  const closeDailyViewModal = () => {
    setDateForDailyView('');
    setDailyViewOpen(false);
  }

  const nextPage = () => {
    if (page < totalPages) {
      setPaginatedData(data.slice(page * pageSize, (page + 1) * pageSize));
      setPage(page + 1);
      setPaginationInput((page + 1).toString());
    }
  }
  
  const prevPage = () => {
    if (page > 1) {
      setPaginatedData(data.slice((page - 2) * pageSize, (page - 1) * pageSize));
      setPage(page - 1);
      setPaginationInput((page - 1).toString());
    }
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = e.target.value.replace(/\D/g, '');
    const pageAsInt = parseInt(newPage);
    setPaginationInput(newPage);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!newPage || pageAsInt < 1 || pageAsInt > totalPages) {
      timeoutRef.current = setTimeout(() => {
        setPaginationInput('1');
        setPage(1);
      }, 2000);
    }
    else {
      setPage(pageAsInt);
    }
  }

  const handleSort = (value: string, order: string) => {
    const key = value as keyof OverviewData;
    setSortValue(value);
    setSortOrder(order);
    const sortedData = [...data].sort((a, b) => {
      if (key === 'date') {
        return order === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      }
      const aValue = a[key] ?? 0;
      const bValue = b[key] ?? 0;
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
    setData(sortedData);
  }
  
  useEffect(() => {
    const handleResize = () => {
      const newPageSize = window.innerWidth < 640 ? window.innerHeight > 750 ? 4 : 3 : 10;
      setPageSize(newPageSize);
      setPaginationInput('1');
      setPage(1);
      setTotalPages(Math.ceil(data.length / newPageSize));
    }
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [data]);
  
  useEffect(() => {
    const handlePageUpdate = () => {
      if (data && data.length) {
        const pageData = data.slice((page - 1) * pageSize, page * pageSize);
        if (pageData.length < pageSize) {
          const fakeRows = new Array(pageSize - pageData.length).fill(null).map(() => ({ date: '', avgPrice: 0, totalProduction: 0, totalConsumption: 0, longestNegStreak: 0 }));
          setPaginatedData([...pageData, ...fakeRows]);
        }
        else {
          setPaginatedData(pageData);
        }
      }
    };
    
    handlePageUpdate();

  }, [data, page, pageSize]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/overview");
        setData(response.data);
        setPaginatedData(response.data.slice(0, pageSize));
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } catch (err) {
        console.log("Failed to fetch data.");
      }
    };

    fetchData();
  },[])

  return (
    <>
    {dailyViewOpen && <DailyViewModal date={dateForDailyView} closeModal={closeDailyViewModal} />}
    <DesktopTable paginatedData={paginatedData} sortValue={sortValue} sortOrder={sortOrder} handleSort={handleSort} openDailyViewPopup={openDailyViewModal}/>
    <MobileTable data={paginatedData} sortValue={sortValue} sortOrder={sortOrder} handleSort={handleSort} />
    <PaginationButtons paginationInput={paginationInput} totalPages={totalPages} pageSize={pageSize} dataLen={data.length} prevPage={prevPage} nextPage={nextPage} handlePageChange={handlePageChange} />
    </>
  )
}