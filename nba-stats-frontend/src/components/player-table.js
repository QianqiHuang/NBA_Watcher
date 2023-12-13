import {
  Avatar,
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import React, {  useState } from 'react';
import { TableSortLabel } from '@mui/material';

export const PlayersTable = (props) => {
  const items = props.items;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for sorting
  const [orderDirection, setOrderDirection] = useState('desc');
  const [orderBy, setOrderBy] = useState('fg'); // default sort by player name

  // Handler for changing the page
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // You might want to fetch new data based on the new page here
  };

  // Handler for changing the number of rows per page
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing the number of rows per page
    // You might want to fetch new data based on the new rows per page here
  };
  const handleSortRequest = (field) => {
    const isAsc = orderBy === field && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  // Sort items (client-side sorting for simplicity)
  const sortedItems = items.sort((a, b) => {
    if (orderBy === 'player_name') {
      // Assuming 'player_name' is a string
      return orderDirection === 'asc' ? a.player_name.localeCompare(b.player_name) : b.player_name.localeCompare(a.player_name);
    }
    else return (orderDirection === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy])
    // Implement sorting logic for other fields similarly
    // For numbers you can simply subtract: (orderDirection === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy])
  });


  return (
    <Card>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                <TableSortLabel
                  active={orderBy === 'player_name'}
                  direction={orderBy === 'player_name' ? orderDirection : 'asc'}
                  onClick={() => handleSortRequest('player_name')}
                >
                  Name
                  </TableSortLabel>

                </TableCell>
                <TableCell>
                  Team
                </TableCell>
                <TableCell>
                <TableSortLabel
                  active={orderBy === 'pts'}
                  direction={orderBy === 'pts' ? orderDirection : 'asc'}
                  onClick={() => handleSortRequest('pts')}
                >
                  Points
                  </TableSortLabel>

                </TableCell>
                <TableCell>
                <TableSortLabel
                  active={orderBy === 'trb'}
                  direction={orderBy === 'trb' ? orderDirection : 'asc'}
                  onClick={() => handleSortRequest('trb')}
                >
                  Rebounds
                  </TableSortLabel>

                </TableCell>
                <TableCell>
                <TableSortLabel
                  active={orderBy === 'ast'}
                  direction={orderBy === 'ast' ? orderDirection : 'asc'}
                  onClick={() => handleSortRequest('ast')}
                >
                  Assits
                  </TableSortLabel>

                </TableCell>
                <TableCell>
                <TableSortLabel
                  active={orderBy === 'blk'}
                  direction={orderBy === 'blk' ? orderDirection : 'asc'}
                  onClick={() => handleSortRequest('blk')}
                >
                  Blocks
                  </TableSortLabel>

                </TableCell>
                <TableCell>
                <TableSortLabel
                  active={orderBy === 'stl'}
                  direction={orderBy === 'stl' ? orderDirection : 'asc'}
                  onClick={() => handleSortRequest('stl')}
                >
                  Steals
                  </TableSortLabel>

                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

      

              {sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((player) => {
                return (
                  <TableRow
                    hover
                    key={player.id}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={player.avatar_url} />
                        
                        <Typography variant="subtitle2">
                          {player.player_name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {player.tm}
                    </TableCell>
                    <TableCell>
                      {player.pts}
                    </TableCell>
                    <TableCell>
                      {player.trb}
                    </TableCell>
                    <TableCell>
                      {player.ast}
                    </TableCell>
                    <TableCell>
                      {player.blk}
                    </TableCell>
                    <TableCell>
                      {player.stl}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      <TablePagination
        component="div"
        count={items.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};


