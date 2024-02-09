import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { DataGrid } from '@mui/x-data-grid';
import Icon from 'src/@core/components/icon';
import PageHeader from 'src/@core/components/page-header';
import { useDispatch, useSelector } from 'react-redux';
import CustomAvatar from 'src/@core/components/mui/avatar';
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal';
import { getInitials } from 'src/@core/utils/get-initials';
import { fetchData, deleteUser } from 'src/store/apps/user';
import axios from 'axios';
import TableHeader from 'src/views/customers/TableHeader';
import AddUserDrawer from 'src/views/customers/AddUserDrawer';

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  fontWeight: 800,
  color: theme.palette.primary.main
}));

const userRoleObj = {
  Google: { icon: 'mdi:google', color: 'error.main' },
  Facebook: { icon: 'mdi:facebook', color: 'info.main' },
  Phone: { icon: 'mdi:phone-outline', color: 'warning.main' }
};

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}));

// ** renders client column
const renderClient = (row) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 30, height: 30 }} />;
  } else {
    return (
      <CustomAvatar
        skin="light"
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}>
        {getInitials(row.fullName ? row.fullName : 'John Doe')}
      </CustomAvatar>
    );
  }
};

const RowOptions = ({ id }) => {
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

  const handleDelete = () => {
    dispatch(deleteUser(id));
    handleRowOptionsClose();
  };

  return (
    <>
      <IconButton size="small" component={Link} href={`/customers/detail`}>
        <Icon icon="mdi:eye-outline" fontSize={20} />
      </IconButton>
    </>
  );
};

const columns = [
  {
    flex: 0.2,
    minWidth: 200,
    field: 'fullName',
    headerName: 'Customer Name',
    renderCell: ({ row }) => {
      const { fullName, username } = row;

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <LinkStyled href="/apps/user/view/overview/">{fullName}</LinkStyled>
            <Typography noWrap variant="caption">
              {`Laki - laki`} | {`75 tahun`}
            </Typography>
          </Box>
        </Box>
      );
    }
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.email}
        </Typography>
      );
    }
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'phone',
    headerName: 'Phone Number',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.contact ?? '-'}
        </Typography>
      );
    }
  },
  {
    flex: 0.15,
    field: 'role',
    minWidth: 150,
    headerName: 'Registration Source',
    renderCell: ({ row }) => {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& svg': { mr: 3, color: userRoleObj[row?.role].color }
          }}>
          <Icon icon={userRoleObj[row?.role].icon} fontSize={20} />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.role}
          </Typography>
        </Box>
      );
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
    headerName: 'MR Number',
    field: 'currentPlan',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          MR{+row?.id + 50}12355{+row?.id + 100}
        </Typography>
      );
    }
  },
  {
    flex: 0.1,
    minWidth: 50,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
];

const Customers = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('');
  const [plan, setPlan] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // ** Hooks
  const dispatch = useDispatch();
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

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<TypographyStyled variant="h5">Customers List</TypographyStyled>}
        subtitle={<Typography variant="body2">List of Customer using RUMATKITA Apps</Typography>}
      />
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon} />} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Search Filters" />
          {/* <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
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
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="plan-select">Select Plan</InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id="select-plan"
                    label="Select Plan"
                    labelId="plan-select"
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}>
                    <MenuItem value="">Select Plan</MenuItem>
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-select">Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id="select-status"
                    label="Select Status"
                    labelId="status-select"
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Role' }}>
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent> */}
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics');
  const apiData = res.data;

  return {
    props: {
      apiData
    }
  };
};

export default Customers;
