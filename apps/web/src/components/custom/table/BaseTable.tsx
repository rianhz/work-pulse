"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSeparator, DropdownMenuPortal, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, LucideIcon, Filter } from "lucide-react";
import { SlidersHorizontal } from "lucide";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { BasePagination } from "@/components/custom/pagination/BasePagination";
import { Spinner } from "@/components/ui/spinner";
import { EmptyData } from "../errors-and-empty/EmptyData";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ActionItem<TData> {
  label: string;
  icon?: LucideIcon;
  onClick: (selectedRows: TData[]) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  loading?: boolean;
  disabled?: boolean;
}

export interface TableFilterConfig {
  columnId: string;
  placeholder: string;
  options: { label: string; value: string }[];
}

interface BaseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnLabels?: Record<string, string>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: React.Dispatch<React.SetStateAction<VisibilityState>>;
  
  // Row Selection & Bulk Actions
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  bulkActions?: ActionItem<TData>[];
  bulkActionsTriggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  externalActions?: ActionItem<TData>[];
  // Filters State & Config
  filters?: TableFilterConfig[];
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;

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
  columns: userColumns,
  data,
  columnLabels = {},
  columnVisibility = {},
  onColumnVisibilityChange,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  bulkActions = [],
  externalActions = [],
  filters = [],
  columnFilters: externalColumnFilters,
  onColumnFiltersChange,
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
  bulkActionsTriggerVariant,
}: BaseTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalVisibility, setInternalVisibility] = React.useState<VisibilityState>({});
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);

  const currentVisibility = onColumnVisibilityChange !== undefined ? columnVisibility : internalVisibility;
  const handleVisibilityChange = onColumnVisibilityChange !== undefined ? onColumnVisibilityChange : setInternalVisibility;

  const currentSelection = onRowSelectionChange !== undefined ? (rowSelection ?? {}) : internalRowSelection;
  const handleSelectionChange = onRowSelectionChange !== undefined ? onRowSelectionChange : setInternalRowSelection;

  const currentFilters = onColumnFiltersChange !== undefined ? (externalColumnFilters ?? []) : internalColumnFilters;
  const handleFiltersChange = onColumnFiltersChange !== undefined ? onColumnFiltersChange : setInternalColumnFilters;

  const columns = React.useMemo(() => {
    if (!enableRowSelection) return userColumns;

    const selectColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="cursor-pointer"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectColumn, ...userColumns];
  }, [enableRowSelection, userColumns]);

  const processedColumns = React.useMemo(() => {
    return columns.map((col) => {
      const isSortable = col.enableSorting !== false && col.enableSorting !== undefined;
      const OriginalHeader = col.header;

      if (!isSortable || !OriginalHeader) return col;

      return {
        ...col,
        header: (headerProps: any) => {
          const sorted = headerProps.column.getIsSorted();
          const currentMorphIcon =
            sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => headerProps.column.toggleSorting(sorted === "asc")}
              className="-ml-3 h-8 hover:bg-transparent font-semibold data-[state=open]:bg-accent"
              icon={currentMorphIcon}
              iconPosition="right"
              iconClassName="size-3.5 opacity-70"
              enableIconTransition={true}
            >
              {flexRender(OriginalHeader, headerProps)}
            </Button>
          );
        },
      };
    }) as ColumnDef<TData, TValue>[];
  }, [columns]);

  const table = useReactTable({
    data,
    columns: processedColumns,
    state: {
      sorting,
      columnVisibility: currentVisibility,
      rowSelection: currentSelection,
      columnFilters: currentFilters,
    },
    enableRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: handleVisibilityChange,
    onRowSelectionChange: handleSelectionChange,
    onColumnFiltersChange: handleFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  const selectedCount = selectedRows.length;

  const renderActionsControl = (actions: ActionItem<TData>[], defaultTriggerLabel = "Actions") => {
    if (actions.length === 0) return null;

    if (actions.length === 1) {
      const action = actions[0];
      return (
        <Button
          variant={action.variant || bulkActionsTriggerVariant || "outline"}
          size="sm"
          onClick={() => action.onClick(selectedRows)}
          icon={action.icon}
          iconPosition="left"
          loading={action.loading}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={bulkActionsTriggerVariant || "secondary"} size="sm" className="gap-2">
            {defaultTriggerLabel}
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={idx}
                onClick={() => action.onClick(selectedRows)}
                className="gap-2 cursor-pointer"
                disabled={action.loading || action.disabled}
              >
                {Icon && <Icon className="size-4" />}
                <span>{action.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <Card className="pt-4 pb-0 ring-0 overflow-hidden gap-4">
      <div className="relative mb-0 flex min-h-[48px] items-center justify-between overflow-hidden px-4 py-1">
        <div className="flex w-full items-center justify-between gap-3 flex-wrap">
          
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <React.Activity mode={showSearchField ? "visible" : "hidden"}>
              <InputGroup className="max-w-xs">
                <InputGroupInput 
                  placeholder={searchPlaceholder} 
                  value={searchValue} 
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  disabled={isLoading}
                />
              </InputGroup>
            </React.Activity>
            <React.Activity mode={filters.length > 0 ? "visible" : "hidden"}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 h-8" disabled={isLoading}>
                    <Filter className="size-3.5" />
                    Filter
                    {currentFilters.length > 0 && (
                      <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                        {currentFilters.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  {filters.map((filter) => {
                    const column = table.getColumn(filter.columnId);
                    if (!column) return null;
                    const filterValue = (column.getFilterValue() as string) ?? "";

                    return (
                      <DropdownMenuSub key={filter.columnId}>
                        <DropdownMenuSubTrigger className="cursor-pointer flex justify-between w-full">
                          <span>{filter.placeholder}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="w-[180px]">
                            <DropdownMenuItem
                              onClick={() => column.setFilterValue(undefined)}
                              className="cursor-pointer font-medium text-muted-foreground"
                            >
                              All
                            </DropdownMenuItem>
                            {filter.options.map((option) => (
                              <DropdownMenuItem
                                key={option.value}
                                onClick={() => column.setFilterValue(option.value)}
                                className={`cursor-pointer ${
                                  filterValue === option.value ? "bg-accent font-semibold" : ""
                                }`}
                              >
                                {option.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    );
                  })}

                  {/* Clear Filters Action */}
                  {currentFilters.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => table.resetColumnFilters()}
                        className="cursor-pointer justify-center text-xs font-medium text-destructive focus:text-destructive"
                      >
                        Reset Filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </React.Activity>
          </div>

          <div className="flex items-center gap-2">
            {renderActionsControl(externalActions)}

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
        </div>

        <AnimatePresence>
          {enableRowSelection && selectedCount > 0 && (
            <motion.div
              key="selection-banner"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-y-0 left-0 right-0 z-10 flex items-center bg-card px-4"
            >
              <div className="flex w-full items-center justify-between rounded-md bg-primary px-4 h-12 transition-all">
                <span className="text-sm font-medium text-primary-foreground">
                  {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
                </span>
                <div className="flex items-center gap-2">
                  {renderActionsControl(bulkActions)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="overflow-x-auto relative">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner className="size-10" />
          </div>
        ) : isEmptyData ? (
          <EmptyData description={emptyDataDescription} icon={emptyDataIcon} />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="group">
                  {headerGroup.headers.map((header) => {
                    const isActions = header.column.id === "actions";
                    const isSelect = header.column.id === "select";
                    return (
                      <TableHead
                        key={header.id}
                        className={
                          isActions
                            ? "sticky right-0 shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] z-10 text-right w-[100px] bg-popover p-0"
                            : isSelect
                            ? "w-12 text-center px-2 sticky left-0 shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] z-10 bg-popover"
                            : "px-4 bg-popover"
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
              {table.getRowModel().rows.map((row) => {
                const isUnread = (row.original as any)?.isRead;
                return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  data-unread={isUnread}
                  onClick={() => onRowClicked?.(row.original)}
                  className={cn(
                    "group", // Allows child sticky cells to listen to parent row states
                    onRowClicked && "cursor-pointer",
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isActions = cell.column.id === "actions";
                    const isSelect = cell.column.id === "select";
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          isActions
                            ? "sticky right-0 shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] z-10 text-right bg-popover transition-colors group-hover:bg-muted"
                            : isSelect
                            ? "w-12 text-center px-2 sticky left-0 shadow-[-1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[-1px_0_0_0_rgba(255,255,255,0.1)] transition-colors bg-popover group-hover:bg-muted z-10"
                            : "p-4"
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {currentPage !== undefined && onPageChange && totalPages > 1 && (
        <div className="mb-6">
          <BasePagination
            currentPage={currentPage || 1}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </Card>
  );
}