// ** React Imports
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import AddRoleDrawer from './AddRoleDrawer';

const RolesCards = (props) => {
  const { dataList } = props;

  // ** States
  const [typeForm, setTypeForm] = useState('Add');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCheckbox([]);
    setIsIndeterminateCheckbox(false);
  };

  const togglePermission = (id) => {
    const arr = selectedCheckbox;
    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1);
      setSelectedCheckbox([...arr]);
    } else {
      arr.push(id);
      setSelectedCheckbox([...arr]);
    }
  };

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox) {
      setSelectedCheckbox([]);
    } else {
      dataList.forEach((row) => {
        const id = row.toLowerCase().split(' ').join('-');
        togglePermission(`${id}-read`);
        togglePermission(`${id}-write`);
        togglePermission(`${id}-create`);
      });
    }
  };
  useEffect(() => {
    if (selectedCheckbox.length > 0 && selectedCheckbox.length < dataList.length * 3) {
      setIsIndeterminateCheckbox(true);
    } else {
      setIsIndeterminateCheckbox(false);
    }
  }, [selectedCheckbox]);

  const renderCards = () =>
    dataList.map((item, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  {item?.name}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDrawer();
                    setTypeForm('Edit');
                  }}>
                  Edit Role
                </Button>
              </Box>
              <IconButton sx={{ color: 'text.secondary' }}>
                {/* <Icon icon="mdi:content-copy" fontSize={20} /> */}
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));

  return (
    <Grid container spacing={6} className="match-height">
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card>
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={5}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                <img height={65} alt="add-role" src="/images/pages/responsive.svg" />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mb: 3, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      toggleDrawer();
                      setTypeForm('Add');
                    }}>
                    Add New Role
                  </Button>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <AddRoleDrawer open={openDrawer} toggle={toggleDrawer} type={typeForm} />
    </Grid>
  );
};

export default RolesCards;
