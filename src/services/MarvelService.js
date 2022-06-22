import {useHttp} from "../hooks/http.hook";

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp()
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    const _apiKey = 'apikey=3ba3484b4618595eef1cbfdfd1f415c4'
    const _baseOffset = 210

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async id => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
        return _transformCharacter(res.data.results[0])
    }

    const _transformCharacter = char => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? char.description : 'The character has no description...',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }

    return {  loading, error, getCharacter, getAllCharacters, clearError  }
}

export default useMarvelService
