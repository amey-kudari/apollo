import logo from './logo.svg';
import './App.css';
import { useMutation, useQuery, gql, useLazyQuery } from '@apollo/client';
import { useRef, useState } from 'react';


function AllBooks({setBook}) {
  const renders = useRef(1);
  const GET_ALL_BOOKS = gql`query GetAllBooks {
    books {
      title
      author
    }
  }`;
  // console.log('gql GET_ALL_BOOKS', GET_ALL_BOOKS);
  // const { loading, error, data, refetch, networkStatus } = useQuery(GET_ALL_BOOKS, {
  //   fetchPolicy: 'network-only', // Used for first execution
  //   nextFetchPolicy: 'network-only', // Used for subsequent executions  
  // });
  const [getAllBooks, {loading, error, data, refetch, networkStatus}] = useLazyQuery(GET_ALL_BOOKS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-only'
  })
  console.log('loading, error, data, network status at render:', renders.current, ': ', loading, error, data, networkStatus);
  renders.current++;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return <table style={{border: '1px solid black'}}>
    <thead><tr>
      <th>Title</th>
      <th>Author</th>
    </tr></thead>
    <tbody>{data?.books.map((book, index) => (<tr key={index}>
        <td style={{border: '1px solid black'}}><strong>{book.title}</strong></td> 
        <td style={{border: '1px solid black'}}><small>{book.author}</small></td>
        <td style={{padding: '0px'}}><button style={{cursor: 'pointer'}} onClick={()=>setBook(book)}>Explore</button></td>
      </tr>
    ))}
    <tr>
      <td><button onClick={() => refetch({})}>refetch</button></td>
      <td><button onClick={getAllBooks}>Lazy Fetch</button></td>
    </tr>
    </tbody>
  </table>;
}

function CommentPage({book}){
  const renders = useRef(1);
  const COMMENT_QUERY = gql`
    query getComment($title: String!, $author: String!){
      comments(title: $title, author: $author){
        comment
        name
      }
    }
  `;
  // console.log('Comment page variables', { ...book });
  const { loading, error, data, networkStatus, refetch } = useQuery(COMMENT_QUERY, {
    variables: { ...book },
    pollInterval: 500,
  });
  console.log('CommentPage loading, error, data, network status at render:', renders.current, ': ', loading, error, data, networkStatus);
  renders.current++;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return <table style={{border: '1px solid black', height: 'fit-content'}}>
    <thead><tr>
      <th>Comment</th>
      <th>Name</th>
    </tr></thead>
    <tbody>
    {data.comments.map((comment, key) => (<tr key={key}>
      <td style={{border: '1px solid black'}}>{comment.comment}</td>
      <td style={{border: '1px solid black'}}>{comment.name}</td>
    </tr>))}
    <tr>
    <td><button onClick={() => {console.log("refetch ...book"); refetch({...book})}}>Refetch without arguments</button></td>
    <td><button onClick={() => {console.log("refetch dog and bee"); refetch({ title: 'The Dog and the Bee', author: 'Amber Heard' })}}>DAB</button></td>
    </tr>
    </tbody>
  </table>
}

function AddComment({title, author}){
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const ADD_COMMENT = 
  gql`mutation AddAComment{
    addComment(title:$title, author:$author, name: $name, comment: $comment) {
      title
      author
      comment
      name
    }
  }`;
  const [addComment, { loading, error, data }] = useMutation(ADD_COMMENT);
  console.log('FROM ADDACOMMENT ', loading, error, data);
  // if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  return <form style={{height: 'fit-content'}} onSubmit={e => {
    e.preventDefault();
    addComment({ 
      variables: { 
        title, author, name, comment 
      },
      optimisticResponse: {
        addComment:{
          title:"...The Dog and the Bee",
          author:"...Amber Heard",
          comment:"...Ughh",
          name:"...Amber Heard",
          __typename:"Comment"
        }
      }
    });
  }}>
    <p>Add Comment to <br />{title} <br />by {author}</p>
    <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Comment"/> <br />
    <input value={name} onChange={e=>setName(e.target.value)} placeholder="name"/> <br />
    <button type="submit">Add Comment</button>
    <p>||{JSON.stringify(data)}||</p>
  </form>
}

function App() {
  const [book, setBook] = useState({title: 'The Dog and the Bee', author: 'Amber Heard'});
  return (
    <div className="App">
      <AllBooks setBook={setBook}/>
      <CommentPage book={book}></CommentPage>
      {/* <CommentPage book={{author: 'Amber Heard', asdf: 'ASDF'}}></CommentPage> */}
      <AddComment title={book.title} author={book.author}/>
    </div>
  );
}

export default App;
