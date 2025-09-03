import { useMemo } from "react";


export const useInvestmentData = (totalDays: number = 31, investment: number = 0) => {
  const INCOME_PER_DAY = (investment*0.02)
  const investmentData = useMemo(() => {
    const startDate = new Date("2025-08-31");
    const investments = [];
    
    for (let day = 0; day <= totalDays; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (day));
      
      const amount = day * INCOME_PER_DAY;
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      });
      
      investments.push({
        day,
        date: formattedDate,
        amount
      });
    }
    
    return investments;
  }, [totalDays]);

  return {
    investmentData,
    INCOME_PER_DAY
  };
};
