import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Button, Typography} from '@mui/material';
import {red} from '@mui/material/colors';

/**
 * Login Form
 * @return {object} JSX
 */
export default function LoginForm({onSubmit,
  handleInputChange, error: errorMessage}) {
  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: '600px',
        margin: 'auto',
      }}
    >
      <form onSubmit={onSubmit}>
        <TextField
          fullWidth
          label='Email'
          id='email'
          type='email'
          name='email'
          data-testid='email-input'
          onChange={handleInputChange}
          sx={{marginBottom: '0.8rem'}}
        />
        <TextField
          fullWidth
          label='Password'
          id='password'
          type='password'
          name='password'
          onChange={handleInputChange}
          sx={{marginBottom: '0.8rem'}}
        />
        {errorMessage && (
          <Typography color={red[500]}
            sx={{marginBottom: '0.5rem'}} variant='body2' component='p'>
            {errorMessage}
          </Typography>
        )}
        <Button fullWidth variant='contained' type='submit'>
          Login
        </Button>
      </form>
    </Box>
  );
}
