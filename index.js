import express from 'express';
import routes from './routes/routes.js';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

app.listen(port, () => {
  console.log(`App is listening on port ${port}, http://localhost:${port}`);
});

export default app;
