import './App.scss';
import Species from './Species';
import react, { useEffect, useState } from 'react';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

const getSpeciesData = async () => {
  const data = await fetch(API_URL);
  const parsedData = await data.json();

  const speciesUrls = parsedData.species.map(async (url) => {
    const speciesUrlsData = await fetch(url);
    const parsedSpeciesUrlsData = await speciesUrlsData.json();

    return parsedSpeciesUrlsData;
  });
  
  const species = await Promise.all(speciesUrls);

  return species;
};

const getSpeciesHeightInInches = (measure) => {
  if(measure === 'n/a'){
    return 'N/A';
  }

  const heightIninches = +measure / CM_TO_IN_CONVERSION_RATIO;
  const roundedHeight = Math.round(heightIninches);

  return `${roundedHeight}''`;
}

const getSpeciesImage = (speciesName) => {
  const splitSpeciesName = speciesName.split("'");
  const speciesNameToLowerCase = splitSpeciesName[0].toLowerCase();
  const imageUrl = SPECIES_IMAGES[speciesNameToLowerCase];

  return imageUrl;
}

function App() {
  const [species, setSpecies] = useState([]);

  useEffect(() => {
    const requestGetSpecies = async () => {
      try {
        const data = await getSpeciesData();
        setSpecies(data);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    };

    requestGetSpecies();
  }, []);

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {species.map((item) => (
          <Species
            key={item.url}
            name={item.name}
            classification={item.classification}
            designation={item.designation}
            height={getSpeciesHeightInInches(item.average_height)}
            image={getSpeciesImage(item.name)}
            numFilms={item.films.length}
            language={item.language}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
