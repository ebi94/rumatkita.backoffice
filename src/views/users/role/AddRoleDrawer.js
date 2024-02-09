import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { addUser, editUser } from 'src/services/users';
import { useAuth } from 'src/hooks/useAuth';
import Icon from 'src/@core/components/icon';
import { listRole } from 'src/services/roles';
import { listPermission } from 'src/services/permissions';

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return '';
  }
};

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const schema = yup.object().shape({
  email: yup.string().email().required(),
  fullname: yup
    .string()
    .min(3, (obj) => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  username: yup
    .string()
    .min(3, (obj) => showErrors('User Name', obj.value.length, obj.min))
    .required()
});

const AddRoleDrawer = (props) => {
  // ** Props
  const { open, toggle, type, dataDetail, onRefresh } = props;

  // ** State
  const [loading, setLoading] = useState(false);
  const [permissionList, setPermissionList] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);

  const { logout } = useAuth();

  const emptyDefaultValues = {
    name: ''
  };

  const defaultValues = {
    name: dataDetail?.name ?? ''
  };

  const handleSelectAllCheckbox = () => {};

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: type === 'Add' ? emptyDefaultValues : defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const onReset = () => {
    reset({ name: '' });
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      name: data?.name
    };

    const payloadEdit = {
      role_id: dataDetail?.role_id,
      name: data?.name
    };

    if (type === 'Add') {
      const res = await addUser(payload);
      if (+res?.result?.status === 201) {
        setLoading(false);
        toast.success('Created User Success');
        onReset();
        onRefresh();
        toggle();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    } else {
      const res = await editUser(payloadEdit);
      if (+res?.result?.status === 200) {
        setLoading(false);
        toast.success('Updated Success');
        onReset();
        onRefresh();
        toggle();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    }
  };

  const handleClose = () => {
    setValue('name', '');
    toggle();
    onReset();
  };

  const fetchPemissionsList = async () => {
    const res = await listPermission();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingDataList = data.map((item) => {
        return {
          id: item?.menu_id,
          ...item
        };
      });
      setPermissionList(mappingDataList);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error} `);
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (dataDetail !== undefined && type === 'Edit') {
      setValue('name', dataDetail?.name ?? '');
    }
  }, [dataDetail, type, setValue]);

  useEffect(() => {
    fetchPemissionsList();
  }, []);

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 'calc(100vw - 270px)' } } }}>
      <Header>
        <Typography variant="h6">{type} Role</Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon="mdi:close" fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6, mt: 3 }} size="small">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  size="small"
                  InputLabelProps={type !== 'Add' ? { shrink: true } : {}}
                  value={value}
                  label="Name"
                  onChange={onChange}
                  placeholder="Name"
                  disabled={loading}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
            )}
          </FormControl>
          <Box>
            <Typography variant="h6">Role Permissions</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: '0 !important' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                          alignItems: 'center',
                          textTransform: 'capitalize',
                          '& svg': { ml: 1, cursor: 'pointer' }
                        }}>
                        Administrator Access
                        <Tooltip placement="top" title="Allows a full access to the system">
                          <Box sx={{ display: 'flex' }}>
                            <Icon icon="mdi:information-outline" fontSize="1rem" />
                          </Box>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <FormControlLabel
                        label="Select All"
                        sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                        control={
                          <Checkbox
                            size="small"
                            onChange={handleSelectAllCheckbox}

                            // indeterminate={isIndeterminateCheckbox}
                            // checked={selectedCheckbox.length === rolesArr.length * 3}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionList.map((i) => (
                    <TableRow
                      key={i?.id}
                      sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          color: (theme) => `${theme.palette.text.primary} !important`
                        }}>
                        {i?.title}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Create"
                          control={
                            <Checkbox
                              size="small"
                              id={`${i?.id}-Create`}
                              onChange={() => togglePermission(`${i?.id}-Create`)}

                              // checked={selectedCheckbox.includes(`${i?.id}-Create`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Read"
                          control={
                            <Checkbox
                              size="small"
                              id={`${i?.id}-Read`}
                              onChange={() => togglePermission(`${i?.id}-Read`)}

                              // checked={selectedCheckbox.includes(`${i?.id}-Read`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Update"
                          control={
                            <Checkbox
                              size="small"
                              id={`${i?.id}-Update`}
                              onChange={() => togglePermission(`${i?.id}-Update`)}

                              // checked={selectedCheckbox.includes(`${i?.id}-Update`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Delete"
                          control={
                            <Checkbox
                              size="small"
                              id={`${i?.id}-Delete`}
                              onChange={() => togglePermission(`${i?.id}-Delete`)}

                              // checked={selectedCheckbox.includes(`${i?.id}-Delete`)}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item md={3} xs={12}>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleClose}
                disabled={loading}>
                Cancel
              </Button>
            </Grid>
            <Grid item md={3} xs={12}></Grid>
            <Grid item md={3} xs={12}></Grid>
            <Grid item md={3} xs={12}>
              {' '}
              <Button size="small" type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={25} /> : <>{type === 'Add' ? 'Save' : 'Edit'}</>}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddRoleDrawer;
