# This file has schemaq definmitions

## user collection
```json

{
  "_id": "ObjectId",
  "name": "Varsha",
  "email": "varsha@example.com",
  "password": "hashed_password_here",
  "role": "user",
  "address": "Delhi, India",
  "phone": "9876543210",
  "createdAt": "2025-10-09T10:30:00Z"
}



```


## artwork collection
```json

{
  "_id": "ObjectId",
  "title": "Sunset Dreams",
  "imageUrl": "https://example.com/artworks/sunset.jpg",
  "price": 2500,
  "mrp":"3000",
  "rating": 4.8,
  "theme": "Nature",
  "size": "24x36 inches",
  "product dimension": "90lx45w cm",
  "orientation": "Landscape",
  "number of item": "1",
  "description": "A soothing sunset artwork in acrylic.",
  "shape": "Rectangle",
  "Recommended Uses For Product":"wall decor",
  "paymentMethods": ["UPI", "Credit Card", "COD"],
  "category": "Acrylic Painting",
  "material ":"wood",
  "country of origin":"undefined",
  "item weight":"550g",
  "manufacturer":"bottoms art"
}


```

## books collection
```json

{
  "_id": "ObjectId",
  "title": "The Art of Creativity",
  "imageUrl": "https://example.com/books/creativity.jpg",
  "author": "John Doe",
  "price": 499,
  "mrp":"600",
  "rating": 4.5,
  "review":"undefined",
  "net quantity":1,
  "book description": "A book about mastering creativity and inspiration.",
  "reading age":"Customer suggested age: 10 years and up",
  "genre": "Art & Inspiration",
  "pages": 180,
  "country of origin":"undefined",
  "publisher": "ArtistCorner Press",
  "paymentMethods": ["UPI", "Debit Card"],
  "publication date": "2025-10-09T10:30:00Z",
  "publication place":"United kingdom",
  "language":"english",
  "Genre":"Fantasy",
  "item weight":"275g",
  "dimensions":"12.9 x 2.3 x 19.7 cm",
  "about the author":""
}


```

```json

{
  "_id": "ObjectId",
  "userId": "ObjectId('user_id_here')",
  "items": [
    {
      "productId": "ObjectId('artwork_or_book_id')",
      "type": "artwork",
      "quantity": 1
    }
  ],
  "totalPrice": 2500,
  "createdAt": "2025-10-09T10:30:00Z"
}



```

## wishlist collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId('user_id_here')",
  "items": [
    {
      "productId": "ObjectId('book_or_artwork_id')",
      "type": "book"
      "price":220,
      "mrp":300
    }
  ],
  "createdAt": "2025-10-09T10:30:00Z"
}


```

## order collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId('user_id_here')",
  "items": [
    {
      "productId": "ObjectId('book_or_artwork_id')",
      "type": "artwork",
      "quantity": 1,
      "price": 2500
    }
  ],
  "totalAmount": 2500,
  "paymentMethod": "UPI",
  "status": "Pending",
  "createdAt": "2025-10-09T10:30:00Z"
}


```