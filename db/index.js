const { Client } = require('pg'); // imports the pg module

// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');

async function getAllUsers() {
    const { rows } = await client.query(
      `SELECT * 
      FROM users;
    `);
  
    return rows;
  }

  async function getAllPosts() {
    try {
        const { rows } = await client.query(
            `SELECT * 
            FROM posts;
          `);
        
          return rows;
    } catch (error) {
      throw error;
    }
  }

  async function createUser({ 
    username, 
    password,
    name,
    location
  }) {
    try {
      const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password, name, location]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }
  async function createPost({
    authorId,
    title,
    content
  }) {
    try {
        const { rows: [ user ] } = await client.query(`
        INSERT INTO posts(authorId, title, content) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [authorId, title, content]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ user ]} = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function updatePost(id, {
    title,
    content,
    active
  }) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
    
      // return early if this is called without fields
      if (setString.length === 0) {
        return;
      }
    try {
        const { rows } = await client.query(`
        UPDATE posts
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(title, content, active));
  
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function getPostsByUser(userId) {
    try {
      const { rows } = client.query(`
        SELECT * FROM posts
        WHERE "authorId"=${ userId };
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function getUserById(userId) {
      try {
          const [user] = await getAllUsers(userId)
          if (user) {
              return null
          } else {
            delete user.password
            const posts = await getPostsByUser(userId)
            user.posts = posts;

            return user
          }
      } catch (error) {
        throw error;
      }
  }
  
  
  module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getUserById
  }
