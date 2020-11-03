
import { gql } from '@apollo/client'

export const ADD_NEW = gql`
mutation addBook($title: String, $author : String , $published: Int, $genres: [String] ){
    addBook(title: $title ,  published: $published ,author: $author, genres: $genres){
        title
        author
        published
        genres
    }
}`