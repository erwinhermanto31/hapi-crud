'use strict';

const R = require('ramda');
const { Barang } = require('./models');
const fs = require('fs');
const Boom = require('boom');
const { Pool, Client } = require('pg')
const connectionString = 'postgres://erwinhermanto:@localhost:5432/data_barang'

async function index(request, reply) {

  const client = new Client({
    connectionString: connectionString,
  })
  client.connect()

  client.query('SELECT * FROM tbl_barang', (err, res) => {
    return reply(res.rows)
    client.end()
  })
}

async function show(request, reply) {
  const id = request.params.id;
  const values = id
  const client = new Client({
    connectionString: connectionString,
  })

  client.connect()

    // console.log(values);
  client.query('SELECT * FROM tbl_barang Where id = '+values+'', (err, res) => {
    if (res.rows[0]) {
      return reply(res.rows[0])
    } else {
      return reply(Boom.notFound(`Cannot find barang ${id}`));
    }
    client.end()
  })
}

async function create(request, reply) {
  // console.log(request.payload.gambar.toString())
  const dateTime = require('node-datetime');
  const dt = dateTime.create();
  const formatted = dt.format('Y-m-dH:M:S');
  const name_file = formatted+'.png';
  console.log(formatted);

  const handleFileUpload = file => {
    return new Promise((resolve, reject) => {
      fs.writeFile('./image/'+name_file+'', file, err => {
        if (err) {
         reject(err)
        }
      })
    })
  }

  if (payload.file) {
    const { payload } = request
    const response = handleFileUpload(payload.file)
  }
  // console.log(response.file)


  const nama_barang = request.payload.nama_barang;
  const deskripsi = request.payload.deskripsi;
  const harga_barang = request.payload.harga_barang;
  
  const client = new Client({
    connectionString: connectionString,
  })
  client.connect()

  const query = {
    text: 'INSERT INTO tbl_barang(nama_barang, deskripsi, harga_barang, gambar) VALUES($1, $2, $3, $4)',
    values: [nama_barang, deskripsi,harga_barang,name_file],
  }

  client.query(query, (err, res) => {
    if (!err) {
      return reply('Berhasil Menyimpan');
    } else {
      console.log(err.stack)
    }
    client.end()
  })
}

async function update(request, reply) {

  const dateTime = require('node-datetime');
  const dt = dateTime.create();
  const formatted = dt.format('Y-m-dH:M:S');
  const name_file = formatted+'.png';
  console.log(formatted);

  const handleFileUpload = file => {
    return new Promise((resolve, reject) => {
      fs.writeFile('./image/'+name_file+'', file, err => {
        if (err) {
         reject(err)
        }
      })
    })
  }

  if (payload.file) {
    const { payload } = request
    const response = handleFileUpload(payload.file)
  }

  const id = request.params.id;
  const nama_barang = request.payload.nama_barang;
  const deskripsi = request.payload.deskripsi;
  const harga_barang = request.payload.harga_barang;

  const client = new Client({
    connectionString: connectionString,
  })
  client.connect()

  const query = {
    text: 'UPDATE tbl_barang SET nama_barang=$1, deskripsi=$2, harga_barang=$3, gambar=$4 WHERE id = $5 ',
    values: [nama_barang, deskripsi,harga_barang,name_file,id],
  }

  client.query(query, (err, res) => {
    if (!err) {
      return reply('Berhasil Memperbarui');
    } else {
      console.log(err.stack)
    }
    client.end()
  })
}

async function destroy(request, reply) {
  const id = request.params.id;
  const values = id
  const client = new Client({
    connectionString: connectionString,
  })

  client.connect()

    // console.log(values);
  client.query('DELETE FROM tbl_barang Where id = '+values+'', (err, res) => {
    if (!err) {
      return reply('Berhasil Menghapus');
    } else {
      console.log(err.stack)
    }
    client.end()
  })
}

async function destroy(request, reply) {
  const id = request.params.id;
  const values = id
  const client = new Client({
    connectionString: connectionString,
  })

  client.connect()

    // console.log(values);
  client.query('DELETE FROM tbl_barang Where id = '+values+'', (err, res) => {
    if (!err) {
      return reply('Berhasil Menghapus');
    } else {
      console.log(err.stack)
    }
    client.end()
  })
}

function addRoutes(server) {
  var corsHeaders = {
    origin: ["*"],
    headers: ['Origin', 'X-Requested-With', 'Content-Type'],
    credentials: true,
    additionalHeaders: ['access-control-allow-headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, CORRELATION_ID'],
    additionalExposedHeaders: ['access-control-allow-headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, CORRELATION_ID']
  };

  server.route({
    method: 'GET',
    path: '/',
    config: {
      cors: corsHeaders
    },
    handler: function(request, reply) {
      return reply('Hello world');
    },
  });
  server.route({
    method: 'GET',
    path: '/barangs',
    config: {
      cors: corsHeaders
    },
    handler: index,
  });
  server.route({
    method: 'GET',
    path: '/barangs/{id}',
    config: {
      cors: corsHeaders
    },
    handler: show,
  });
  server.route({
    method: 'POST',
    path: '/barangs',
    config: {
      cors: corsHeaders
    },
    handler: create,
  });
  server.route({
    method: 'POST',
    path: '/barangs/{id}',
    config: {
      cors: corsHeaders
    },
    handler: update,
  });
  server.route({
    method: ['DELETE'],
    path: '/barangs/{id}',
    config: {
      cors: corsHeaders
    },
    handler: destroy,
  });
}

module.exports = {
  addRoutes,
};
