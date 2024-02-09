// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig';

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}));

const AppBarContent = (props) => {
  // ** Props
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding } = props;

  // ** Hooks
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <LinkStyled href="/">
          <img src="/images/rumatkita-logo.svg" alt="RUMATKITA" height={35} width={35} />
          <Typography
            variant="h6"
            sx={{
              ml: 3,
              fontWeight: 600,
              lineHeight: 'normal',
              textTransform: 'uppercase'
            }}>
            {themeConfig.templateName}
          </Typography>
        </LinkStyled>
      )}
      {userAppBarContent ? userAppBarContent(props) : null}
    </Box>
  );
};

export default AppBarContent;
