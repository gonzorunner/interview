import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
// https://stackoverflow.com/questions/58524183/how-to-mock-history-push-with-the-new-react-router-hooks-using-jest/59451956
import {createMemoryHistory} from 'history';
import {Router} from 'react-router-dom';
import Login from '../Login';
import App from '../App';

// https://mswjs.io/docs/getting-started/mocks/rest-api

const AUTHENTICATE_URL = '/authenticate';
const LISTINGS_URL = '/v0/listings';
const CATEGORIES_URL = '/v0/category';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Login Page', () => {
  test('The page have a facebook title', async () => {
    render(<Login />);
    expect(screen.getByText('facebook')).toBeInTheDocument();
  });
  test('Login with incorrect credentials', async () => {
    server.use(
      rest.post(AUTHENTICATE_URL, (req, res, ctx) => {
        return res(ctx.status(401));
      }),
    );
    render(<Login />);
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    fireEvent.change(email, {target: {value: 'testing@testing.com'}});
    fireEvent.change(password, {target: {value: '122323232334'}});
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen
        .getByText('Email or password incorrect, please try again'))
        .toBeInTheDocument();
    });
  });
  test('Login with correct credentials', async () => {
    server.use(
      rest.post(AUTHENTICATE_URL, (req, res, ctx) => {
        const user = {
          firstName: 'Smith',
          lastName: 'Doe',
          id: '2323skdl232',
        };
        const response = {
          user,
          token: '3434dsd343434',
        };
        localStorage.setItem('user', JSON.stringify(response));
        return res(
          ctx.status(200),
          ctx.json(response),
        );
      }),
      rest.get(CATEGORIES_URL, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([]),
        );
      }),
      rest.get(LISTINGS_URL, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([]),
        );
      }),
    );
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <App />
      </Router>,
    );
    await waitFor(() => fireEvent
      .click(screen.getByTestId('main-login-button')));
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    fireEvent.change(email, {target: {value: 'smith@doe.com'}});
    fireEvent.change(password, {target: {value: '1234'}});
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      // https://testing-library.com/docs/queries/about/#types-of-queries
      expect(screen.queryAllByTestId('main-login-button').length).toBe(0);
      expect(screen.getByText('Hello Smith Doe')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Logout'));
      expect(screen.queryAllByTestId('main-login-button').length).toBe(1);
    });
  });
});
