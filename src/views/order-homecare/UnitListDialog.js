import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Tooltip from '@mui/material/Tooltip';

// import ContentCut from '@mui/icons-material/ContentCut';
import { listClinic } from 'src/services/global';
import { Typography } from '@mui/material';

const UnitListDialog = (props) => {
  const { open, toggle } = props;

  const [loading, setLoading] = useState(false);
  const [unitOptions, setUnitOptions] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);

  const fetchDataClinic = async () => {
    const res = await listClinic();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingDataList = data.map((item) => {
        return {
          id: item?.clinic_id,
          ...item
        };
      });
      setUnitOptions(mappingDataList);
      setLoading(false);
    } else {
      toast.error(`Status Code : ${res?.result?.status}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUnit === null) setSelectedNurse(null);
  }, [selectedUnit]);

  useEffect(() => {
    fetchDataClinic();
  }, []);

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={() => toggle()}>
      <DialogTitle>Choose Unit & Nurse</DialogTitle>
      <DialogContent>
        <form>
          <Autocomplete
            sx={{ mt: 2, mb: 2, width: '100%' }}
            id="select-unit"
            fullWidth
            size="small"
            options={unitOptions}
            onChange={(e, val) => setSelectedUnit(val)}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Grid container component="li" sx={{ mr: 2, flexShrink: 0 }} {...props}>
                <Grid item md={9}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{option?.name}</Typography>
                  <Typography sx={{ fontSize: '10px', width: '100%' }} noWrap>
                    {option?.complete_address}
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="body2" sx={{ textAlign: 'end' }}>
                    {(+option?.distance / 1000).toFixed(2)} Km
                  </Typography>
                </Grid>
              </Grid>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth
                label="Choose an Unit"
                sx={{ mt: 2, mb: 2, width: '100%' }}
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />
          <Autocomplete
            sx={{ mt: 2, mb: 2, width: '100%' }}
            id="select-unit"
            fullWidth
            size="small"
            options={unitOptions}
            autoHighlight
            disabled={selectedUnit === null}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Grid container component="li" sx={{ mr: 2, flexShrink: 0 }} {...props}>
                <Grid item md={9}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{option?.name}</Typography>
                  <Typography sx={{ fontSize: '10px', width: '100%' }} noWrap>
                    {option?.complete_address}
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="body2" sx={{ textAlign: 'end' }}>
                    {(+option?.distance / 1000).toFixed(2)} Km
                  </Typography>
                </Grid>
              </Grid>
            )}
            renderInput={(params) => (
              <Tooltip
                title={selectedUnit === null ? 'Please choose an unit' : ''}
                placement="bottom">
                <TextField
                  {...params}
                  sx={{ mt: 2, mb: 2, width: '100%' }}
                  size="small"
                  fullWidth
                  label="Choose a Nurse"
                  inputProps={{
                    ...params.inputProps
                  }}
                />
              </Tooltip>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid container>
          <Grid item xs={6} md={3}>
            <Button
              color="warning"
              fullWidth
              onClick={() => toggle()}
              variant="contained"
              size="small">
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6} md={3}></Grid>
          <Grid item xs={6} md={3}></Grid>
          <Grid item xs={6} md={3}>
            {' '}
            <Button
              color="success"
              fullWidth
              onClick={() => toggle()}
              variant="contained"
              size="small">
              Choose
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default UnitListDialog;
