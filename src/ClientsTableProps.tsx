import React, { useEffect, useMemo, useState } from "react";
import { IClientDto } from "../../../models/client/newRegisterAgent/IClientDto"; // Ensure the path is correct
import Pagination from "./Pagination"; // Check path and export/import
import { MdMarkunreadMailbox } from "react-icons/md"; // Ensure the icon package is installed
import MailboxModal from "./clientDashboard/clientProfileCard/MailboxModal"; // Verify path
import { Column, useTable, useSortBy, Row, useRowSelect } from "react-table"; // Ensure react-table is installed
import tw from "twin.macro"; // Ensure twin.macro is installed


interface ClientsTableProps {
  clients: IClientDto[];
  setSClients: React.Dispatch<React.SetStateAction<IClientDto[]>>;
  setSelectedClient: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  setSClients,
  setSelectedClient,
}) => {
  const Table = tw.table`
    table-fixed
    text-base
    text-gray-900
  `;

  const TableHead = tw.thead`
    p-2
  `;

  const TableRow = tw.tr`
    border
    border-green-500
  `;

  const TableHeader = tw.th`
    border
    border-green-500
    p-2
    cursor-pointer
  `;

  const TableBody = tw.tbody``;

  const TableData = tw.td`
    border
    border-green-500
    p-5
    cursor-pointer
  `;

  const Button = tw.button`
    pl-4
    pr-4
    pt-2
    pb-2
    text-black
    rounded-md
    bg-green-300
    hover:bg-green-200
    transition-colors
  `;

  const [currentPage, setCurrentPage] = useState(1);
  const [clientId, setClientId] = useState(0);
  const [currentPageContent, setCurrentPageContent] = useState<IClientDto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedmailBox, setSelectedmailBox] = useState<
    number | null | undefined
  >(null);

  const clientsData = useMemo(() => [...currentPageContent], [currentPageContent]);

  const clientColumns: Array<Column<IClientDto>> = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "firstName",
        Cell: ({ row }: { row: Row<IClientDto> }) => (
          <span
            onClick={() => handleSelectedClientClick(row.original.id)}
          >
            {`${row.original.firstName} ${row.original.lastName}`}
          </span>
        ),
      },
      {
        Header: "Company Name",
        accessor: "companyName",
      },
      {
        Header: "Mailbox Number",
        accessor: "mailboxNumber",
        Cell: ({ row }: { row: Row<IClientDto> }) => (
          <>
            {row.original.hasMailbox &&
            !(row.original.mailboxNumber && row.original.mailboxNumber !== 0) ? (
              <a
                onClick={() => handleOpenModal(row.original.id)}
                style={{ color: "#0d6efd" }}
              >
                <MdMarkunreadMailbox />
              </a>
            ) : (
              row.original.mailboxNumber && (
                <span>
                  <MdMarkunreadMailbox /> {row.original.mailboxNumber}
                </span>
              )
            )}
          </>
        ),
      },
      {
        Header: "Service Package",
        Cell: ({ row }: { row: Row<IClientDto> }) => (
          <div>
            {row.original.clientService?.service?.servicesPackages[0]?.name}
          </div>
        ),
      },
      {
        Header: "Service Opt-In Date",
        Cell: ({ row }: { row: Row<IClientDto> }) =>
          row.original.clientService?.serviceOptInDate ? (
            new Date(
              row.original.clientService?.serviceOptInDate
            ).toLocaleDateString("en-US", { dateStyle: "short" })
          ) : (
            ""
          ),
      },
      {
        Header: "Status",
        Cell: ({ row }: { row: Row<IClientDto> }) => (
          <span style={{ color: row.original.users[0].active ? "green" : "red" }}>
            {row.original.users[0].active ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns: clientColumns,
      data: clientsData,
    },
    useSortBy,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const totalPages = Math.ceil(clients.length / 20);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setCurrentPageContent(
      clients.slice((page - 1) * 20, page * 20)
    );
  };

  useEffect(() => {
    handlePageChange(1);
  }, [clients]);

  useEffect(() => {
    if (selectedmailBox) {
      const updatedData = currentPageContent.map((item) =>
        item.id === clientId
          ? { ...item, mailboxNumber: selectedmailBox }
          : item
      );
      setCurrentPageContent(updatedData);
    }
  }, [selectedmailBox]);

  const handleSelectedClientClick = (clientId: number) => {
    setSelectedClient(clientId);
    // Navigate to client details page
  };

  const handleOpenModal = (clientId: number) => {
    setClientId(clientId);
    setShowModal(true);
  };

  const isEven = (idx: number) => idx % 2 === 0;

  return (
    <>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <TableHeader {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                className={isEven(idx) ? "bg-green-400 bg-opacity-30" : ""}
                onClick={() => handleSelectedClientClick(row.original.id)}
              >
                {row.cells.map((cell) => (
                  <TableData {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableData>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <MailboxModal
        setMailboxNumber={setSelectedmailBox}
        clientId={clientId}
        showModal={showModal}
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default ClientsTable;
