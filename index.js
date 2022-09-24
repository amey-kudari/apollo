const { ApolloServer, gql } = require('apollo-server');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Comment{
    title: String
    author: String
    comment: String
    name: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    comments(title:String, author:String): [Comment]
  }

  type Mutation {
    addComment(title: String!, author: String!, comment: String!, name: String): Comment
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
  {
    title: 'The Op Ed',
    author: 'Amber Heard',
  },
  {
    title: 'The Dog and the Bee',
    author: 'Amber Heard'
  }
];

const comments = [
  {
    title: 'The Dog and the Bee',
    author: 'Amber Heard',
    comment: 'Very heart touching story',
    name: 'Emma'
  }
]

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => {
      console.log("GOT QUERY FOR BOOKS!!");
      return books
    },
    comments: (_,{title, author}) => comments.filter(comment => comment.title === title && comment.author === author)
  },
  Mutation: {
    addComment: (_, {title, author, comment, name}) => {
      // console.log("ADDING COMMENT!!")
      comments.push({title, author, comment, name});
      console.log("ADDING COMMENT!!", {title, author, comment, name})

      let a = 1;
      for(let i=0;i<1000000000;i++) a=a-i*i + a*i;
      for(let i=0;i<1000000000;i++) a=a-i*i + a*i;
      for(let i=0;i<1000000000;i++) a=a-i*i + a*i;
      console.log(comments);
      // const b = 2;
      // b=3;
      return comments[comments.length - 1];
    }
  }
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  /**
   * What's up with this embed: true option?
   * These are our recommended settings for using AS;
   * they aren't the defaults in AS3 for backwards-compatibility reasons but
   * will be the defaults in AS4. For production environments, use
   * ApolloServerPluginLandingPageProductionDefault instead.
  **/
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
