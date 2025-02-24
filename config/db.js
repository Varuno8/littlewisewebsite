import mongoose from "mongoose";

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose= { conn: null, promise: null }
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect('${ process.env.MONGODB_URI } / littlewise', opts).then(mongoose => {
            return mongoose
        })
    } 

    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB

/*
let's dive deeper into this code and explain every tiny detail, including **what** each variable is storing, **how** the storage is happening, and the reasons behind the use of concepts like `async`, `await`, `global`, `Promise`, and more. We'll use examples and analogies to make everything crystal clear.

---

## 1. **Understanding `global` in Node.js**

```js
let cached = global.mongoose;
```

### What is `global`?

- In Node.js, `global` is an object that represents the global scope, similar to `window` in the browser.
- Variables attached to `global` can be accessed anywhere in your application.
- Example:
    ```js
    global.foo = "Hello";
    console.log(global.foo); // Output: Hello
    ```

### Why use `global` here?

- **Reason:** 
  - In serverless environments (like Vercel or Netlify), functions are short-lived and re-executed for every request.
  - Without `global`, a new database connection would be created for every request, wasting time and resources.
  - By using `global`, we store the connection and reuse it, reducing overhead.

### What is `cached` storing?

- Initially, `cached` is assigned the value of `global.mongoose`.
- If `global.mongoose` is undefined, it will become:
    ```js
    cached = {
      conn: null,       // To store the MongoDB connection once established
      promise: null     // To store the promise of the connection during the connection process
    }
    ```
- Example Flow:
    - First Request: `global.mongoose` is undefined, so we initialize `cached`.
    - Second Request: `global.mongoose` is already set, so `cached` is reused, avoiding a new connection.

---

## 2. **Checking and Initializing the Cache**

```js
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}
```

### Why check for `!cached`?

- **Reason:**
  - This ensures the cache is initialized only once. 
  - If it's already initialized, it avoids overwriting it.
  - This is crucial to maintain a single database connection.

### Example Scenario:

1. **First Request:**
    - `global.mongoose` is `undefined`.
    - `cached` becomes:
        ```js
        cached = {
          conn: null,
          promise: null
        }
        ```
    - `global.mongoose` now also points to this object.

2. **Second Request:**
    - `global.mongoose` is already set, so the `if` check fails.
    - `cached` now references the same object as in the first request, reusing the connection.

---

## 3. **Understanding `async` and `await`**

```js
async function connectDB() {
```

### What is `async`?

- `async` makes a function return a **Promise**.
- It allows us to use `await` inside the function.
- Example:
    ```js
    async function example() {
        return "Hello";
    }
    example().then(console.log); // Output: Hello
    ```

### Why use `async` here?

- **Reason:** 
  - Connecting to a database is an asynchronous operation that takes time.
  - Using `async` allows us to use `await`, making the code easier to read and maintain.
  - It prevents "callback hell" and makes the flow appear synchronous.

### What is `await`?

- `await` pauses the function execution until the promise is resolved.
- It ensures that we only proceed once the connection is established.
- Example:
    ```js
    async function getData() {
        let result = await someAsyncFunction();
        console.log(result);
    }
    ```

---

## 4. **Checking for Existing Connection**

```js
if (cached.conn) {
    return cached.conn;
}
```

### Why check for `cached.conn`?

- **Reason:**
  - `cached.conn` stores the established database connection.
  - If a connection is already established, we reuse it instead of creating a new one.
  - This prevents multiple connections, which is both resource-intensive and unnecessary.

### Example Scenario:

- **First Request:**
    - `cached.conn` is `null`, so it moves to create a new connection.
- **Second Request:**
    - `cached.conn` is now set with the connection object, so it returns the existing connection.

### What is `cached.conn` storing?

- It stores the **Mongoose connection object**.
- This object is used to interact with the MongoDB database.
- Example:
    ```js
    cached.conn = {
      readyState: 1,  // 1 means connected
      models: {...}  // Mongoose models are stored here
    }
    ```

---

## 5. **Checking and Creating a Connection Promise**

```js
if (!cached.promise) {
    const opts = {
        bufferCommands: false,
    };
```

### Why check for `!cached.promise`?

- **Reason:**
  - This checks if a connection attempt is already in progress.
  - If no connection attempt is in progress (`null`), it creates a new promise.
  - This avoids multiple connection attempts if multiple requests are made simultaneously.

### What is `cached.promise` storing?

- It stores a **Promise** representing the asynchronous connection process.
- Example:
    ```js
    cached.promise = new Promise((resolve, reject) => {
      // Connecting to the database...
    });
    ```

### Why use `Promise` here?

- **Reason:**
  - The connection process is asynchronous and takes time.
  - Using a Promise ensures that all requests wait for the first connection to complete.
  - This avoids race conditions and multiple connections.

---

## 6. **Creating a Connection**

```js
cached.promise = mongoose.connect(`${ process.env.MONGODB_URI }/littlewise`, opts)
    .then(mongoose => {
        return mongoose;
    });
```

### What is happening here?

- This line:
  - Connects to MongoDB using the URI from environment variables.
  - Uses `bufferCommands: false` to disable command buffering while connecting.
  - The `.then()` method resolves the promise with the connected `mongoose` instance.

### Why use `.then()`?

- **Reason:**
  - `.then()` handles the successful resolution of the promise.
  - It ensures that `cached.promise` is only resolved when the connection is fully established.

### Example of what is stored:

```js
cached.promise = Promise {
    <pending>  // While connecting
}
```
After connection:
```js
cached.promise = Promise {
    <resolved>: mongooseInstance  // The connected mongoose instance
}
```

---

## 7. **Storing and Returning the Connection**

```js
cached.conn = await cached.promise;
return cached.conn;
```

### Why use `await` here?

- **Reason:**
  - `await` pauses execution until the promise is resolved.
  - It ensures that the connection is fully established before moving forward.
  - This prevents errors caused by accessing the database before the connection is ready.

### Example of what is stored:

```js
cached.conn = {
    readyState: 1,  // 1 means connected
    models: {...}   // Mongoose models are available here
}
```

### Why return `cached.conn`?

- This makes the connection reusable in other parts of the application.
- Any module that imports this function will get the established connection.

---

## 8. **Exporting the Function**

```js
export default connectDB;
```

- **What:** Exports `connectDB` as the default export of this module.
- **Why:** This allows other modules to import and use this function to get the database connection.

Example:
```js
import connectDB from "./path/to/this/file";
await connectDB();
```

---

## Summary
- **`global`** is used for caching to reuse the connection in serverless environments.
- **`async` and `await`** are used for asynchronous flow, making the code cleaner and easier to read.
- **`Promise`** is used to handle the asynchronous connection process, ensuring only one connection attempt at a time.
- **`cached.conn`** stores the actual database connection.
- **`cached.promise`** stores the ongoing connection process as a promise.
- **`bufferCommands: false`** prevents buffering commands while connecting, ensuring stability.

This approach optimizes performance, avoids multiple connections, and is especially useful in serverless environments where functions are short-lived and re-executed frequently.
*/