import app from './app';

// listen for requests
const PORT = process.env.PORT || 3000; // the functional port is 3000
app.listen(PORT, () => {
  console.log('Server is listening on port 3000');
});
