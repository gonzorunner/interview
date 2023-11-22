import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import {setupServer} from 'msw/node';
import {createMemoryHistory} from 'history';
import {Router} from 'react-router-dom';
import {rest} from 'msw';
import App from '../App';

const LISTINGS_URL = '/v0/listings';
const server = setupServer();
const CATEGORIES_URL = '/v0/category';
const LISTING_URL = '/v0/listing/';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Home Page', () => {
  test('The listings appear', async () => {
    const id = '43e8c21c-00ff-427d-8151-d02c5cd49994';
    server.use(
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
      rest.get(CATEGORIES_URL, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([]),
        );
      }),
      rest.get(LISTING_URL + id, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(
            {
              'id': '43e8c21c-00ff-427d-8151-d02c5cd49994',
              'date': '2020-01-27T00:10:43Z',
              'user': 'luigi',
              'image': 'https://i.imgur.com/psgTc9R.jpeg',
              'price': '1000',
              'title': 'XBOSX',
              'replies': [],
              'category': 'a13c9144-aedc-461c-8d5b-49e885d9aa5e',
              'description': 'brand new xbox series x',
            },
          ),
        );
      }),
    );
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <App />
      </Router>,
    );
    // https://testing-library.com/docs/dom-testing-library/api-async/
    expect(await screen.findByText('XBOSX')).toBeInTheDocument();
    expect(await screen.findByText('PS5')).toBeInTheDocument();
    /*
    const keywordInput = document.getElementById('keywordInput');
    fireEvent.change(keywordInput, {target: {value: 'xbox'}});
    const keywordButton = document.getElementById('keywordButton');
    await waitFor(() => fireEvent
      .click(keywordButton));
    */
    let element = document.querySelector('[aria-label="info about XBOSX"]');
    await waitFor(() => fireEvent
      .click(element));
    /*
    const reply = document.getElementById('replyInput');
    fireEvent.change(reply, {target: {value: 'hello this is a test'}});
    const replyButton = document.getElementById('replyButton');
    await waitFor(() => fireEvent
      .click(replyButton));
    // eslint-disable-next-line
    */
    waitFor(() => expect(screen.findAllByText('brand new xbox series x')).toBeInTheDocument());
    element = document.querySelector('[aria-label="close"]');
    await waitFor(() => fireEvent
      .click(element));
  });
  test('Search', async () => {
    const id = '43e8c21c-00ff-427d-8151-d02c5cd49994';
    server.use(
      rest.get(LISTINGS_URL + '?keyword=xbox', (req, res, ctx) => {
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
    // https://testing-library.com/docs/dom-testing-library/api-async/
    //expect(await screen.findByText('XBOSX')).toBeInTheDocument();
    const keywordInput = document.getElementById('keywordInput');
    fireEvent.change(keywordInput, {target: {value: 'xbox'}});
    // const keywordButton = document.getElementById('keywordButton');
    const button = document.getElementById('Search1');
    await waitFor(() => fireEvent
      .click(button));
    expect(await screen.findByText('XBOSX')).toBeInTheDocument();
  });
  test('Search for something that does not exist', async () => {
    const id = '43e8c21c-00ff-427d-8151-d02c5cd49994';
    server.use(
      rest.get(LISTINGS_URL + '?keyword=xbox', (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json(
            [
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
    // https://testing-library.com/docs/dom-testing-library/api-async/
    //expect(await screen.findByText('XBOSX')).toBeInTheDocument();
    const keywordInput = document.getElementById('keywordInput');
    fireEvent.change(keywordInput, {target: {value: 'nintendo switch'}});
    // const keywordButton = document.getElementById('keywordButton');
    const button = document.getElementById('Search1');
    await waitFor(() => fireEvent
      .click(button));
    //expect(await screen.findByText('XBOSX')).toBeInTheDocument();
  });
});
