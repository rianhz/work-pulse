"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { BasePagination } from "@/components/custom/pagination/BasePagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyData } from "../errors-and-empty/EmptyData";

interface BaseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnLabels?: Record<string, string>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: React.Dispatch<React.SetStateAction<VisibilityState>>;
  
  showSearchField?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  isLoading?: boolean;
  isEmptyData?: boolean;
  emptyDataDescription?: string;
  emptyDataIcon?: React.ReactNode;
  onRowClicked?: (row: TData) => void;
}

export function BaseTable<TData, TValue>({
  columns,
  data,
  columnLabels = {},
  columnVisibility = {},
  onColumnVisibilityChange,
  showSearchField = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Searching...",
  currentPage,
  totalPages = 1,
  onPageChange,
  isLoading = false,
  isEmptyData = false,
  emptyDataDescription = "No data found",
  emptyDataIcon = <Table className="size-10 text-muted-foreground" />,
  onRowClicked,
}: BaseTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalVisibility, setInternalVisibility] = React.useState<VisibilityState>({});

  const isControlledVisibility = onColumnVisibilityChange !== undefined;
  const currentVisibility = isControlledVisibility ? columnVisibility : internalVisibility;
  const handleVisibilityChange = isControlledVisibility ? onColumnVisibilityChange : setInternalVisibility;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility: currentVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: handleVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        {showSearchField && (
          <InputGroup className="max-w-lg">
            <InputGroupInput 
              placeholder={searchPlaceholder} 
              value={searchValue} 
              onChange={(e) => onSearchChange?.(e.target.value)}
              disabled={isLoading}
            />
          </InputGroup>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto flex gap-2" disabled={isLoading} icon={SlidersHorizontal} iconPosition="left">
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnLabels[column.id] || column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border overflow-x-auto relative">
        {isLoading && <div className="flex justify-center items-center min-h-[200px]"> <Spinner className="size-10" /> </div>}
        {!isLoading && isEmptyData && <EmptyData description={emptyDataDescription} icon={emptyDataIcon} />}
        {!isLoading && !isEmptyData && <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isActions = header.column.id === "actions";
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        isActions
                          ? "sticky right-0 bg-background shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] z-10 text-right w-[100px]"
                          : ""
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} onClick={() => onRowClicked?.(row.original)} className={onRowClicked ? "cursor-pointer" : ""}>
                {row.getVisibleCells().map((cell) => {
                  const isActions = cell.column.id === "actions";
                  return (
                    <TableCell
                      key={cell.id}
                      className={
                        isActions
                          ? "sticky right-0 bg-background shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] z-10 text-right"
                          : ""
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>}
      </div>

      {currentPage !== undefined && onPageChange && totalPages > 1 && (
        <div className="pt-2">
          <BasePagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={onPageChange} 
          />
        </div>
      )}
    </div>
  );
}