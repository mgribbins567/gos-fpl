export function Player(points, web_name, minutes, stats) {
  this.points = points;
  this.web_name = web_name;
  this.minutes = minutes;
  this.stats = stats;
}

export function checkElementId(element) {
  switch (element) {
    case 666: // Gyokeres
      return 661; // Ekitike
    case 661: // Ekitike
      return 666; // Gyokeres
    case 673: // Palhinha
      return 674; // Ramsdale
    case 674: // Ramsdale
      return 673; // Palhinha
    case 715: // John
      return 714; // Woltemade
    case 679: // Hermansen
      return 681; // Sesko
    case 729: // Cuiabano
      return 733; // Lammens
    case 718: // Magassa
      return 717; // Xavi
    case 728: // Röhl
      return 736; // Donnarumma
    case 733: // Lammens
      return 730; // Brobbey
    case 735: // Traoré
      return 726; // Kolo Muani
    case 682: // Wolfe
      return 685; // Diakite
    case 736: // Donnarumma
      return 720; // Tolu
    case 667: // Aznou
      return 668; // Xhaka
    case 664: // Lecomte
      return 660; // Stach
    case 695: // Tchatchoua
      return 696; // Kalimuendo
    default:
      return element;
  }
}

export function getPlayerScoreMap(liveData, bootstrapData) {
  const playerScoreMap = new Map();
  liveData.elements.forEach((player) => {
    playerScoreMap.set(
      player.id,
      new Player(
        player.stats.total_points,
        bootstrapData.elements.find(
          (element) => element.id === player.id
        ).web_name,
        player.stats.minutes,
        player.explain[0].stats
      )
    );
  });
  return playerScoreMap;
}
