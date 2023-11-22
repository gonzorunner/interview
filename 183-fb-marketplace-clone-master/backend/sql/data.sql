-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --

-- User Account table data
DELETE FROM user_account;
INSERT INTO user_account(id, user_account) VALUES ('d9ec7011-26e7-46f9-8319-bc847d0fedc3', '{"first_name":"John","last_name": "Doe","email":"john@doe.com","password": "$2b$10$KL2VvxXJzu1VTcnpDxnKSuDu8RpAsHlJARIDTXJeKaASjFTIi/0mS"}');
INSERT INTO user_account(id, user_account) VALUES ('152cf45a-7690-423d-8072-ab97b475fbbd', '{"first_name":"Smith","last_name": "Doe","email":"smith@doe.com","password": "$2b$10$a5McF.QDmASmdXnP3g4fSOc9kS37sEqlQYmQAVbITO7V.p4THtL0."}');
-- Listing table data
INSERT INTO listing(listing) VALUES ('{"title":"PS5","price": "1000","description":"brand new playstation","user":"d9ec7011-26e7-46f9-8319-bc847d0fedc3","replies":[],"date":"2020-02-27T00:10:43Z","image":"https://i.imgur.com/olvDRsv.png","category":"938f9f87-f0c7-48ec-876d-4aefc536014c"}');
INSERT INTO listing(listing) VALUES ('{"title":"XBOSX","price": "1000","description":"brand new xbox series x","user":"152cf45a-7690-423d-8072-ab97b475fbbd","replies":[],"date":"2020-01-27T00:10:43Z","image":"https://i.imgur.com/psgTc9R.jpeg","category":"a13c9144-aedc-461c-8d5b-49e885d9aa5e"}');
-- Categpru table data
INSERT INTO category(id, category) VALUES ('938f9f87-f0c7-48ec-876d-4aefc536014c','{"category":"Vehicles","parent":"null"}');
INSERT INTO category(id, category) VALUES ('a13c9144-aedc-461c-8d5b-49e885d9aa5e','{"category":"Property Rentals","parent":"null"}');
INSERT INTO category(id, category) VALUES ('ba108c86-8b43-4399-a8e9-da0d3c9d1d1f','{"category":"Apparel","parent":"null"}');
INSERT INTO category(category) VALUES ('{"category":"Cars","parent":"Vehicles"}');
INSERT INTO category(category) VALUES ('{"category":"Motorcycles","parent":"Vehicles"}');
