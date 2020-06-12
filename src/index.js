import { GraphQLServer } from 'graphql-yoga'
import {v4 as uuidv4} from 'uuid'

// Scalar Types
// String, Boolean, Int, Float, ID

// Demo user data
let users = [{
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
let posts = [{
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
let comments = [{
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

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)
            if (emailTaken) throw new Error('Email is already in use')

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)
            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)
            if (userIndex === -1) throw new Error('User not found')

            const deleteUsers = users.splice(userIndex, 1)

            posts = posts.filter((post) => {
                const match = post.author === args.id
                if (match) {
                    comments = comments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })
            comments = comments.filter((comment) => comment.author !== args.id)
            return deleteUsers[0]
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            if (!userExists) throw new Error('Author not found')

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)
            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id)
            if (postIndex === -1) throw new Error('Post not found')

            const deletePosts = posts.splice(postIndex, 1)
            comments = comments.filter((comment) => comment.post !== args.id)
            return deletePosts[0]
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            if (!userExists) throw new Error('Author not found')

            const postExists = posts.some((post) => post.published && post.id === args.data.post)
            if (!postExists) throw new Error('Post not published or not found')

            const comment = {
                id: uuidv4(),
                ...args.data
            }
            comments.push(comment)
            return comment
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id)
            if (commentIndex === -1) throw new Error('Comment not found')

            const deleteComments = comments.splice(commentIndex, 1)
            return deleteComments[0]
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