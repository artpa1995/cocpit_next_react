import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface Series {
  name: string;
  data: number[];
  type?: 'line' | 'bar' | 'area' | 'radar' | 'pie' | 'donut' | 'column';
}

interface ChartProps {
  series: Series[];
  categories?: string[];
  chartTitle: string;
  colors?: string[];
}

function getYearLabels(year:any) {
  const labels = [];
  
  for (let month = 0; month < 12; month++) {
    const date = new Date(year, month, 1);
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    labels.push(formattedDate);
  }

  return labels;
}

const currentYear = new Date().getFullYear();
const yearLabels = getYearLabels(currentYear);

const ChartComponent: React.FC<ChartProps> = ({
  series,
  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  chartTitle,
  colors = []
}) => {

  const options: ApexOptions = {
    chart: {
      id: 'basic-chart',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    xaxis: {
      // categories,
    },
    
   
    tooltip: {
      // enabled: false,
    },
    dataLabels: {
      enabled: false
    },
    colors, 
    stroke: {
      width: [0, 3, 3],
      dashArray: [0, 3, 7]
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6
      }
    },

    legend: {
      show: false,
    },
    
    labels: yearLabels,
  };

  return (
    <div className="chart-container">
      <Chart options={options} series={series} width="100%"/>
    </div>
  );
};

export default ChartComponent;
