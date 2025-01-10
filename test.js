const bcrypt = require('bcrypt');
const { User } = require('./models');

const hashAndUpdatePassword = async () => {
    const email = 'admin@test.com'; // Remplace par l'email de ton admin
    const hashedPassword = await bcrypt.hash('adminpassword', 10); // Choisis ton mot de passe
    await User.update(
        { password: hashedPassword },
        { where: { email } }
    );
    console.log('Mot de passe mis à jour avec succès !');
};

hashAndUpdatePassword();