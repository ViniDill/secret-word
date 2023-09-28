
import './App.css'

import { useCallback, useEffect, useState } from 'react'

import {wordsList} from "./data/words"

import StarScreen from './Components/StarScreen'
import Game from './Components/Game'
import GameOver from './Components/GameOver'

const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'},
]

const guessesQty = 3

function App() {

  const [gameStage, setGamestage] = useState(stages[0].name)

  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(50)

  const pickWordAndCategory = useCallback(() =>{
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    console.log(category)

    const word = 
    words[category][Math.floor(Math.random() * words[category].length)]

    console.log(word)

    return{word, category}
  },[words])

  const startGame = useCallback(() => {
    clearLetterStates()
    const {word, category} = pickWordAndCategory()

    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    console.log(word, category)
    console.log(wordLetters)


    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGamestage(stages[1].name)
  }, [pickWordAndCategory])

  const verifyLetter = (letter) => {
    console.log(letter)

    const normalizedLetter = letter.toLowerCase()

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)
    ){
      return
    }

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetter) => [
        ...actualGuessedLetter,
        normalizedLetter,
      ])
    }else {
      setWrongLetters((actualGuessedLetter) => [
        ...actualGuessedLetter,
        normalizedLetter,
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }

  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])

  }

    useEffect(() => {
      if(guesses <= 0) {
        clearLetterStates()

        setGamestage(stages[2].name)
      }
    }, [guesses])

  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore += 100)

      startGame()
    }
  }, [guessedLetters, letters, startGame])  

  const retry = () =>{

    setScore(0)
    setGuesses(guessesQty)

    setGamestage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameStage=== 'start' && <StarScreen startGame={startGame}/>}
      {gameStage=== 'game' && <Game 
      verifyLetter={verifyLetter} 
      pickedWord = {pickedWord} 
      pickedCategory={pickedCategory} 
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}
      {gameStage=== 'end' && <GameOver retry={retry} score={score}/>}

    </div>
  )
}

export default App
