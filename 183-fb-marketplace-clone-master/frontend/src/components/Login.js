import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import {grey, green} from '@mui/material/colors';
import {Button, Divider,
  Stack, Toolbar, Typography} from '@mui/material';
import LoginForm from './login/Form';
import {useHistory} from 'react-router-dom';

/**
 * Login component
 * @return {object} JSX
 */
export default function Login({setUser: setLoggedInUser}) {
  const history = useHistory();
  const [user, setUser] = React.useState({email: '', password: ''});
  const [error, setError] = React.useState('');

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      const response = await fetch('/authenticate', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw response;
      const json = await response.json();
      setLoggedInUser(json);
      localStorage.setItem('user', JSON.stringify(json));
      history.push('/');
    } catch (error) {
      setError('Email or password incorrect, please try again');
      console.log(error);
    }
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        width='100%'
        maxWidth='100%'
        sx={{margin: 0, padding: 0, bgcolor: grey[200], minHeight: '100vh'}}
      >
        <Toolbar>
          <Typography
            variant='h6'
            align='center'
            component='h6'
            color='primary'
            fontWeight={700}
            sx={{flexGrow: 1}}
          >
            facebook
          </Typography>
        </Toolbar>
        <LoginForm
          onSubmit={onSubmit}
          handleInputChange={handleInputChange}
          error={error}
        />
        <Divider sx={{marginTop: '1rem'}}>or</Divider>
        <Stack spacing={2} sx={{margin: '2rem auto', textAlign: 'center'}}>
          <Button
            underline='none'
            variant='contained'
            sx={{
              'width': '240px',
              'margin': 'auto',
              'bgcolor': green[600],
              'color': 'white',
              'padding': '0.7rem 1rem',
              'borderRadius': '5px',
              '&:hover': {
                backgroundColor: green[900],
              },
            }}
            onClick={() => history.push('/sign-up')}
          >
              Create a new account
          </Button>
          <Typography
            variant='button'
            component='p'
            color='primary.main'
            xs={{cursor: 'pointer', textDecoration: 'underline'}}
            onClick={() => history.goBack()}
          >
            Go back
          </Typography>
        </Stack>
      </Container>
    </React.Fragment>
  );
}
