import React from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { TbFileTypeXls } from "react-icons/tb";
import { FaFilePdf } from "react-icons/fa";

const ReportTable = () => {
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f4f2ff",
        color: "#6e6893",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "600",
        textTransform: "uppercase",
      },
    },
  };

  const columns = [
    { name: "Start Date", sortable: true, selector: (row) => row.fromDate },
    { name: "End Date", sortable: true, selector: (row) => row.toDate },
    { name: "From", selector: (row) => row.from },
    { name: "To", selector: (row) => row.to },
    { name: "DSA Amount", selector: (row) => row.dsaAmount },
  ];

  const data = [
    {
      id: 1,
      fromDate: "07/17/2024 10:07 AM",
      toDate: "07/17/2024 10:07 PM",
      from: "Bhutan",
      to: "Bhutan",
      dsaAmount: "2000",
    },
  ];

  const downloadExcel = () => {
    const wsName = "Sheet1";
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Define header styles
    const headerStyle = {
      fill: {
        fgColor: { rgb: "0000FF" },
      },
      font: {
        color: { rgb: "FFFFFF" },
        bold: true,
      },
      border: {
        top: { style: "thick" },
        bottom: { style: "thick" },
        left: { style: "thick" },
        right: { style: "thick" },
      },
    };

    // Add column headers starting from B3
    columns.forEach((col, index) => {
      const cellRef = XLSX.utils.encode_cell({ c: index + 1, r: 2 });
      ws[cellRef] = {
        v: col.name,
        s: headerStyle,
      };
    });

    // Add data starting from B4
    data.forEach((row, rowIndex) => {
      columns.forEach((col, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({
          c: colIndex + 1,
          r: rowIndex + 3,
        });
        ws[cellRef] = {
          v: col.selector(row),
          s: {
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          },
        };
      });
    });

    // Calculate the range
    const range = {
      s: { c: 1, r: 2 }, // Starting at B3
      e: { c: columns.length, r: data.length + 2 }, // Ending at the bottom-right of the data
    };
    ws["!ref"] = XLSX.utils.encode_range(range);

    XLSX.utils.book_append_sheet(wb, ws, wsName);
    XLSX.writeFile(wb, "report.xlsx");
  };

  // PDF styles
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontSize: 12,
    },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderColor: "#000",
      borderWidth: 1,
      overflow: "hidden",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      width: "20%",
      borderStyle: "solid",
      borderColor: "#000",
      borderWidth: 1,
      textAlign: "center",
    },
    headerPDF: {
      backgroundColor: "#396aff", // Blue background
      color: "#FFFFFF", // White text
      fontWeight: "bold",
      textAlign: "center",
      padding: 5,
    },
    button: {
      backgroundColor: "#007bff", // Blue background for button
      color: "#ffffff", // White text
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      textAlign: "center",
      display: "inline-block",
      textDecoration: "none",
      marginRight: "10px",
    },
  });

  // PDF Document Component
  const MyDocument = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {columns.map((col, index) => (
              <View key={index} style={styles.tableCol}>
                <Text style={styles.headerPDF}>{col.name}</Text>
              </View>
            ))}
          </View>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {columns.map((col, colIndex) => (
                <View key={colIndex} style={styles.tableCol}>
                  <Text>{col.selector(row)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="bg-white px-4 py-4 my-3">
      <div className="d-flex justify-content-end mb-3">
        <button onClick={downloadExcel} className="btn btn-success me-1">
          <TbFileTypeXls fontSize={20} />
        </button>
        <PDFDownloadLink
          document={<MyDocument />}
          fileName="report.pdf"
          className="btn btn-danger"
        >
          <FaFilePdf fontSize={20} />
        </PDFDownloadLink>
      </div>
      <DataTable columns={columns} data={data} customStyles={customStyles} />
    </div>
  );
};

export default ReportTable;
