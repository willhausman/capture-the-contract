import express from 'express';
import path from 'path';

const app = express();
app.use(express.static(path.resolve(__dirname, 'static')));

app.listen(3000, () => {
  console.log('All aboard.');
});
