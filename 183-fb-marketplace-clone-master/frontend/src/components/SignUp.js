import {AppBar, Button,
  Container,
  Stack, TextField,
  Toolbar, Typography} from '@mui/material';
import {green, indigo, red} from '@mui/material/colors';
import {Box} from '@mui/system';
import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';


/**
 * Signup screen
 * @return {object} jsx
 */
export default function SignUp({setUser: setLoggedInUser}) {
  const history = useHistory();
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [error, setError] = useState('');
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const titles = ['What\'s your name?',
    'Enter your contact details', 'Provide a secure password'];
  const subTitles = ['Enter the name you use in real life.',
    'Don\'t use somebody\'s email',
    'Otherwise someone might hack your account'];
  const steps = [
    [
      {
        key: 'firstName',
        label: 'First name',
        type: 'text',
      },
      {
        key: 'lastName',
        label: 'Last name',
        type: 'text',
      },
    ],
    [
      {
        key: 'email',
        label: 'Email',
        type: 'email',
      },
    ],
    [
      {
        key: 'password',
        label: 'Password',
        type: 'password',
      },
      {
        key: 'confirmPassword',
        label: 'Confirm password',
        type: 'password',
      },
    ],
  ];
  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const onPrevious = (e) => {
    e.preventDefault();
    if (currentFormStep - 1 >= 0) {
      setCurrentFormStep(currentFormStep - 1);
    }
  };

  const onNext = (e) => {
    e.preventDefault();
    if (currentFormStep + 1 < steps.length) {
      setCurrentFormStep(currentFormStep + 1);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/v0/sign-up', {
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
      if (error.status === 400) {
        setError('Please put the correct values');
      }
      if (error.status === 409) {
        setError('Conflict');
      }
      console.log(error);
    }
  };
  return (
    <div>
      <Box sx={{flexGrow: 1}}>
        <AppBar position='static' color='primary' sx={{marginBottom: '2rem'}}>
          <Toolbar>
            <Typography variant='h6' mx={{margin: 'auto', display: 'block'}}>
              Join Facebook
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth='lg'>
          <form>
            {steps.map((step, index) => {
              return (
                <Stack
                  key={index}
                  sx={{
                    display: index === currentFormStep ? 'block' : 'none',
                  }}
                >
                  <Typography variant='h5' color='primary' textAlign='center'>
                    {titles[index]}
                  </Typography>
                  <Typography variant='h6' color='secondary' textAlign='center'>
                    {subTitles[index]}
                  </Typography>
                  <br />
                  <br />
                  {step.map((currentStep) => (
                    <TextField
                      key={currentStep.key}
                      fullWidth
                      label={currentStep.label}
                      id={currentStep.key}
                      type={currentStep.type}
                      name={currentStep.key}
                      data-testid={`${currentStep.key}-input`}
                      onChange={handleInputChange}
                      sx={{marginBottom: '0.8rem'}}
                    />
                  ))}
                </Stack>
              );
            })}
            {error && <Stack sx={{margin: '1rem auto'}}>
              <Typography
                color={red[500]}>{error}</Typography>
            </Stack>}
            <Button
              sx={{
                'bgcolor': indigo['A200'],
                'color': '#fff',
                'padding': '0.7rem 1rem',
                'borderRadius': '5px',
                '&:hover': {
                  backgroundColor: indigo['A400'],
                },
                '&:disabled': {
                  bgcolor: indigo[50],
                },
              }}
              disabled={currentFormStep === 0}
              onClick={onPrevious}
            >
              Previous
            </Button>
            <Button
              sx={{
                'bgcolor': indigo['A200'],
                'color': '#fff',
                'marginLeft': '1rem',
                'padding': '0.7rem 1rem',
                'borderRadius': '5px',
                '&:hover': {
                  backgroundColor: indigo['A400'],
                },
                '&:disabled': {
                  bgcolor: indigo[50],
                },
              }}
              disabled={currentFormStep + 1 === steps.length}
              onClick={onNext}
            >
              Next
            </Button>
            {currentFormStep + 1 === steps.length && (
              <Button
                type='submit'
                onClick={onSubmit}
                sx={{
                  'display': 'block',
                  'margin': '3rem auto',
                  'width': '200px',
                  'bgcolor': green['A200'],
                  'color': '#fff',
                  'padding': '0.7rem 1rem',
                  'borderRadius': '5px',
                  '&:hover': {
                    backgroundColor: green['A400'],
                  },
                }}
              >
                Register
              </Button>
            )}
          </form>
          <Typography
            variant='button'
            component='p'
            color='secondary.dark'
            sx={{
              cursor: 'pointer',
              display: 'block',
              width: '120px',
              margin: '1rem auto',
              textDecoration: 'underline',
            }}
            onClick={() => history.goBack()}
          >
            Go back
          </Typography>
        </Container>
      </Box>
    </div>
  );
}
