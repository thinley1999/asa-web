import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Trash2, MoreHorizontal, Calendar, MapPin, DollarSign } from "lucide-react";
import { convertToDateTime } from "../utils/dateTime";

const TravelDetailsTable = ({
  existingData,
  data,
  removeRow,
  editRow,
  edit,
}) => {
  const tableData = existingData ? (edit ? data : existingData) : data;

  // Format currency display
  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `Nu. ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Get status badge variant
  const getStatusVariant = (row) => {
    if (row.halt_at) return "warning";
    if (row.stop_at) return "secondary";
    if (row.return) return "default";
    return "outline";
  };

  const columns = [
    {
      header: "Duration",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">{convertToDateTime(row.start_date)}</div>
            <div className="text-xs text-muted-foreground">to</div>
            <div className="font-medium">{convertToDateTime(row.end_date)}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Route",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">{row.from || "N/A"}</div>
            <div className="text-xs text-muted-foreground">→</div>
            <div className="font-medium">{row.to || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Mode",
      accessor: (row) => (
        <Badge variant="outline" className="capitalize">
          {row.mode || "N/A"}
        </Badge>
      ),
    },
    {
      header: "Amount",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-semibold">{formatCurrency(row.rate)}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row) => {
        let label = "Travel";
        if (row.halt_at) label = "Halt";
        if (row.stop_at) label = "Stop Over";
        if (row.return) label = "Return";
        
        return (
          <Badge variant={getStatusVariant(row)}>
            {label}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      accessor: (row, index) => (
        <div className="flex items-center gap-1">
          {existingData && !edit ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editRow(row, index)}
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => editRow(row, index)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => removeRow(row.id)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (tableData.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Travel Itinerary Added</h3>
            <p className="text-muted-foreground mb-4">
              Add travel details to see them listed here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index} className="font-semibold">
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/50">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {typeof column.accessor === 'function' 
                        ? column.accessor(row, rowIndex)
                        : row[column.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {tableData.length} {tableData.length === 1 ? 'itinerary' : 'itineraries'} added
          </div>
          <div className="text-sm font-medium">
            Total: {formatCurrency(tableData.reduce((sum, row) => sum + (parseFloat(row.rate) || 0), 0))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelDetailsTable;
