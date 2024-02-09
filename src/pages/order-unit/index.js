import { useState, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Icon from 'src/@core/components/icon';
import PageHeader from 'src/@core/components/page-header';
import format from 'date-fns/format';
import CustomChip from 'src/@core/components/mui/chip';
import TableHeader from 'src/views/order-unit/TableHeader';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { listOrderUnit } from 'src/services/orderUnit';

import toast from 'react-hot-toast';
import { statusOrderUnit } from 'src/configs/constans';
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
const OrderUnit = () => {
  // ** State
  const [dataList, setDataList] = useState([]);
  const [dataListSearch, setDataListSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [value, setValue] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [endDateRange, setEndDateRange] = useState(null);
  const [startDateRange, setStartDateRange] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // ** Hooks

  const handleFilter = (val) => {
    setValue(val);
    const filteredData = requestSearch(val, dataList);
    setDataListSearch(filteredData);
  };

  const handleStatusValue = (e) => {
    setStatusValue(e.target.value);
  };

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    if (start !== null && end !== null) {
      setDates(dates);
    }
    setStartDateRange(start);
    setEndDateRange(end);
  };

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'Booking Code',
      renderCell: ({ row }) => (
        <LinkStyled
          href={`/order-unit/detail/${row?.order_id}`}>{`#${row?.booking_code}`}</LinkStyled>
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
            <IconButton size="small" component={Link} href={`/order-unit/detail/${row?.order_id}`}>
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const fetchDataList = async () => {
    const res = await listOrderUnit();
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

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <PageHeader
          title={<TypographyStyled variant="h5">Order Unit List</TypographyStyled>}
          subtitle={
            <Typography variant="body2">
              List of Customer Order Unit using RUMATKITA Apps
            </Typography>
          }
        />
        <Grid item xs={12}>
          {/* <Card>
            <CardHeader title="Filters" />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="invoice-status-select">Order Status</InputLabel>
                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label="Invoice Status"
                      onChange={handleStatusValue}
                      labelId="invoice-status-select">
                      <MenuItem value="">none</MenuItem>
                      {statusOrderUnit.map((item) => (
                        <MenuItem key={item?.id} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id="date-range-picker-months"
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        size="small"
                        dates={dates}
                        setDates={setDates}
                        label="Order Date"
                        end={endDateRange}
                        start={startDateRange}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card> */}
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              pagination
              disableColumnMenu
              loading={loading}
              rows={value ? dataListSearch : dataList}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
};

export default OrderUnit;
