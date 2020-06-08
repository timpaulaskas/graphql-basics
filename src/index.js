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
    published: false
}, {
    id: '11',
    title: 'GraphQL 101',
    body: '',
    published: true
}, {
    id: '12',
    title: 'Title #',
    body: 'GraphQL 201',
    published: true
}]

// Type definitions
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
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
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})