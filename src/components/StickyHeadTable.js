import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

export default function StickyHeadTable({
  columnsArray,
  dataArray,
  headingAlignment,
  dataAlignment,
  firstPage,
}) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    if (dataArray) {
      setData(dataArray);
    }
  }, [dataArray]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(firstPage || 10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ padding: "8px" }}>
                #
              </TableCell>
              {columnsArray.map((column) => (
                <TableCell
                  key={column.id}
                  align={headingAlignment || "right"}
                  sx={{ padding: "8px", minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isLastRow =
                  page * rowsPerPage + index + 1 === data.length;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    sx={{
                      fontWeight: isLastRow ? "bold" : "normal",
                      backgroundColor: isLastRow ? "#f0f0f0" : "inherit",
                    }}
                  >
                    <TableCell align="center" sx={{ padding: "8px" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    {columnsArray.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={dataAlignment || "right"}
                          sx={{ padding: "8px" }}
                        >
                          {column.format && typeof value === "string"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[firstPage || 10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
