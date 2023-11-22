import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {Link} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';


/**
 * Appbar
 * https://mui.com/components/app-bar/
 * @return {object} JSX
 */
export default function TopBar({user, logout}) {
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position='static' color='transparent'>
        <Toolbar>
          <Link
            to='/'
            component={RouterLink}
            underline='none'
            variant='h6'
            fontWeight={700}
            sx={{
              'flexGrow': 1,
              'color': 'primary.main',
              '&:hover': {
                color: 'primary.dark',
              },
            }}
          >
            facebook
          </Link>
          {user ? (
            <Button
              onClick={logout}
              sx={{
                'bgcolor': 'secondary.main',
                'color': 'white',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Link
              to='/login'
              component={RouterLink}
              underline='none'
              variant='contained'
              data-testid='main-login-button'
              sx={{
                'bgcolor': 'primary.main',
                'color': 'white',
                'padding': '0.7rem 1rem',
                'borderRadius': '5px',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Login
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
