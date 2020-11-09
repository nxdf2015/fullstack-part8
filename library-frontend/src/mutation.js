import { gql } from '@apollo/client'


export const ADD_BOOK = gql`mutation addbook($title:String,$author:String,$published:Int,$genres:[String]){
  addBook(title:$title,author:$author,published:$published,genres:$genres){
      title
      author {
          name
      }
  }
}`

export const EDIT_AUTHORS=gql`mutation editAuthor($name:String!,$born:Int!){
    editAuthor(name:$name,setBornTo:$born){
        name
        born
    }
}`


export const LOGIN= gql`mutation login($username:String!, $password:String!){
    login(username:$username ,password:$password ){
        value
    }
}`