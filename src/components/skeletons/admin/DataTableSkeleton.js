import React from 'react'
import { Skeleton } from "@src/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table"

const DataTableSkeleton = ({ table, flexRender, columnsLength }) => {
  return (
    <Table>
      <TableHeader>
        {table ? (
          table.getHeaderGroups().map(hg => (
            <TableRow key={hg.id}>
              {hg.headers.map(h => (
                <TableHead key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
          </TableRow>
        )}
      </TableHeader>

      <TableBody>
        {Array(10).fill(0).map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={columnsLength+ 1} className="h-12 text-center">
              <Skeleton className={"w-full h-[30px]"} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default DataTableSkeleton