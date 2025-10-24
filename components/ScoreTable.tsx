import React from 'react';

interface ScoreTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
}

const ScoreTable = <T,>({ headers, data, renderRow }: ScoreTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.length > 0 ? (
            data.map(renderRow)
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center text-slate-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
