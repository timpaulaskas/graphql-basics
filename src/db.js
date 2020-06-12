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

const db = {
    users,
    posts,
    comments
}

module.exports = db