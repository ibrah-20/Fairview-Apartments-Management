import React from 'react';

const DataTable = ({ columns, data, onRowClick }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-silver-light dark:border-surface-hover-dark bg-surface-light dark:bg-surface-dark">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-background-light dark:bg-surface-hover-dark text-text-muted-light dark:text-text-muted-dark border-b border-silver-light dark:border-surface-hover-dark">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4 font-medium uppercase tracking-wider text-xs">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-silver-light dark:divide-surface-hover-dark">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-text-muted-light dark:text-text-muted-dark">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-background-light dark:hover:bg-surface-hover-dark/50' : ''}`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-text-light dark:text-text-dark">
                    {col.accessor ? row[col.accessor] : col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
