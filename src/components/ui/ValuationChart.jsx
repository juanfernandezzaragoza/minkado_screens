import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ValuationChart({ 
  title, 
  currentValue, 
  avgValue, 
  totalImpact, 
  showTimeChart = false, 
  showValuationInfo = true,
  chartData = null 
}) {
  if (!showTimeChart) {
    // Current valuation chart - 21 hardcoded points, monotonically growing
    const data = [
      { index: 0, value: -5 },
      { index: 1, value: -3 },
      { index: 2, value: -1 },
      { index: 3, value: 1 },
      { index: 4, value: 3 },
      { index: 5, value: 5 },
      { index: 6, value: 7 },
      { index: 7, value: 8 },
      { index: 8, value: 9 },
      { index: 9, value: 10, isMediana: true }, // Median point
      { index: 10, value: 11 },
      { index: 11, value: 12, isYo: true }, // Your valuation point
      { index: 12, value: 13 },
      { index: 13, value: 14 },
      { index: 14, value: 15 },
      { index: 15, value: 17 },
      { index: 16, value: 19 },
      { index: 17, value: 21 },
      { index: 18, value: 22 },
      { index: 19, value: 23 },
      { index: 20, value: 25 }
    ];

    // Custom dot component to highlight specific points
    const CustomDot = (props) => {
      const { cx, cy, payload } = props;
      if (payload.isYo) {
        return (
          <g>
            <circle cx={cx} cy={cy} r={4} fill="#374151" stroke="#374151" strokeWidth={2} />
            <text x={cx} y={cy + 20} fontSize="10" fill="#6b7280" textAnchor="middle">
              Yo
            </text>
          </g>
        );
      }
      if (payload.isMediana) {
        return (
          <g>
            <circle cx={cx} cy={cy} r={4} fill="#374151" stroke="#374151" strokeWidth={2} />
            <text x={cx} y={cy + 20} fontSize="10" fill="#6b7280" textAnchor="middle">
              Mediana
            </text>
          </g>
        );
      }
      return null;
    };

    return (
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <h4 className="font-medium text-gray-800 mb-3">{title}</h4>
        
        <div className="h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="index"
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <YAxis 
                domain={[-5, 25]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickFormatter={(value) => value >= 0 ? `+₭${value}` : `-₭${Math.abs(value)}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#374151" 
                strokeWidth={2}
                dot={<CustomDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {showValuationInfo && (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 items-center">
              <span className="text-gray-600">Mi valoración:</span>
              <span className="font-medium text-gray-800 text-right">{currentValue}</span>
              <span className="text-blue-600 underline cursor-pointer text-right">Modificar</span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-gray-600">Valoración mediana:</span>
              <span className="font-medium text-gray-800 text-right">{avgValue}</span>
              <span></span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-gray-600">Impacto total:</span>
              <span className="font-medium text-gray-800 text-right">{totalImpact}</span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // Time-based charts
    const personalData = [
      { year: 2023, value: 10 },
      { year: 2023.2, value: 10.2 },
      { year: 2023.4, value: 10.5 },
      { year: 2023.6, value: 10.8 },
      { year: 2023.8, value: 11.0 },
      { year: 2024, value: 11.3 },
      { year: 2024.2, value: 11.5 },
      { year: 2024.4, value: 11.7 },
      { year: 2024.6, value: 11.8 },
      { year: 2024.8, value: 11.9 },
      { year: 2025, value: 12 }
    ];

    const medianData = [
      { year: 2023, value: 8 },
      { year: 2023.2, value: 8.1 },
      { year: 2023.4, value: 8.3 },
      { year: 2023.6, value: 8.6 },
      { year: 2023.8, value: 8.9 },
      { year: 2024, value: 9.2 },
      { year: 2024.2, value: 9.4 },
      { year: 2024.4, value: 9.6 },
      { year: 2024.6, value: 9.7 },
      { year: 2024.8, value: 9.8 },
      { year: 2025, value: 10 }
    ];

    const impactData = [
      { year: 2023, value: 100 },
      { year: 2023.2, value: 120 },
      { year: 2023.4, value: 145 },
      { year: 2023.6, value: 175 },
      { year: 2023.8, value: 210 },
      { year: 2024, value: 250 },
      { year: 2024.2, value: 295 },
      { year: 2024.4, value: 345 },
      { year: 2024.6, value: 400 },
      { year: 2024.8, value: 450 },
      { year: 2025, value: 500 }
    ];

    // Combine personal and median data for dual-line chart
    const combinedData = personalData.map((item, index) => ({
      year: item.year,
      personal: item.value,
      median: medianData[index]?.value || 0
    }));

    return (
      <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <h4 className="font-medium text-gray-800 mb-3">{title}</h4>
        
        <div className="space-y-4">
          {/* Personal vs Median Chart */}
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedData} margin={{ top: 5, right: 0, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="year" 
                  type="number"
                  scale="linear"
                  domain={[2023, 2025]}
                  ticks={[2023, 2025]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickFormatter={(value) => `+₭${value}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="personal" 
                  stroke="#374151" 
                  strokeWidth={2}
                  dot={false}
                  name="Yo"
                />
                <Line 
                  type="monotone" 
                  dataKey="median" 
                  stroke="#6b7280" 
                  strokeWidth={1}
                  dot={false}
                  name="Med"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Impact Chart */}
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={impactData} margin={{ top: 5, right: 0, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="year" 
                  type="number"
                  scale="linear"
                  domain={[2023, 2025]}
                  ticks={[2023, 2025]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  tickFormatter={(value) => `+₭${value}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#374151" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}