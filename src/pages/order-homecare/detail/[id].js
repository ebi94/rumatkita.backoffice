import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CustomChip from 'src/@core/components/mui/chip';
import Icon from 'src/@core/components/icon';
import PageHeader from 'src/@core/components/page-header';
import { detailOrderHomecare, updateStatusOrderHomecare } from 'src/services/orderHomecare';
import { statusOrderHomecare } from 'src/configs/constans';
import { selectColor } from 'src/utils/helpers';
import UnitListDialog from 'src/views/order-homecare/UnitListDialog';

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  fontWeight: 800,
  color: theme.palette.primary.main
}));

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.customColors.tableHeaderBg,
  '&.MuiCardHeader-root': {
    padding: '1rem 1.25rem !important'
  },
  '&.MuiCardHeader-title': {
    fontSize: '1rem',
    color: theme.palette.customColors.darkBg
  }
}));

const titleStyle = { fontWeight: 500, fontSize: '0.875rem' };

const gridTitle = {
  display: 'flex',
  justifyContent: 'space-between',
  paddingRight: '10px',
  alignItems: 'flex-start'
};

const OrderHomeCareDetail = () => {
  const router = useRouter();
  const orderId = router.query.id;

  const [dataDetail, setDataDetail] = useState({});
  const [openChooseUnit, setOpenChooseUnit] = useState(false);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);
  const [statusSelected, setStatusSelected] = useState('');
  const [reason, setReason] = useState(' ');

  const fetchOrderDetail = async () => {
    const res = await detailOrderHomecare(orderId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      setDataDetail(data);
    } else {
      toast.error(`Status Code : ${res?.error}`);
    }
  };

  const handleSubmitChangeStatus = async (status, clinicId, nurseId) => {
    setLoadingUpdateStatus(true);
    const payload = {
      status: status,
      reason,
      clinic_id: clinicId,
      nurse_id: nurseId
    };
    const res = await updateStatusOrderHomecare(orderId, payload);
    if (+res?.result?.status === 200) {
      fetchOrderDetail();
      setLoadingUpdateStatus(false);
      setOpenChangeStatus(false);
      setOpenChooseUnit(false);
      toast.success(res?.result?.message);
    } else {
      setLoadingUpdateStatus(false);
      toast.error(`Status Code : ${res?.error}`);
    }
  };

  useEffect(() => {
    if (orderId !== undefined) fetchOrderDetail();
  }, [orderId]);

  return (
    <>
      <Grid container spacing={6} className="match-height">
        <PageHeader
          title={
            <TypographyStyled variant="h5">
              Booking Code: #{dataDetail?.booking_code}
            </TypographyStyled>
          }
          subtitle={<Typography variant="body2"></Typography>}
        />

        <Grid item md={6} sm={6} xs={12}>
          <Card>
            <CardHeaderStyled title="Detail Order Homecare" />
            <Divider sx={{ my: '0 !important' }} />
            <CardContent>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={3} sx={gridTitle}>
                  <Typography sx={titleStyle}>Booking Code</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={9}>
                  <Typography variant="body2">{dataDetail?.booking_code}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={3} sx={gridTitle}>
                  <Typography sx={titleStyle}>Status Booking</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={9}>
                  <Typography variant="body2">
                    <CustomChip
                      size="small"
                      skin="dark"
                      color={selectColor(dataDetail?.status)}
                      label={`${dataDetail?.status}`}
                      sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
                    />
                  </Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={3} sx={gridTitle}>
                  <Typography sx={titleStyle}>Booking Date</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={9}>
                  <Typography variant="body2">{dataDetail?.date}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={3} sx={gridTitle}>
                  <Typography sx={titleStyle}>Unit</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={9}>
                  <Typography variant="body2">{dataDetail?.clinic?.name}</Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={8}></Grid>
                <Grid item md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setOpenChangeStatus(true)}
                    size="small">
                    Change Status
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Card>
            <CardHeaderStyled title="Detail Patient" />
            <Divider sx={{ my: '0 !important' }} />
            <CardContent>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>Full Name</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">{dataDetail?.patient?.name}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>Age</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">{dataDetail?.patient?.age}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>Place & Date of Birth</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">{dataDetail?.patient?.date_of_birth}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>PIC Name</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">{dataDetail?.patient?.pic_name}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>PIC Contact</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">{dataDetail?.patient?.pic_phone}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Card>
            <CardHeaderStyled title="Detail Unit" />
            <Divider sx={{ my: '0 !important' }} />
            <CardContent>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={3} sx={gridTitle}>
                  <Typography sx={titleStyle}>Unit</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={9}>
                  <Typography variant="body2">{dataDetail?.clinic?.name ?? '-'}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={3} sx={gridTitle}>
                  <Typography sx={titleStyle}>Address</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={9}>
                  <Typography variant="body2">
                    {dataDetail?.clinic?.complete_address ?? '-'}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={3} sx={gridTitle}>
                  <Typography sx={titleStyle}>Phone</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={9}>
                  <Typography variant="body2">{dataDetail?.clinic?.phone ?? '-'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Card>
            <CardHeaderStyled title="Detail Transactions" />
            <Divider sx={{ my: '0 !important' }} />
            <CardContent>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>Total</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">{dataDetail?.transaction?.total ?? '-'}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>Payment Method</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">
                    {dataDetail?.transaction?.paymnent_method ?? '-'}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>Payment Status</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">
                    {dataDetail?.clinic?.payment_status ?? '-'}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={6}></Grid>
                <Grid item md={6}>
                  <Button
                    fullWidth
                    color="error"
                    variant="contained"
                    onClick={() => setOpenChangeStatus(true)}
                    size="small"
                    startIcon={<Icon icon="mdi:download" />}>
                    Download Invoice
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Card>
            <CardHeaderStyled title="Detail Nurse" />
            <Divider sx={{ my: '0 !important' }} />
            <CardContent>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>Name</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">{dataDetail?.nurse?.name ?? '-'}</Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ mb: 2 }}>
                <Grid item md={4} sx={gridTitle}>
                  <Typography sx={titleStyle}>Phone</Typography>
                  <Typography sx={titleStyle}>:</Typography>
                </Grid>
                <Grid item md={8}>
                  <Typography variant="body2">{dataDetail?.nurse?.phone ?? '-'}</Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={8}></Grid>
                <Grid item md={4}>
                  <Button
                    color="info"
                    variant="contained"
                    onClick={() => setOpenChooseUnit(true)}
                    size="small"
                    startIcon={<Icon icon="mdi:account-convert-outline" />}>
                    Change Nurse
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={openChangeStatus}
        onClose={() => setOpenChangeStatus(false)}>
        <DialogTitle>Change Status Order</DialogTitle>
        <DialogContent>
          <form>
            <FormControl sx={{ mt: 4, mb: 4, width: '100%' }} size="small">
              <InputLabel id="demo-dialog-select-label">Status</InputLabel>
              <Select
                label="Status"
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                disabled={loadingUpdateStatus}
                defaultValue="">
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {statusOrderHomecare.map((item) => (
                  <MenuItem
                    key={item?.id}
                    value={item?.value}
                    onClick={() => setStatusSelected(item?.label)}>
                    {item?.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {statusSelected === 'Cancelled' ? (
              <FormControl sx={{ mt: 4, mb: 4, width: '100%' }}>
                <TextField
                  required
                  size="small"
                  value={reason}
                  disabled={loadingUpdateStatus}
                  label="Reason"
                  onChange={(e) => setReason(e?.target?.value)}
                  placeholder="Reason"
                  error={+reason?.length === 0}
                />
                {+reason?.length === 0 && (
                  <FormHelperText sx={{ color: 'error.main' }}>Reason is required</FormHelperText>
                )}
              </FormControl>
            ) : (
              <></>
            )}
          </form>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            color="warning"
            fullWidth
            onClick={() => setOpenChangeStatus(false)}
            variant="contained"
            size="small"
            disabled={loadingUpdateStatus}>
            Cancel
          </Button>
          <Button
            color="success"
            fullWidth
            onClick={() => handleSubmitChangeStatus(statusSelected, '', '')}
            variant="contained"
            size="small"
            disabled={
              loadingUpdateStatus || (reason?.length === 0 && statusSelected === 'Cancelled')
            }>
            {loadingUpdateStatus ? <CircularProgress size={20} /> : 'Submit Change'}
          </Button>
        </DialogActions>
      </Dialog>
      <UnitListDialog
        loading={loadingUpdateStatus}
        bookingData={dataDetail}
        submitNurse={(clinic, nurse) => {
          handleSubmitChangeStatus('Assigned', clinic?.clinic_id, nurse?.nurse_id);
        }}
        open={openChooseUnit}
        toggle={() => setOpenChooseUnit(!openChooseUnit)}
      />
    </>
  );
};

export default OrderHomeCareDetail;
