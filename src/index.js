import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import MarvelService from "./services/MarvelService";
import './style/style.scss';

const marvelService = new MarvelService();

marvelService.getAllCharacters().then(res => console.log(1, res))
marvelService.getCharacter(1010914).then(res => console.log(2, res))

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
