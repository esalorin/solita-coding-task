import db from "./db";

interface RawOverviewData {
  [date: string]: {
    totalConsumption: null | number;
    totalProduction: null | number;
    totalPrice: number;
    priceCount: number;
    longestNegStreak: number;
    currentNegStreak: number;
    avgPrice: null | number;
  };
}

interface OverviewData {
  date: string;
  totalConsumption: null | number;
  totalProduction: null | number;
  avgPrice: null | number;
  longestNegStreak: number;
}

interface RawDailyData {
  date: string;
  totalConsumption: null | number;
  totalProduction: null | number;
  totalPrice: number;
  priceCount: number;
  hourWithBiggestConsAndProdDiff: null | number;
  biggestConsAndProdDifference: null | number;
  currentConsAndProdDifference: null | number;
  cheapestPrice: null | number;
  cheapestHours: Array<number>;
  avgPrice: null | number;
}

interface DailyData {
  date: string;
  totalConsumption: null | number;
  totalProduction: null | number;
  avgPrice: null | number;
  hourWithBiggestConsAndProdDiff: null | number;
  cheapestPrice: null | number;
  cheapestHours: Array<number>;
}

export const fetchOverviewData = async () => {
  
  const result = await db.query(`
    SELECT starttime, consumptionamount, productionamount, hourlyprice
    FROM electricitydata
    ORDER BY starttime DESC;`);
    
  const overviewData: RawOverviewData = {};
  const dataArray: OverviewData[] = [];

  result.rows.forEach((row) => {
    const date = row.starttime.toISOString().split("T")[0];

    if (!overviewData[date]) {
      overviewData[date] = {
        totalConsumption: null,
        totalProduction: null,
        totalPrice: 0,
        priceCount: 0,
        longestNegStreak: 0,
        currentNegStreak: 0,
        avgPrice: null,
      };
    }

    const consumptionamount = parseFloat(row.consumptionamount);
    const productionamount = parseFloat(row.productionamount);
    const hourlyprice = parseFloat(row.hourlyprice);

    // total consumption
    if (overviewData[date].totalConsumption !== null && consumptionamount) {
      overviewData[date].totalConsumption += consumptionamount;
    }
    else if (consumptionamount) {
      overviewData[date].totalConsumption = consumptionamount;
    }

    // total production
    if (overviewData[date].totalProduction !== null && productionamount) {
      overviewData[date].totalProduction += productionamount;
    }
    else if (productionamount) {
      overviewData[date].totalProduction = productionamount;
    }

    // total price and price count
    if (hourlyprice) {
      overviewData[date].totalPrice += hourlyprice;
      overviewData[date].priceCount += 1;
    }

    // longest negative streak
    if (hourlyprice < 0) {
      overviewData[date].currentNegStreak++;
      if (overviewData[date].currentNegStreak > overviewData[date].longestNegStreak) {
        overviewData[date].longestNegStreak = overviewData[date].currentNegStreak;
      }
    } else {
      overviewData[date].currentNegStreak = 0;
    }
  });

  Object.keys(overviewData).forEach((date) => {
    const finalData: OverviewData = {
      date: date,
      totalConsumption: overviewData[date].totalConsumption,
      totalProduction: overviewData[date].totalProduction,
      avgPrice: overviewData[date].priceCount > 0 ? (overviewData[date].totalPrice / overviewData[date].priceCount) : null,
      longestNegStreak: overviewData[date].longestNegStreak,
    };
    dataArray.push(finalData);
  });
    
  return dataArray;
}

const isValidTimezone = (timezone: string) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
};

export const fetchDailyData = async (date : string, timezone : string) => {
  const selectedDate = new Date(date).toISOString().split("T")[0];
  const userTimezone = timezone && isValidTimezone(timezone) ? timezone : 'UTC';
  const result = await db.query(`
      SELECT starttime, consumptionamount, productionamount, hourlyprice
      FROM electricitydata
      WHERE starttime AT TIME ZONE '${userTimezone}' BETWEEN '${selectedDate} 00:00:00' AND '${selectedDate} 23:59:59'
      ORDER BY starttime ASC;
  `);

  const dailyData: RawDailyData = {
    date: result.rows[0].starttime.toISOString().split("T")[0],
    totalConsumption: null,
    totalProduction: null,
    totalPrice: 0,
    priceCount: 0,
    hourWithBiggestConsAndProdDiff: null,
    currentConsAndProdDifference: null,
    biggestConsAndProdDifference: null,
    cheapestPrice: null,
    cheapestHours: [],
    avgPrice: null
  };

  result.rows.forEach((row) => {
    const time = row.starttime.toISOString().split("T")[1].split(":")[0];

    const consumptionamount = parseFloat(row.consumptionamount);
    const productionamount = parseFloat(row.productionamount);
    const hourlyprice = parseFloat(row.hourlyprice);

    // total consumption
    if (dailyData.totalConsumption !== null && consumptionamount) {
      dailyData.totalConsumption += consumptionamount;
    }
    else if (consumptionamount) {
      dailyData.totalConsumption = consumptionamount;
    }

    // total production
    if (dailyData.totalProduction !== null && productionamount) {
      dailyData.totalProduction += productionamount;
    }
    else if (productionamount) {
      dailyData.totalProduction = productionamount;
    }

    // total price, price count, cheapest price and hours
    if (hourlyprice !== null) {
      dailyData.totalPrice += hourlyprice;
      dailyData.priceCount += 1;
      if (dailyData.cheapestPrice === null || hourlyprice < dailyData.cheapestPrice) {
        dailyData.cheapestPrice = hourlyprice;
        dailyData.cheapestHours = [parseInt(time)]
      } else if (hourlyprice === dailyData.cheapestPrice) {
        dailyData.cheapestHours.push(parseInt(time));
      }
    }

    // biggest production and consumption difference
    if (consumptionamount && productionamount) {
      const difference = consumptionamount - productionamount;
      if (dailyData.biggestConsAndProdDifference === null || difference > dailyData.biggestConsAndProdDifference) {
        dailyData.biggestConsAndProdDifference = difference;
        dailyData.hourWithBiggestConsAndProdDiff = parseInt(time);
      }
    }
  });

  const finalDailyData: DailyData = {
    date: dailyData.date,
    totalConsumption: dailyData.totalConsumption,
    totalProduction: dailyData.totalProduction,
    avgPrice: dailyData.priceCount > 0 ? (dailyData.totalPrice / dailyData.priceCount) : null,
    hourWithBiggestConsAndProdDiff: dailyData.hourWithBiggestConsAndProdDiff,
    cheapestPrice: dailyData.cheapestPrice,
    cheapestHours: dailyData.cheapestHours
  };

  return finalDailyData;
}
