import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import {setupServer} from 'msw/node';
import {createMemoryHistory} from 'history';
import {Router} from 'react-router-dom';
import {rest} from 'msw';
import SignUp from '../SignUp';
import App from '../App';

// https://mswjs.io/docs/getting-started/mocks/rest-api


const REGISTER_URL = '/v0/sign-up';
const LISTINGS_URL = '/v0/listings';
const CATEGORIES_URL = '/v0/category';
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
describe('Sign up Page', () => {
  test('The page have a facebook title', () => {
    render(<SignUp />);
    expect(screen.getByText('Join Facebook')).toBeInTheDocument();
  });
  test('The page have a go back button', () => {
    render(<SignUp />);
    expect(screen.getByText('Go back')).toBeInTheDocument();
  });
  test('The page have a previous button', () => {
    render(<SignUp />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });
  test('The page have a next button', () => {
    render(<SignUp />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
  test('The previous button is disabled by default', () => {
    render(<SignUp />);
    expect(screen.getByText('Previous').disabled).toBe(true);
  });
  test('The next button is not disabled by default', () => {
    render(<SignUp />);
    expect(screen.getByText('Next').disabled).toBe(false);
  });
  test('The registration button is hidden by default', () => {
    render(<SignUp />);
    expect(screen.queryAllByText('Register').length).toBe(0);
  });
  test('The registration button is shown after 2 clicks of next', () => {
    render(<SignUp />);
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));
    expect(screen.queryAllByText('Register').length).toBe(1);
  });
  test('The next button is disabled after 2 clicks of next', () => {
    render(<SignUp />);
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Next').disabled).toBe(true);
  });
  test('400 bad format in sign-up', async () => {
    render(<SignUp />);
    server.use(
      rest.post(REGISTER_URL, (req, res, ctx) => {
        return res(
          ctx.status(400),
        );
      }),
    );
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    fireEvent.change(firstName, {target: {value: 'Frank'}});
    fireEvent.change(lastName, {target: {value: 'Joe'}});
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(email, {target: {value: '3434'}});
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(password, {target: {value: '1234'}});
    fireEvent.change(confirmPassword, {target: {value: '123'}});
    fireEvent.click(screen.getByText('Register'));
    await waitFor(() => expect(screen.getByText(
      'Please put the correct values',
    )).toBeInTheDocument());
  });
  test('409 conflict, email already exist', async () => {
    render(<SignUp />);
    server.use(
      rest.post(REGISTER_URL, (req, res, ctx) => {
        return res(
          ctx.status(409),
        );
      }),
    );
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    fireEvent.change(firstName, {target: {value: 'Frank'}});
    fireEvent.change(lastName, {target: {value: 'Joe'}});
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(email, {target: {value: 'smith@doe.com'}});
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(password, {target: {value: '1234'}});
    fireEvent.change(confirmPassword, {target: {value: '1234'}});
    fireEvent.click(screen.getByText('Register'));
    await waitFor(() => expect(screen.getByText(
      'Conflict',
    )).toBeInTheDocument());
  });
  test('201 create account', async () => {
    server.use(
      rest.post(REGISTER_URL, (req, res, ctx) => {
        const user = {
          firstName: 'Frank',
          lastName: 'Doe',
          id: '2323skdl232',
        };
        const response = {
          user,
          token: '3434dsd343434',
        };
        localStorage.setItem('user', JSON.stringify(response));
        return res(
          ctx.status(201),
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
    await waitFor(() => fireEvent
      .click(screen.getByText('Create a new account')));
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    fireEvent.change(firstName, {target: {value: 'Frank'}});
    fireEvent.change(lastName, {target: {value: 'Doe'}});
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(email, {target: {value: 'isnotfrankyet@doe.com'}});
    fireEvent.click(screen.getByText('Previous'));
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(email, {target: {value: 'frank@doe.com'}});
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(password, {target: {value: '1234'}});
    fireEvent.change(confirmPassword, {target: {value: '1234'}});
    fireEvent.click(screen.getByText('Register'));
    await waitFor(() => {
      expect(screen.queryAllByTestId('main-login-button').length).toBe(0);
      expect(screen.getByText('Hello Frank Doe')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Logout'));
      expect(screen.queryAllByTestId('main-login-button').length).toBe(1);
    });
  });
});
