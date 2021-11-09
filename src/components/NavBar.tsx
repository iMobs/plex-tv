import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { VFC } from 'react';

const NavBar: VFC = () => {
  return (
    <AppBar component="nav" position="static">
      <Toolbar component={Container}>
        <Box sx={{ marginRight: 'auto' }}>
          <NextLink href="/" passHref>
            <Button color="inherit">Plex TV</Button>
          </NextLink>
        </Box>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
