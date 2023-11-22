import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
// https://stackoverflow.com/questions/58524183/how-to-mock-history-push-with-the-new-react-router-hooks-using-jest/59451956
import {createMemoryHistory} from 'history';
import {Router} from 'react-router-dom';
// import Login from '../Login';
import App from '../App';
import CurrentSelectedCategory from '../CurrentSelectedCategory';
// import Home from '../Home';

// https://mswjs.io/docs/getting-started/mocks/rest-api

// const AUTHENTICATE_URL = '/authenticate';
const LISTINGS_URL = '/v0/listings';
const CATEGORIES_URL = '/v0/category';
// const SUBCATEGORIES_URL = '/v0/subcategory/Vehicles';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Categories', () => {
  test('All Categories button', async () => {
    render(<CurrentSelectedCategory/>);
    // const allCategories = screen.getByText('All Categories');
    await waitFor(() => screen.getByText('All Categories'));
  });
  test('All Categories button works', async () => {
    render(<CurrentSelectedCategory/>);
    const allCategories = screen.getByText('All Categories');
    fireEvent.click(allCategories);
    await waitFor(() => {
      expect(screen
        .getByText('Vehicles'))
        .toBeInTheDocument();
      expect(screen
        .getByText('Property Rentals'))
        .toBeInTheDocument();
      expect(screen
        .getByText('Apparel'))
        .toBeInTheDocument();
    });
  });
  test('Close all Categories after opening', async () => {
    render(<CurrentSelectedCategory/>);
    const allCategories = screen.getByText('All Categories');
    fireEvent.click(allCategories);
    fireEvent.click(document.getElementById('close'));
    await waitFor(() => {
      expect(screen
        .getByText('All Categories'))
        .toBeInTheDocument();
    });
  });
  test('add a Category', async () => {
    server.use(
      rest.get('/v0/subcategory/Vehicles', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(['Motorcycles', 'Cars']),
        );
      }),
      rest.get(LISTINGS_URL, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(
            [
              {
                'id': '43e8c21c-00ff-427d-8151-d02c5cd49994',
                'title': 'XBOSX',
                'price': '1000',
                'image': 'https://i.imgur.com/psgTc9R.jpeg',
              },
              {
                'id': '596844c0-329a-4906-97f8-13a26cbd0e51',
                'title': 'PS5',
                'price': '1000',
                'image': 'https://i.imgur.com/olvDRsv.png',
              },
            ]),
        );
      }),
      rest.get(CATEGORIES_URL + '/Vehicles', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              'id': '43e8c21c-00ff-427d-8151-d02c5cd49994',
              'title': 'XBOSX',
              'price': '1000',
              'image': 'https://i.imgur.com/psgTc9R.jpeg',
            },
          ]),
        );
      }),
    );
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <App />
      </Router>,
    );
    const allCategories = screen.getByText('All Categories');
    fireEvent.click(allCategories);
    fireEvent.click(document.getElementById('Vehicles'));
    fireEvent.click(screen.getByText('Marketplace'));
    // Need to check the subcategories
  });
//   test('Login with incorrect credentials', async () => {
//     server.use(
//       rest.post(AUTHENTICATE_URL, (req, res, ctx) => {
//         return res(ctx.status(401));
//       }),
//     );
//     render(<Login />);
//     const email = document.getElementById('email');
//     const password = document.getElementById('password');
//     fireEvent.change(email, {target: {value: 'testing@testing.com'}});
//     fireEvent.change(password, {target: {value: '122323232334'}});
//     fireEvent.click(screen.getByText('Login'));
//     await waitFor(() => {
//       expect(screen
//         .getByText('Email or password incorrect, please try again'))
//         .toBeInTheDocument();
//     });
//   });
//   test('Login with correct credentials', async () => {
//     server.use(
//       rest.post(AUTHENTICATE_URL, (req, res, ctx) => {
//         const user = {
//           firstName: 'Smith',
//           lastName: 'Doe',
//           id: '2323skdl232',
//         };
//         const response = {
//           user,
//           token: '3434dsd343434',
//         };
//         localStorage.setItem('user', JSON.stringify(response));
//         return res(
//           ctx.status(200),
//           ctx.json(response),
//         );
//       }),
//       rest.get(CATEGORIES_URL, (req, res, ctx) => {
//         return res(
//           ctx.status(200),
//           ctx.json([]),
//         );
//       }),
//       rest.get(LISTINGS_URL, (req, res, ctx) => {
//         return res(
//           ctx.status(200),
//           ctx.json([]),
//         );
//       }),
//     );
//     const history = createMemoryHistory();
//     render(
//       <Router history={history}>
//         <App />
//       </Router>,
//     );
//     await waitFor(() => fireEvent
//       .click(screen.getByTestId('main-login-button')));
//     const email = document.getElementById('email');
//     const password = document.getElementById('password');
//     fireEvent.change(email, {target: {value: 'smith@doe.com'}});
//     fireEvent.change(password, {target: {value: '1234'}});
//     fireEvent.click(screen.getByText('Login'));
//     await waitFor(() => {
//       // https://testing-library.com/docs/queries/about/#types-of-queries
//       expect(screen.queryAllByTestId('main-login-button').length).toBe(0);
//       expect(screen.getByText('Hello Smith Doe')).toBeInTheDocument();
//       fireEvent.click(screen.getByText('Logout'));
//       expect(screen.queryAllByTestId('main-login-button').length).toBe(1);
//     });
//   });
});
