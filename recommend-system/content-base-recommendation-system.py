from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Cấu hình CORS: Cho phép frontend tại http://localhost:5173 gọi endpoint /recommend
# Không ảnh hưởng đến server Collaborative Filtering (port 5001) vì đây là server riêng (port 5002)
CORS(app, resources={r"/recommend": {"origins": "http://localhost:5173"}})

client = MongoClient(
    "mongodb+srv://trankhanhhgvt:rwRKpbZCWCuot4pN@cluster0.ssefj.mongodb.net?retryWrites=true&w=majority"
)
db = client["test"]
products_collection = db["products"]

def log_sample_data(collection, collection_name, limit=5):
    if app.debug:
        sample_docs = list(collection.find().limit(limit))
        print(f"Sample documents from {collection_name}: {sample_docs}")
    return True

def load_data():
    log_sample_data(products_collection, "products")

    products = list(products_collection.find({}, {
        "_id": 1, "image": 1, "title": 1, "description": 1, "category": 1, "brand": 1, 
        "price": 1, "salePrice": 1, "totalStock": 1, "averageReview": 1
    }))
    products_df = pd.DataFrame(products) if products else pd.DataFrame(columns=["_id", "title", "description"])
    print(f"Total products loaded from database: {len(products_df)}")
    
    if not products_df.empty:
        products_df["_id"] = products_df["_id"].astype(str)
        products_df["content"] = products_df["title"].fillna("") + " " + \
                                products_df["description"].fillna("")

    if not products_df.empty:
        tfidf_vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = tfidf_vectorizer.fit_transform(products_df["content"])
        cosine_similarities = cosine_similarity(tfidf_matrix, tfidf_matrix)
    else:
        cosine_similarities = np.array([])

    return products_df, cosine_similarities

products_df, cosine_similarities = load_data()

def content_based_recommendation(product_id):
    if products_df.empty or cosine_similarities.size == 0:
        return []

    product_index = products_df[products_df["_id"] == product_id].index
    if len(product_index) == 0:
        print(f"Product ID {product_id} not found in database")
        return []

    product_index = product_index[0]

    similarities = cosine_similarities[product_index]
    similar_items = list(enumerate(similarities))
    similar_items = sorted(similar_items, key=lambda x: x[1], reverse=True)

    top_similar_items = []
    for idx, score in similar_items:
        if idx != product_index:
            top_similar_items.append((idx, score))
        if len(top_similar_items) >= 10:
            break

    recommended_indices = [x[0] for x in top_similar_items]
    recommended_products = products_df.iloc[recommended_indices][
        ["_id", "image", "title", "description", "category", "brand", "price", "salePrice", "totalStock", "averageReview"]
    ]

    score_dict = {products_df.iloc[idx]["_id"]: score for idx, score in top_similar_items}
    recommended_products["recommendation_score"] = recommended_products["_id"].map(score_dict)

    print(f"Recommended {len(recommended_products)} products for product ID {product_id}")
    return recommended_products.to_dict("records")

@app.route("/recommend", methods=["GET"])
def recommend():
    try:
        product_id = request.args.get("productId")
        if not product_id:
            return jsonify({"success": False, "message": "productId is required"}), 400

        recommended_products = content_based_recommendation(product_id)
        if not recommended_products:
            return jsonify({"success": False, "message": "No recommendations available or product not found"}), 404

        return jsonify({"success": True, "data": recommended_products})
    except Exception as e:
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)