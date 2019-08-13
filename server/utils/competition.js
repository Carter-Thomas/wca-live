const wcaApi= require ('./wca-api');

/* Gets current WCIF from the WCA website and override results with the local ones. */
const synchronize = async (wcif, user) => {
  const newWcif = await wcaApi(user).getWcif(wcif.id);
  newWcif.events.forEach(newEvent => {
    const event = wcif.events.find(event => event.id === newEvent.id);
    newEvent.rounds.forEach(newRound => {
      const round = event.rounds.find(round => round.id === newRound.id);
      newRound.results = round.results;
    });
  });
  await wcaApi(user).updateWcif(wcif.id, { events: newWcif.events });
  return newWcif;
};

module.exports = {
  synchronize,
};
