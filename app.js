const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models'); // Instance Sequelize
const deviceRoutes = require('./routes/deviceRoutes');
const logsRoutes = require('./routes/logRoutes');
const userRoutes = require('./routes/userRoutes'); // Nouveau
const collectionPointRoutes = require('./routes/collectionPointRoutes'); // Nouveau
const authRoutes = require('./routes/authRoutes'); // Importation ajoutée

dotenv.config();

const app = express();
const cors = require('cors');
app.use(cors()); // Autorise les requêtes provenant de n'importe quelle origine

const PORT = process.env.PORT || 3333;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Ajout des routes d'authentification
app.use('/api/devices', deviceRoutes);
app.use('/api/users', userRoutes); // Nouveau
app.use('/api/collection-points', collectionPointRoutes); // Nouveau
app.use('/api/logs', logsRoutes); // Nouveau

// Test route
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API de gestion des appareils, utilisateurs et points de collecte');
});

console.log('Démarrage du serveur...');

sequelize
    .sync()
    .then(() => {
        console.log('Connexion à la base de données réussie.');
        app.listen(PORT, () => {
            console.log(`Le serveur tourne sur le port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erreur de connexion à la base de données :', error);
    });

console.log('Après la tentative de synchronisation avec Sequelize...');
