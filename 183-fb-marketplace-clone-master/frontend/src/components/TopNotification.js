import React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {deepOrange, blue} from '@mui/material/colors';
import {useHistory} from 'react-router-dom';

// https://mui.com/components/buttons/
const NotificationButtons = styled(Button)(() => ({
  'color': '#000',
  'fontWeight': '600',
  'backgroundColor': blue[50],
  '&:hover': {
    backgroundColor: blue[100],
  },
}));

/**
 * The top notification that appears on the home page
 * https://mui.com/components/cards/#basic-card
 * @return {object} JSX
 */
export default function TopNotification({user}) {
  const history = useHistory();
  return (
    <Card sx={{maxWidth: '100%', bgcolor: deepOrange[200], borderRadius: 0}}>
      <CardContent>
        {user && user.user && (
          <Typography
            color='primary'
            variant='h5'
            component='h5'
            fontWeight={700}
          >
            {`Hello ${user.user.firstName} ${user.user.lastName}`}
            <br />
          </Typography>
        )}
        <Typography variant='body2' component='span' fontWeight={600}>
          Buy and sell items locally or have something new shipped from stores.
        </Typography>
        <Typography variant='body1' component='p' color='text.secondary'>
          Log in to get the full Facebook Marketplace experience.
        </Typography>
      </CardContent>
      <CardActions>
        {!user && (
          <NotificationButtons
            size='small'
            data-testid='second-login-button'
            sx={{width: '25%', maxWidth: '130px'}}
            onClick={() => history.push('/login')}
          >
            Login
          </NotificationButtons>
        )}
        <NotificationButtons
          size='small'
          sx={{width: '70%', maxWidth: '260px'}}
        >
          Learn More
        </NotificationButtons>
      </CardActions>
    </Card>
  );
}
