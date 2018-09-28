const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-route');
const mongo = require('./mongodb.js');

const app = new Koa();
app.use(bodyParser());

let requests = [];


app.use(router.get('/exit', async(ctx) =>{
  console.log('Finalizing app...');  
  const mongoClient = mongo.client();
  if( mongoClient ){
    mongoClient.close();
  }
  process.exit(0);
}));


app.use(router.get('/disconnect', async(ctx) =>{
  console.log('Disconnecting from mongodb...');  
  const mongoClient = mongo.client();
  if( mongoClient ){
    mongoClient.close();
  }
  ctx.body = { connectedToMongoDB: false }; 
}));

app.use(router.get('/connect', async(ctx) =>{
  console.log('Reconnecting to mongodb...');  
  const mongoClient = mongo.connect();
  if( mongoClient ){
    ctx.body = { connectedToMongoDB: true };
  } else {
    ctx.body = { connectedToMongoDB: false };
  }
  
}));

app.use(router.get('/is-ready', async(ctx) =>{  
  const mongoClient = mongo.client();
  if( mongoClient ){
    try {
      const db = mongoClient.db('test');
      const status = await db.command({ serverStatus:1 });
      const { uptime, ok, connections, version } = status;

      if( ok === 1 ){
        const filteredStatus = { uptime, ok, connections, version };
        console.log('mongodb status:', filteredStatus);
        ctx.body = { isReady: true, status: filteredStatus };
      } else {
        ctx.status = 400;
        ctx.message = 'Mongodb status not OK';
        ctx.body = { isReady: false, status: filteredStatus }; 
        mongo.connect();     
      }

    } catch (error){
      console.log('mongodb error:', error);
      ctx.status = 400;
      ctx.message = error.message;
      ctx.body = { isReady: false, error: error }; 
      mongo.connect();
    }

  } else {
    ctx.status = 400;
    ctx.message = 'Not connected to mongodb';
    ctx.body = { isReady: false, error: 'Not connected to mongodb' };
    mongo.connect();
  }
}));

app.use(router.get('/is-alive', async(ctx) =>{
  ctx.body = { isAlive: true };
}));

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);  
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  requests[ 0 ].responseTime = `${ms}ms`;
});
  
// response

app.use(async ctx => {
  ctx.accepts('json');
  requests = [{ request:ctx.request, body: ctx.request.body }, ...requests];
  ctx.body = requests;
});

app.listen(process.env.PORT || 3000);