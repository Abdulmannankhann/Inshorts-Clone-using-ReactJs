/*
import { useState, useEffect } from "react";
import PageHeader from "components/PageHeader";
import {
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  TablePagination,
  IconButton,
  Card,
} from "@material-ui/core";
import DataTable from "components/DataTable";
import Controls from "components/controls/Controls";
import {
  ClearOutlined,
  Edit,
  RemoveOutlined,
  Search,
  SecurityOutlined,
} from "@material-ui/icons";
import AddIcon from "@material-ui/icons/AddCircleOutlineTwoTone";
import DeleteIcon from "@material-ui/icons/Delete";
import ConfirmDialog from "components/ConfirmDialog";
import axios from "axios";
import { config } from "config";
import { useHistory } from "react-router-dom";
import CustomTooltip from "components/controls/Tooltip";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(4),
    border: "1px solid #ABABAB",
  },
  searchInput: {
    width: "40%",
    marginLeft: "0.6rem",
  },
}));

const headCells = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "group_name", label: "User Group" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function AdminUsers({ showLoader, hideLoader, setNotify }) {
  const classes = useStyles();
  const history = useHistory();
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [searchValue, setSearchValue] = useState("");
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const permissions = localStorage.getItem("Admin Users").split(",");

  useEffect(() => {
    window.localStorage.setItem("pageCountBo", 1);
    window.localStorage.setItem("rowPerPageBo", 10);
    window.localStorage.setItem("pageCount", 1);
    window.localStorage.setItem("rowPerPage", 10);
    getAdminUsers();
  }, [page, rowsPerPage, searched]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const { TblContainer, TblHead, recordsAfterSorting } = DataTable(
    records,
    headCells,
    filterFn
  );

  const getAdminUsers = async () => {
    showLoader();
    await axios
      .post(`${config.apiHost}/gyggs_api/admindata/listofAdminusers`, {
        page: page,
        limit: rowsPerPage,
        search_key: searchValue,
      })
      .then((response) => {
        hideLoader();
        setRecords(response.data.data);
        setCount(response.data.count);
      })
      .catch((error) => {
        hideLoader();
        setNotify({
          isOpen: true,
          message: error.response
            ? error.response.data.message
            : "Error while fetching admin users. Please try again.",
          type: "error",
        });
      });
  };

  const handleSearch = () => {
    if (searchValue !== "") {
      getAdminUsers();
      setSearched(true);
    }
  };

  const onDelete = async (id) => {
    await axios
      .post(`${config.apiHost}/gyggs_api/admindata/deleteAdmin`, {
        id: id,
      })
      .then((response) => {
        hideLoader();
        setNotify({
          isOpen: true,
          message: response.data.message,
          type: "Success",
        });
        getAdminUsers();
      })
      .catch((error) => {
        hideLoader();
        console.log(`Error:${error}`);
      });
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  const createNewUser = () => {
    history.push("/profile/adminusers/create", {
      propData: null,
      type: "create",
    });
  };

  const editUser = (data) => {
    history.push("/profile/adminusers/edit", { propData: data, type: "edit" });
  };

  return (
    <>
      <PageHeader
        title={"Admin Users"}
        headerIcon={<SecurityOutlined fontSize="large" />}
        subTitle={"All Admin Users"}
        buttons={
          permissions[1] === "1"
            ? [
                {
                  text: "Create New Admin User",
                  icon: <AddIcon />,
                  click: createNewUser,
                  background: "#5cb85c",
                },
              ]
            : []
        }
      />
      <Card className={classes.pageContent}>
        <Toolbar style={{ padding: 0 }}>
          <Controls.Input
            label="Search Admin Users"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              e.target.value.length === 0 && setSearched(false);
            }}
            className={classes.searchInput}
            onKeyDown={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchValue.length ? (
                    <CustomTooltip title="Clear">
                      <IconButton
                        onClick={() => {
                          setSearchValue("");
                          setSearched(false);
                        }}
                      >
                        <ClearOutlined />
                      </IconButton>
                    </CustomTooltip>
                  ) : null}
                  <CustomTooltip title="Search">
                    <IconButton
                      onClick={handleSearch}
                      disabled={searchValue.length ? false : true}
                    >
                      <Search />
                    </IconButton>
                  </CustomTooltip>
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterSorting().map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.group_name}</TableCell>
                <TableCell>
                  {permissions[2] === "1" ? (
                    <Controls.ActionButton
                      color="primary"
                      tooltip={"Edit"}
                      onClick={() => editUser(item)}
                    >
                      <Edit fontSize="small" />
                    </Controls.ActionButton>
                  ) : (
                    <IconButton disabled>
                      <RemoveOutlined />
                    </IconButton>
                  )}
                  {permissions[3] === "1" ? (
                    <Controls.ActionButton
                      color="secondary"
                      tooltip={"Delete"}
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure to delete this user ?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            onDelete(item.id);
                          },
                        });
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Controls.ActionButton>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TablePagination
          component="div"
          page={page - 1}
          rowsPerPageOptions={[10, 25, 50, 100]}
          rowsPerPage={rowsPerPage}
          count={count}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Card>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
