import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import Icon from 'src/@core/components/icon';
import PageHeader from 'src/@core/components/page-header';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'src/hooks/useAuth';
import CustomChip from 'src/@core/components/mui/chip';
import CustomAvatar from 'src/@core/components/mui/avatar';
import { getInitials } from 'src/@core/utils/get-initials';
import { fetchData, deleteUser } from 'src/store/apps/user';
import TableHeader from 'src/views/users/list/TableHeader';
import AddUserDrawer from 'src/views/users/list/AddUserDrawer';
import { listUser } from 'src/services/users';

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  fontWeight: 800,
  color: theme.palette.primary.main
}));

const userStatusObj = {
  active: 'success',
  inactive: 'secondary'
};

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.80rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '&:hover': {
    color: theme.palette.primary.main
  }
}));

// ** renders client column
const renderClient = (row) => {
  if (row?.avatar?.length) {
    return <CustomAvatar src={row?.avatar} sx={{ mr: 3, width: 30, height: 30 }} />;
  } else {
    return (
      <CustomAvatar
        skin="light"
        color={row?.avatarColor || 'primary'}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}>
        {getInitials(row?.name ? row?.name : 'John Doe')}
      </CustomAvatar>
    );
  }
};

const RowOptions = ({ id, onClickEdit, onClickDetail }) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleClickEdit = () => {
    handleRowOptionsClose();
    onClickEdit();
  };

  const handleClickDetail = () => {
    handleRowOptionsClose();
    onClickDetail();
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <Icon icon="mdi:dots-vertical" />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}>
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleClickDetail}>
          <Icon icon="mdi:eye-outline" fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleClickEdit} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon="mdi:pencil-outline" fontSize={20} />
          Edit
        </MenuItem>
      </Menu>
    </>
  );
};

const UsersList = () => {
  // ** State

  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [role, setRole] = useState('');
  const [plan, setPlan] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');
  const [typeForm, setTypeForm] = useState('Add');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // ** Hooks
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const store = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    );
  }, [dispatch, plan, role, status, value]);

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  const handleRoleChange = useCallback((e) => {
    setRole(e.target.value);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setStatus(e.target.value);
  }, []);

  const toggleAddUserDrawer = () => {
    setTypeForm('Add');
    setDataDetail({});
    setAddUserOpen(!addUserOpen);
  };

  const toggleEditUserDrawer = (e) => {
    setTypeForm('Edit');
    setDataDetail(e);
    setAddUserOpen(!addUserOpen);
  };

  const toggleDetailUserDrawer = (e) => {
    setTypeForm('Detail');
    setDataDetail(e);
    setAddUserOpen(!addUserOpen);
  };

  const columns = [
    {
      flex: 0.2,
      width: 230,
      field: 'name',
      headerName: 'User Name',
      renderCell: ({ row }) => {
        const { name, username } = row;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <LinkStyled href="/apps/user/view/overview/">{name}</LinkStyled>
              <Typography noWrap variant="caption">
                {`@${username}`}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      flex: 0.1,
      width: 100,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant="caption" sx={{ color: 'text.primary' }}>
            {row.email}
          </Typography>
        );
      }
    },
    {
      flex: 0.07,
      field: 'role',
      width: 70,
      headerName: 'Role',
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}>
            <Typography
              noWrap
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
              variant="caption">
              {row?.role?.name}
            </Typography>
          </Box>
        );
      }
    },
    {
      flex: 0.1,
      field: 'created',
      width: 80,
      headerName: 'Created At',
      renderCell: ({ row }) => {
        // const parsedDate = parseISO(row?.created_at);
        // const formattedDate = format(parsedDate, 'dd MMM yyyy');

        return (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
              variant="caption">
              by: {row?.created_by}
            </Typography>
            <Typography
              noWrap
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
              variant="caption">
              {row?.created_at}
            </Typography>
          </Box>
        );
      }
    },
    {
      flex: 0.07,
      width: 90,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            skin="light"
            size="small"
            label={row?.is_active ? 'Active' : 'Inactive'}
            color={userStatusObj[row?.is_active ? 'active' : 'inactive']}
            sx={{ textTransform: 'capitalize' }}
          />
        );
      }
    },
    {
      flex: 0.07,
      width: 50,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <RowOptions
          id={row.id}
          onClickEdit={() => toggleEditUserDrawer(row)}
          onClickDetail={() => toggleDetailUserDrawer(row)}
        />
      )
    }
  ];

  const fetchUserslist = async () => {
    setLoading(true);
    const res = await listUser();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      if (+data.length > 0) {
        setLoading(false);

        const mappingDataList = data.map((item) => {
          return {
            id: item?.user_id,
            ...item
          };
        });
        setDataList(mappingDataList);
      } else {
        setLoading(false);
        setDataList([]);
      }
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error} ${res?.status}`);
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    fetchUserslist();
  }, []);

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<TypographyStyled variant="h5">Users List</TypographyStyled>}
        subtitle={<Typography variant="body2">List of Users using RUMATKITA Backoffice</Typography>}
      />
      <Grid item xs={12}>
        <Card sx={{ display: 'none' }}>
          <CardHeader title="Search Filters" />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="role-select">Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id="select-role"
                    label="Select Role"
                    labelId="role-select"
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}>
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="editor">Editor</MenuItem>
                    <MenuItem value="maintainer">Maintainer</MenuItem>
                    <MenuItem value="subscriber">Subscriber</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-select">Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id="select-status"
                    label="Select Status"
                    labelId="status-select"
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Status' }}>
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rows={dataList}
            loading={loading}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
        type={typeForm}
        dataDetail={dataDetail}
        onRefresh={fetchUserslist}
      />
    </Grid>
  );
};

export default UsersList;
