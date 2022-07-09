import express from 'express';
import routes from './routes/routes.js';
import cors from 'cors';

const app = express();
const port = 3000 || process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', routes);

app.listen(port, () => {
  console.log(`App is listening on port ${port}, http://localhost:${port}`);
});

export default app;
