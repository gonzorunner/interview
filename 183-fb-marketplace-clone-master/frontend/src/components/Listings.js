import React from 'react';
// import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
// import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import './Listings.css';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetchListing = (setListing, id) => {
  fetch('/v0/listing/' + id, {
    method: 'get',
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      setListing(json);
    });
};

/**
 * Listings
 * @return {object} JSX
 * @param {object} props
 */
export default function Listings(props) {
  const [open, setOpen] = React.useState(false);
  // const [reply, setReply] = React.useState('');
  // const [send, setSend] = React.useState('');
  const [listingSingle, setListing] = React.useState({
    title: '',
    id: '',
    price: '',
    date: '',
    image: '',
    replies: [],
  });
  /*
  const fetchReply = (id, sentUser, sentReply) => {
    const obj = {user: sentUser, reply: sentReply};
    console.log(sentReply + 'this is the reply');
    fetch('/v0/listing/' + id, {
      method: 'post',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        let replies = [];
        if (listingSingle.replies) {
          replies = [...listingSingle.replies];
        }
        replies.push(sentReply);
        setListing({
          ...listingSingle,
          replies,
        });
      }).catch((err) => {
        console.log(err);
      });
  };
  */

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    const obj = {
      title: '',
      id: '',
      price: '',
      date: '',
      image: '',
      replies: [],
    };
    setListing(obj);
    // setReply('');
    // setSend('');
  };

  return (
    <div className="grid-container">
      {props.data.map((listing) => (
        <ImageListItem
          key={listing.id}
          sx={{maxHeight: '250px', margin: '0.6rem', maxWidth: '250px'}}
        >
          <img
            src={`${listing.image}?w=248&fit=crop&auto=format`}
            srcSet={`${listing
              .image}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={listing.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={listing.title}
            subtitle={listing.price}
            actionIcon={
              <IconButton
                sx={{color: 'rgba(255, 255, 255, 0.54)'}}
                aria-label={`info about ${listing.title}`}
                onClick={() => {
                  fetchListing(setListing, listing.id);
                  handleClickOpen();
                }}>
                <InfoIcon />
              </IconButton>
            }
          />
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar sx={{position: 'relative'}}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                  {listingSingle.title}
                </Typography>
              </Toolbar>
            </AppBar>
            <img
              src={`${listingSingle.image}?w=248&fit=crop&auto=format`}
              // eslint-disable-next-line max-len
              srcSet={`${listingSingle.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={listingSingle.title}
              loading="lazy"
            />
            <List>
              <ListItem>
                <ListItemText
                  primary={'$' + listingSingle.price}
                  secondary={
                    // eslint-disable-next-line max-len
                    'Posted: ' + listingSingle.date + ' by ' + listingSingle.user
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={listingSingle.description}
                />
              </ListItem>
            </List>
          </Dialog>
        </ImageListItem>
      ))}
    </div>
  );
}
