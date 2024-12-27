const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fatloss')
        .setDescription("Estime le déficit calorique nécessaire pour perdre du poids.")
        .addNumberOption(option =>
            option.setName('poids_actuel')
                .setDescription('Votre poids actuel en kg.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('poids_cible')
                .setDescription('Votre poids cible en kg.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('taille')
                .setDescription('Votre taille en cm.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('age')
                .setDescription('Votre âge.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('sexe')
                .setDescription('Votre sexe.')
                .addChoices(
                    { name: 'Homme', value: 'homme' },
                    { name: 'Femme', value: 'femme' }
                )
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('duree')
                .setDescription('Durée pour atteindre votre objectif (en mois).')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('activite')
                .setDescription('Votre niveau d\'activité.')
                .addChoices(
                    { name: 'Sédentaire', value: 'sedentaire' },
                    { name: 'Légèrement actif', value: 'leger' },
                    { name: 'Modérément actif', value: 'modere' },
                    { name: 'Très actif', value: 'actif' },
                    { name: 'Extrêmement actif', value: 'extreme' }
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const poidsActuel = interaction.options.getNumber('poids_actuel');
        const poidsCible = interaction.options.getNumber('poids_cible');
        const taille = interaction.options.getNumber('taille');
        const age = interaction.options.getInteger('age');
        const sexe = interaction.options.getString('sexe');
        const duree = interaction.options.getNumber('duree');
        const activite = interaction.options.getString('activite');

        // Facteurs d'activité
        const facteurs = {
            sedentaire: 1.2,
            leger: 1.375,
            modere: 1.55,
            actif: 1.725,
            extreme: 1.9,
        };

        // Calcul du métabolisme de base (BMR)
        let bmr;
        if (sexe === 'homme') {
            bmr = 10 * poidsActuel + 6.25 * taille - 5 * age + 5;
        } else {
            bmr = 10 * poidsActuel + 6.25 * taille - 5 * age - 161;
        }

        // Calcul du TDEE
        const tdee = bmr * facteurs[activite];

        // Calcul du poids à perdre et du déficit calorique total
        const poidsAPerdre = poidsActuel - poidsCible;
        const deficitTotal = poidsAPerdre * 7700; // 1 kg de graisse = environ 7700 kcal

        // Calcul du déficit calorique quotidien
        const jours = duree * 30; // Approximation du nombre de jours
        const deficitQuotidien = (deficitTotal / jours).toFixed(2);

        // Calories quotidiennes recommandées
        const caloriesRecommandees = (tdee - deficitQuotidien).toFixed(2);

        // Réponse
        await interaction.reply(
            `\<:warning:1322214413482197032> **Plan de perte de poids** :\n\n` +
            `- **Poids actuel** : ${poidsActuel} kg\n` +
            `- **Poids cible** : ${poidsCible} kg\n` +
            `- **Durée** : ${duree} mois\n` +
            `- **Déficit calorique total** : ${deficitTotal} kcal\n` +
            `- **Déficit calorique quotidien** : ${deficitQuotidien} kcal/jour\n\n` +
            `\<:info:1322215662621425674> **Calories recommandées par jour** : ${caloriesRecommandees} kcal`
        );
    },
};
