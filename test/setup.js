process.env.TZ = 'UTC';
process.env.NODE_ENV = 'development';
process.env.JWT_SECRET = 'my-jwt-secret';

require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;