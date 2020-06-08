import { GraphQLServer } from 'graphql-yoga'

// Scalar Types
// String, Boolean, Int, Float, ID

// Demo user data
const users = [{
    id: '1',
    name: 'Tim',
    email: 'tim@example.com',
    age: 46
}, {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
}]

// Demo post data
const posts = [{
    id: '10',
    title: 'Title #',
    body: '',
    published: false,
    author: '1'
}, {
    id: '11',
    title: 'GraphQL 101',
    body: '',
    published: true,
    author: '3'
}, {
    id: '12',
    title: 'Title #',
    body: 'GraphQL 201',
    published: true,
    author: '3'
}]

// Demo comment data
const comments = [{
    id: '100',
    author: '2',
    text: 'This is the first comment',
    post: '11'
}, {
    id: '101',
    author: '2',
    text: 'My comment from the 2nd comment',
    post: '10'
}, {
    id: '102',
    author: '1',
    text: 'Third comment',
    post: '10'
}, {
    id: '103',
    author: '3',
    text: 'Hello',
    post: '12'
}]


// Type definitions
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) return users

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) return posts

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        comments(parent, args, ctx, info) {
            return comments
        },
        me() {
            return {
                id: 'abc123',
                name: 'Mike',
                email: 'mike@example.com'
            }
        },
        post() {
            return {
                id: '123abc',
                title: 'Title of the post',
                body: 'Content of the post',
                published: false
            }
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.post === parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => post.author === parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id === parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => post.id === parent.post)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})