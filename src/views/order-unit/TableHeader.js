import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const TableHeader = (props) => {
  const { value, handleFilter } = props;

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
      <TextField
        size="small"
        value={value}
        sx={{ mr: 4, mb: 2 }}
        placeholder="Search Order"
        onChange={(e) => handleFilter(e.target.value)}
      />
      <Button
        sx={{ mb: 2, display: 'none' }}
        component={Link}
        variant="contained"
        href="/order/add">
        Create Order
      </Button>
    </Box>
  );
};

export default TableHeader;
