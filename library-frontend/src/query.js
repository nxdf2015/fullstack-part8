import { gql } from '@apollo/client'


export const ALL_AUTHORS = gql`query {
    allAuthors {
        name
        born
        bookCount
    }
}`

export const ALL_BOOKS = gql`query {
    allBooks {
        title
        published
        author { 
            name
            born
        }
    }
}`

export const CREATE_USER=gql`mutation createUser($username :String! , $favoriteGenre: String!){
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
        username
        favoriteGenre
    }
} `

export const LOGIN_USER = gql`mutation loginUser($username: String!, $password: String!){
    login(username: $username, password:$password){
        value
    }
}`

export const ALL_GENRES = gql`query {
    allGenres 
}`