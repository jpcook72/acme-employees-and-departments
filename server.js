const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { syncAndSeed } = require('./db');
const router = require('./API.js');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(express.static(__dirname));

app.use('/api', router)

app.use((err, req, res, next)=> {
    res.status(500).send('uhhh');
  });

const init = async()=> {
    try {
      await syncAndSeed();
      const port = process.env.PORT || 8080;
      app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(ex){
      console.log(ex);
    }
  };
  
  init();
  