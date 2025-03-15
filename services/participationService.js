const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

async function getParticipationData() {
  try {
    const tournamentsSnapshot = await db.collection('tournament').get();
    const tournaments = tournamentsSnapshot.docs.map(doc => doc.data());

    let allData = [];

    for (const tournament of tournaments) {
      const participations = tournament.Participations || [];
      participations.forEach(participation => {
        allData.push({
          ...participation,
          TournamentName: tournament.TournamentName,
          TournamentDate: tournament.TournamentDate,
          TournamentLevel: tournament.TournamentLevel,
        });
      });
    }

    // Extraire les comités uniques
    const committees = [...new Set(allData.map(data => data.Committee))];

    return {
      allData,
      committees,
    };
  } catch (error) {
    console.error("Error fetching participation data:", error);
    throw error;
  }
}

module.exports = { getParticipationData };