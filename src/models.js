'use strict';

const config = require('config');
const Sequelize = require('sequelize');

const databaseUrl = "postgres://erwinhermanto:@localhost:5432/data_barang";
const sequelize = new Sequelize(databaseUrl, {
  underscoredAll: true,
});
const Barang = sequelize.define('tbl_barang',{
    nama_barang: Sequelize.STRING,
    deskripsi: Sequelize.TEXT,
    harga_barang: Sequelize.INTEGER,
    gambar: Sequelize.STRING,
});

module.exports = {
  Barang,
};
