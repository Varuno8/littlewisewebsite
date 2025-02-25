import mongoose from "mongoose";

const userSchema = new mongoose.Schema( 
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    cartItems: { type: Object, default: {} },
  },
    { minimize: false } //minimize: false → Empty objects are preserved
);

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;

/*
In Mongoose, the option **`minimize: false`** is used in the schema to control how empty objects are stored in MongoDB.

### **What Does `minimize` Do?**
- By default, Mongoose uses `minimize: true`, which means that it will **remove empty objects** from the document before saving it to MongoDB.
- If you set `minimize: false`, Mongoose will **keep empty objects** in the document.

---

### **Why is this Useful?**
This option is useful when you **want to maintain the structure** of the document even if some nested objects are empty.

### **Example:**

With `minimize: true` (default behavior):

```js
const userSchema = new mongoose.Schema({
  name: String,
  cartItems: { type: Object, default: {} }
});

// Create a user with an empty cartItems object
const user = new User({ name: "John" });
await user.save();
```

The document saved in MongoDB will look like this:
```json
{
  "_id": "someObjectId",
  "name": "John"
}
```
- Notice that `cartItems` is **not saved** because it's an empty object.

---

With `minimize: false`:

```js
const userSchema = new mongoose.Schema({
  name: String,
  cartItems: { type: Object, default: {} }
}, { minimize: false });

const User = mongoose.model('User', userSchema);

// Create a user with an empty cartItems object
const user = new User({ name: "John" });
await user.save();
```

The document saved in MongoDB will look like this:
```json
{
  "_id": "someObjectId",
  "name": "John",
  "cartItems": {}
}
```
- Notice that `cartItems` is saved **even though it's empty** because we used `minimize: false`.

---

### **Why Would You Use This?**
1. **Preserve Structure:** You might want to **maintain the structure** of the document even if the object is empty, especially if the field is expected to be populated later.
2. **Consistent Schema:** It ensures **consistent schema** across all documents, which can make querying and updating documents easier.
3. **Frontend Requirements:** In some cases, front-end applications expect certain fields to always be present, even if they are empty.

### **In Your Code:**
In your code, you are using:
```js
const userSchema = new mongoose.Schema({
  cartItems: { type: Object, default: {} }
}, { minimize: false });
```
This means that:
- If `cartItems` is empty (`{}`), it will **still** be saved in MongoDB.
- This is useful if you want to maintain a consistent schema where every user has a `cartItems` field, even if they haven't added any items yet.

---

### **Summary:**
- `minimize: true` (default) → **Empty objects are removed**.
- `minimize: false` → **Empty objects are preserved**.

This is particularly useful when you want to **preserve the structure** of your MongoDB documents or when the **front-end expects certain fields** to always be present.
*/