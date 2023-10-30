import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import productsRoutes from "./routes/productsRouter.js"
import cartsRoutes from "./routes/cartsRouter.js"
import sessionsRouter from './routes/sessionsRouter.js'
import mockingRouter from './routes/mockingRouter.js'
import viewsRoutes from "./routes/viewsRouter.js"
import messagesRouter from  "./routes/messagesRouter.js"
import { Server } from 'socket.io';
import { productsUpdated, chat  } from './utils/socketUtils.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import config from './config/config.js';
import { addLogger, loggerInfo } from './utils/logger.js';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';


const app = express();

const mongoURL = `mongodb+srv://${config.admin}:${config.password}@clusterprueba.g12vkb7.mongodb.net/ecommerce`;
const connection = mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'))
app.use(session({
    store: new MongoStore({
        mongoUrl: mongoURL,
        ttl: 3600
    }),
    secret: "CoderS3cr3t",
    resave: false,
    saveUninitialized: false
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// confi de swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion API Adopme',
            description: 'Documentacion para uso de swagger!!'
        }
    },
    apis: [`./src/docs/**/*.yaml`]
}

// creamos el specs
const specs = swaggerJSDoc(swaggerOptions);

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/messages', messagesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/mockingproducts', mockingRouter);
app.use('/', viewsRoutes);

app.get("/api/loggerTest", (req, res) => {
    req.logger.debug('Error debug Dev')
    req.logger.http("HTTP Error Dev")
    req.logger.info("Info Dev")
    req.logger.warning("Warning Dev")
    req.logger.error("Un error")
    res.send('')
  })

// Declaramos swagger API - endpoint
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

const PORT = config.port;
const serverHttp = app.listen(PORT, () => {
    const info = loggerInfo()
    info.info(`Servidor funcionando correctamente en ${config.port}`)
})
const io = new Server(serverHttp);

app.set('io', io);

io.on('connection', socket => {
    console.log('New client connected', socket.id);
    productsUpdated(io);
    chat(socket, io);
});