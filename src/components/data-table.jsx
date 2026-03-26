"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table"
import { Button } from "@src/components/ui/button"
import { Input } from "@src/components/ui/input"
import { Checkbox } from "@src/components/ui/checkbox"
import { Label } from "@src/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@src/components/ui/select"

import {
  IconGripVertical,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconTrash,
  IconX,
  IconCircleDashed,
  IconLoader2,
} from "@tabler/icons-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@src/components/ui/dialog"
import { Spinner } from "./ui/spinner"
import UserPreview from "./data-table/delete-preview/user"
import BookPreview from "./data-table/delete-preview/book"
import ReviewPreview from "./data-table/delete-preview/review"
import clsx from "clsx"
import { deleteMultipleBooks, deleteMultipleReviews, deleteMultipleUsers } from "@src/lib/admin"
import { getSelectedIds } from "@src/lib/utils"
import { useRouter } from "next/navigation"
import DataTableSkeleton from "./skeletons/admin/DataTableSkeleton"


/* ---------------- DRAGGABLE ROW ---------------- */

function DraggableRow({ row }) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && "selected"}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
      }}
    >
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

/* ---------------- MAIN TABLE ---------------- */

export function DataTable({ 
  data, 
  columns, 
  search, 
  setSearch, 
  currentTab,
  page,
  setPage,
  pageSize,
  setPageSize,
  total,
  loading,
  loadData,
  children
}) {
  const tableData = data
  const totalCount = total
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDeleteing, setIsDeleteing] = React.useState(false)
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isTrashDisabled, setIsTrashDisabled] = React.useState(true)
  const [sorting, setSorting] = React.useState([])
  const pagination = {
    pageIndex: page - 1,
    pageSize
  }

  const router = useRouter()
  const handlePaginationChange = updater => {
    const next =
      typeof updater === "function" ? updater(pagination) : updater

    setPage(next.pageIndex + 1)
    setPageSize(next.pageSize)
    loadData({
      page: next.pageIndex + 1,
      limit: next.pageSize,
      search: globalFilter,
    })
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  React.useEffect(() => {
    loadData({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: globalFilter,
    })
  }, [])

  React.useEffect(() => {
    const delay = setTimeout(() => {
      loadData({
        page: 1,
        limit: pageSize,
        search,
      })
    }, 400)

    return () => clearTimeout(delay)
  }, [search])

  const table = useReactTable({
    data: tableData,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
    columns: [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={v => row.toggleSelected(!!v)}
          />
        ),
        enableSorting: false,
      },
      ...columns,
    ],
    getRowId: row => row.id,
    state: {
      sorting,
      rowSelection,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const ids = React.useMemo(() => tableData.map(r => r.id), [tableData])

  function handleDragEnd(e) {
    const { active, over } = e
    if (!over || active.id === over.id) return

    setTableData(prev => {
      const oldIndex = prev.findIndex(r => r.id === active.id)
      const newIndex = prev.findIndex(r => r.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  async function handleMultipleDeletion() {
    setIsDeleteing(true)
    const selectedIds = getSelectedIds(tableData, rowSelection)
    if (currentTab === "authors" || currentTab === "users") {
      await deleteMultipleUsers(selectedIds)
        .then(() => setIsDeleteing("done"))
    } else if (currentTab === "books") {
      await deleteMultipleBooks(selectedIds)
        .then(() => setIsDeleteing("done"))
    } else {
      await deleteMultipleReviews(selectedIds)
        .then(() => setIsDeleteing("done"))
    }
 
    setTimeout(() => window.location.reload(), 2000)
  }

  React.useEffect(() => {
    setIsTrashDisabled(Object.keys(rowSelection).length === 0)
  }, [rowSelection])

  return (
    <div className="flex flex-col gap-4 relative">
      {loading && (
        <div className="bg-accent z-10 scale-200 rounded-sm p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Spinner className={"bg-transparent"} />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center ">
          <Input
            placeholder="Caută..."
            value={search ?? ""}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <Button 
            variant="ghost"
            disabled={search.length === 0}
            onClick={() => setSearch("")}
            className={"cursor-pointer"}
          >
            <IconX size={32} />
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          {tableData.length === 0 && search.length === 0 ? (
            <IconLoader2 className='rotate mr-2' />
          ) : (
            <span className='opacity-50 ml-auto'>{totalCount} rezultate</span>
          )}
          {currentTab !== "orders" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost"
                  disabled={isTrashDisabled}
                >
                  <IconTrash size={32} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Atentie</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  {(currentTab === "authors" || currentTab === "users") && (
                    <UserPreview 
                      data={getSelectedIds(data, rowSelection)} 
                      isDeleteing={isDeleteing}
                      userType={currentTab === "authors" ? "author" : "user"}
                    />
                  )}
                  {currentTab === "books" && (
                    <BookPreview 
                      data={getSelectedIds(data, rowSelection)} 
                      isDeleteing={isDeleteing}
                    />
                  )}
                  {currentTab === "reviews" && (
                    <ReviewPreview 
                      data={getSelectedIds(data, rowSelection)} 
                      isDeleteing={isDeleteing}
                    />
                  )}
                </DialogDescription>
                <DialogFooter>
                  <DialogClose
                    onClick={() => console.log("meh")}
                    className="cursor-pointer text-gray-600 rounded-sm px-4 py-1 border-1"
                  > 
                    Anuleaza
                  </DialogClose>
                  <Button
                    disabled={isDeleteing}
                    onClick={handleMultipleDeletion}
                    className="cursor-pointer text-white rounded-sm px-4 py-1 bg-red-500 hover:bg-red-500 border-1"
                  >
                    {isDeleteing && isDeleteing !== "done" ? (
                      <IconLoader2 className="rotate" />
                    ) : (
                      <span>Sterge</span>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {children}
        </div>
      </div>

      {/* Table */}
      {tableData.length === 0 && search.length === 0 ? (
        <DataTableSkeleton 
          table={table}
          flexRender={flexRender}
          columnsLength={columns.length}
        />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(hg => (
                  <TableRow key={hg.id}>
                    {hg.headers.map(h => (
                      <TableHead key={h.id}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {loading && tableData.length === 0 ? (
                  <DataTableSkeleton />
                ) : (
                  <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map(row => (
                        <DraggableRow key={row.id} row={row} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                          Nu exista rezultate
                        </TableCell>
                      </TableRow>
                    )}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} selectate
        </span>


        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm not-required">Randuri pe pagina</Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={v => table.setPageSize(Number(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map(n => (
                  <SelectItem key={n} value={`${n}`}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft />
          </Button>
          <span className="text-sm">
            Pagina {page} din {Math.ceil(totalCount / pageSize)}
          </span>
          <Button
            size="icon"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
