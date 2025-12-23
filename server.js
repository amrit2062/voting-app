
// Entry of project 
import express from 'express'
 // developed to the server 
import dotenv from 'dotenv';
dotenv.config();
import dbconnect from './db.js';
import userRoutes from './Routes/userRoutes.js'
import candidateRoutes from './Routes/candidateRoutes.js'
  import bodyParser from 'body-parser';
     // body  part in this projects  with require the  port 
 const app =  express();
       app.use(bodyParser.json()); // req.body
        const PORT = process.env.PORT || '3000';

         // import the router files 
await dbconnect();
          //use the routers
           app.use('/user',userRoutes);
           app.use('/candidate',candidateRoutes);

        // display message  in the listing port in the server

 app.listen(PORT , ()=>{
    console.log('Listening  server on port 3000');

 })
