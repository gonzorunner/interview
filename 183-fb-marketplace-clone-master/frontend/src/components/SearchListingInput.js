import React from 'react';
import {styled} from '@mui/material/styles';
// import InputBase from '@mui/material/InputBase';
// import SearchIcon from '@mui/icons-material/Search';
import {grey} from '@mui/material/colors';

const Search = styled('div')(() => ({
  'position': 'relative',
  'borderRadius': '23px',
  'backgroundColor': grey[200],
  '&:hover': {
    backgroundColor: grey[300],
  },
  'margin': 'auto',
  'width': '99%',
}));
/*
const SearchIconWrapper = styled('div')(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
/*
const StyledInputBase = styled(InputBase)(({theme}) => ({
  'color': 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
*/
/**
 * The main search input for the listing
 * @return {object} JSX
 */
export default function SearchListingInput({childToParent}) {
  const [keyword, setKeyword] = React.useState('');
  return (
    <Search>
      <input
        type="text"
        value={keyword}
        id='keywordInput'
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button
        id='Search1'
        onClick={() => childToParent(keyword)}
      >Search</button>
    </Search>
  );
}
