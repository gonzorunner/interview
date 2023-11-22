import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import PersonIcon from '@mui/icons-material/Person';
import {Box} from '@mui/system';
// import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import ListItem from '@mui/material/ListItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
// import Button from '@mui/material/Button';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
/**
 * Current selected category will be displayed here
 * @return {object} JSX
 */
export default function CurrentSelectedCategory({categoryToHome}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [category, setCategory] = React.useState([]);
  // const allCategories = () => {
  //   console.log('GET ALL CATEGOREIS');
  // };
  const addCategory = (event) => {
    setCategory(event.target.innerText);
    categoryToHome(event.target.innerText);
    setOpen(false);
  };
  const goBack = () => {
    setCategory('');
    categoryToHome(null);
  };
  return (
    <Box padding={1}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Typography color="text.primary" onClick={goBack}>Marketplace
        </Typography>
        <Typography color="text.primary">{category}</Typography>
      </Breadcrumbs>
      <Stack direction='row' spacing={1}>
        <Chip icon={<PersonIcon />} />
        <Chip label='Sell' onClick={addCategory} />
        <Chip label='All Categories' onClick={handleClickOpen} />
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{position: 'relative'}} color= 'transparent'>
            <Toolbar>
              <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              Select Category
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                id="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <ListItem button onClick={addCategory} id="Vehicles">
            <ListItemText primary='Vehicles' />
          </ListItem>
          <ListItem button onClick={addCategory}>
            <ListItemText primary='Property Rentals' />
          </ListItem>
          <ListItem button onClick={addCategory}>
            <ListItemText primary='Apparel' />
          </ListItem>
        </Dialog>
      </Stack>
    </Box>
  );
}
