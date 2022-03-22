import app from './app';

// listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Server is listening on port 3000');
});
