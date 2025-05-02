

const app = require('./app');
const { sequelize } = require('./database/database');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
}

start();
