import { useState, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import PageHeader from 'src/@core/components/page-header';
import Icon from 'src/@core/components/icon';
import format from 'date-fns/format';
import CustomChip from 'src/@core/components/mui/chip';
import TableHeader from 'src/views/apps/invoice/list/TableHeader';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { listOrderHomecare } from 'src/services/orderHomecare';
import { requestSearch } from 'src/@core/utils/request-search';

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  fontWeight: 800,
  color: theme.palette.primary.main
}));

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}));

/* eslint-disable */
const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : '';
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null;
  const value = `${startDate}${endDate !== null ? endDate : ''}`;
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null;
  const updatedProps = { ...props };
  delete updatedProps.setDates;
  return (
    <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
  );
});

/* eslint-enable */
const OrderHomecare = () => {
  // ** State
  const [dataList, setDataList] = useState([]);
  const [dataListSearch, setDataListSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const handleFilter = (val) => {
    setValue(val);
    const filteredData = requestSearch(val, dataList);
    setDataListSearch(filteredData);
  };

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'Booking Code',
      renderCell: ({ row }) => (
        <LinkStyled
          href={`/order-homecare/detail/${row?.order_id}`}>{`#${row?.booking_code}`}</LinkStyled>
      )
    },
    {
      flex: 0.2,
      field: 'name',
      minWidth: 300,
      headerName: 'Customer',
      renderCell: ({ row }) => {
        const { patient } = row;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* {renderClient(row)} */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {patient?.name}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'inline-flex' }}>
                <Typography noWrap variant="caption">
                  {patient?.gender === 'Male' ? 'Laki-laki' : 'Wanita'}
                </Typography>
                <Typography sx={{ marginLeft: 1 }} variant="body2">
                  | {patient?.age}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      }
    },
    {
      flex: 0.15,
      minWidth: 90,
      field: 'unit',
      headerName: 'Unit',
      renderCell: ({ row }) => <Typography variant="body2">{row?.unit}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 125,
      field: 'bookingDate',
      headerName: 'Booking Date',
      renderCell: ({ row }) => <Typography variant="body2">{row?.date}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 90,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => {
        return row?.status === 'Booked' ? (
          <CustomChip size="small" skin="light" color="info" label={row?.status} />
        ) : (
          <CustomChip size="small" skin="light" color="success" label={row?.status} />
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="View Detail Order">
            <IconButton
              size="small"
              component={Link}
              href={`/order-homecare/detail/${row?.order_id}`}>
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const fetchDataList = async () => {
    const res = await listOrderHomecare();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingDataList = data.map((item) => {
        return {
          id: item?.order_id,
          ...item?.patient,
          ...item
        };
      });
      setDataList(mappingDataList);
      setLoading(false);
    } else {
      toast.error(`Status Code : ${res?.result?.status}`);
      setLoading(false);
    }
  };

  // const fetchDataClinic = async () => {
  //   const res = await listClinic();
  //   if (+res?.result?.status === 200) {
  //     const data = res?.result?.data;

  //     const mappingDataList = data.map((item) => {
  //       return {
  //         id: item?.clinic_id,
  //         ...item
  //       };
  //     });
  //     setDataList(mappingDataList);
  //     setLoading(false);
  //   } else {
  //     toast.error(`Status Code : ${res?.result?.status}`);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchDataList();

    // fetchDataClinic();
  }, []);

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <PageHeader
          title={<TypographyStyled variant="h5">Order Homecare List</TypographyStyled>}
          subtitle={
            <Typography variant="body2">
              List of Customer Order Homecare using RUMATKITA Apps
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              pagination
              disableColumnMenu
              rows={value ? dataListSearch : dataList}
              columns={columns}
              loading={loading}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
};

export default OrderHomecare;
