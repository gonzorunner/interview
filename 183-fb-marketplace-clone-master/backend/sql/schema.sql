-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
-- User Account table schema
DROP TABLE IF EXISTS user_account;
CREATE TABLE user_account(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), user_account jsonb);
-- listing table schema
DROP TABLE IF EXISTS listing;
CREATE TABLE listing(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), listing jsonb);
-- Category table
DROP TABLE IF EXISTS category;
CREATE TABLE category(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), category jsonb);