// This table is a heavily modified version from Material-ui table 
// https://material-ui.com/components/tables/

import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import { ITask } from './ITask';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof ITask;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] =
  [
    { id: 'name', numeric: false, disablePadding: true, label: 'Tasks ' },
    { id: 'description', numeric: true, disablePadding: false, label: 'Description' },
    { id: 'due', numeric: true, disablePadding: false, label: 'Due' },
    { id: 'priority', numeric: false, disablePadding: false, label: 'Priority' },
    { id: 'tag', numeric: true, disablePadding: false, label: 'Tag' },
  ];


interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ITask) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof ITask) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all tasks' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight: {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.secondary.light,
    },
    title: {
      flex: '1 1 100%',
    },
    titleWhite: {
      flex: '1 1 100%',
      color: '#fff'
    },
    flex: {
      display: 'flex',
    },

  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedList: any,
  deleteTask: Function,
  updateTask: Function,
  handleClearSelected: Function
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedList, deleteTask, updateTask, handleClearSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.titleWhite} variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            List
          </Typography>
        )}
      {numSelected > 0 ? (
        <div className={classes.flex} >
          <Tooltip title="Delete">
            <IconButton
              aria-label="delete"
              onClick={() => {
                selectedList.forEach((element: { id: number; }) => {
                  deleteTask(element.id);
                })
                handleClearSelected();
              }} >

              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Done">
            <IconButton
              aria-label="done"
              onClick={() => {
                selectedList.forEach((element: { done: boolean; id: number; }) => {
                  updateTask(!element.done, element.id);
                })
                handleClearSelected();
              }} >
              <DoneIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) :
        <div>
        </div>}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    rowStrikeThrough: {
      textDecoration: 'line-through',
      backgroundColor: '#FAFAFA',
    },
  }),
);


function convertPriority(value: any) {
  switch (value) {
    case 1: return "Low";
    case 2: return "Medium";
    case 3: return "High";
    default: return "Medium";
  }
}

export default function EnhancedTable(props: any) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof ITask>('description');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const rows: any = props.taskList;

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ITask) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n: any) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClearSelected = () => {
    setSelected([]);
  }

  const handleClick = (event: React.MouseEvent<unknown>, row: any) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(row);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: any) => selected.indexOf(name) !== -1;

  const convertDate = (date: any) => {
    return moment(date).fromNow();
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedList={selected}
          deleteTask={props.deleteTask}
          updateTask={props.updateTask}
          handleClearSelected={handleClearSelected}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      className={row.done ? classes.rowStrikeThrough : ''}
                      onClick={(event) => {
                        const selectedIndex = row.id;
                        props.editTask(selectedIndex)
                      }
                      }
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleClick(event, row)}
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.description}</TableCell>
                      <TableCell align="right">{convertDate(row.due)}</TableCell>
                      <TableCell align="left">{convertPriority(row.priority)}</TableCell>
                      <TableCell align="right">{row.tag}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        className="colorWhite"
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
