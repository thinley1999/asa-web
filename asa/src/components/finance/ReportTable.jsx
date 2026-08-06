import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {  
  Eye, 
  Download, 
  Calendar,
  User,
  Building,
  Wallet,
  FilePieChart
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { advance_type } from "../datas/advance_type";
import { isoToDate } from "../utils/IsoDate";

const ReportTable = ({ data, total, filters }) => {
  const exportToPDF = () => {
    const input = document.getElementById("report-table");
    
    html2canvas(input, { 
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${filters?.report_type}_Advance_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    });
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      'Nu': 'Nu',
      'INR': '₹',
      'USD': '$'
    };
    return symbols[currency] || currency;
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FilePieChart className="h-5 w-5" />
              {filters?.report_type} Advance Report
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Generated on {format(new Date(), 'PPP')} • {data.length} records found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(filters?.start_date), "dd MMM yyyy")} - {format(new Date(filters?.end_date), "dd MMM yyyy")}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div id="report-table">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Employee
                    </div>
                  </TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      Department
                    </div>
                  </TableHead>
                  <TableHead>Advance Type</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Wallet className="h-3 w-3" />
                      Amount
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => {
                  const amountData = item.advance_amount || item.dsa_amount || { Nu: item?.amount || 0 };
                  const currencies = Object.entries(amountData)
                    .filter(([_, value]) => value > 0)
                    .map(([currency, value]) => ({
                      currency,
                      value,
                      symbol: getCurrencySymbol(currency)
                    }));

                  return (
                    <TableRow key={item?.id || index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="text-sm">
                          {isoToDate(item?.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item?.user?.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {item?.user?.username}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate">
                          {item?.user?.department}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {advance_type[item?.advance_type] || item?.advance_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col gap-1 items-end">
                          {currencies.length > 0 ? (
                            currencies.map((curr, idx) => (
                              <div key={idx} className="font-medium">
                                {curr.symbol}{curr.value.toLocaleString()}
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground">0</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          asChild
                        >
                          <a
                            href={`/individualReport/${item?.id}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter className="bg-muted/50">
                <TableRow>
                  <TableCell colSpan={5} className="font-bold">
                    Total Amount
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col gap-1 items-end">
                      {Object.entries(total || {})
                        .filter(([_, value]) => value > 0)
                        .map(([currency, value]) => (
                          <div key={currency} className="font-bold text-lg">
                            {getCurrencySymbol(currency)}{value.toLocaleString()}
                          </div>
                        ))}
                      {(!total || Object.values(total || {}).every(v => !v || v === 0)) && (
                        <div className="text-lg font-bold">0</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportTable;
