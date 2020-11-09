import { gql } from '@apollo/client'

export const  ALL_BOOKS = gql`query {
    allBooks {
        title
        genres
        published
        author {
            name
            born
           bookCount
        }
    }
}`

export const ALL_AUTHORS = gql`query {
    allAuthors {
        name
        born 
        bookCount
    }
}`

export const GENRES=gql`query {
    allGenres 
}`

export const ME=gql`query{
    me {
    username
    favoriteGenre
}
}`

export const ALL_BOOKS_BY_GENRES=gql`query allbooksByGenres($genre:String){
    allBooks(genre:$genre){
        title
        genres
        published
        author {
            name
            born
           bookCount
        }
    }
}`
