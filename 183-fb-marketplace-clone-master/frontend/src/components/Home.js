import React from 'react';

import './Home.css';
import TopBar from './TopBar';
import TopNotification from './TopNotification';
import CurrentSelectedCategory from './CurrentSelectedCategory';
import SearchListingInput from './SearchListingInput';
import Listings from './Listings';
import SidebarDesktop from './SidebarDesktop';

const fetchListings = (setListings, category, keyword) => {
  if (category && keyword === '') {
    // console.log('categories ' + category);
    fetch('/v0/category/' + category, {
      method: 'get',
    })
      .then((response) => {
        if (!response.ok) {
          setListings([]);
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setListings(json);
      });
  } else {
    let add = '';
    if (keyword !== '') {
      add = '?keyword=' + keyword;
    }
    fetch('/v0/listings' + add, {
      method: 'get',
    })
      .then((response) => {
        if (!response.ok) {
          setListings([]);
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setListings(json);
      });
  }
};
/**
 * Home
 * @return {object} JSX
 */
export default function Home({user, logout}) {
  const [category, setCategory] = React.useState(null);

  const categoryToHome = (categoryData) => {
    setCategory(categoryData);
    console.log('category DATa:' + categoryData);
  };
  const [listings, setListings] = React.useState([]);
  const [data, setData] = React.useState('');

  const childToParent = (childdata) => {
    setCategory(null);
    setData(childdata);
    // fetchListings(setListings, data);
  };

  React.useEffect(() =>{
    fetchListings(setListings, category, data);
    // eslint-disable-next-line
  }, [category, data]);

  return (
    <div>
      <div className='top-app-bar'>
        <TopBar user={user} logout={logout} />
      </div>
      <div className='drawer-desktop'>
        <SidebarDesktop />
      </div>
      <div className='main-content'>
        <TopNotification user={user} />
        <CurrentSelectedCategory categoryToHome={categoryToHome}/> :
        <SearchListingInput childToParent={childToParent} />
        <Listings data={listings} />
      </div>
    </div>
  );
}
