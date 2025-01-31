const app = require('./app');
const PORT = 5173;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});