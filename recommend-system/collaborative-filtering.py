from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import random

app = Flask(__name__)

CORS(app, resources={r"/recommend": {"origins": "http://localhost:5173"}})

client = MongoClient(
    "mongodb+srv://trankhanhhgvt:rwRKpbZCWCuot4pN@cluster0.ssefj.mongodb.net?retryWrites=true&w=majority"
)
db = client["test"]
reviews_collection = db["productreviews"]
products_collection = db["products"]
users_collection = db["users"]
orders_collection = db["orders"]

def log_sample_data(collection, collection_name, limit=5):
    if app.debug:
        sample_docs = list(collection.find().limit(limit))
        print(f"Sample documents from {collection_name}: {sample_docs}")
    return True

def load_data():
    # Log dữ liệu mẫu
    for collection, name in [
        (reviews_collection, "productreviews"),
        (products_collection, "products"),
        (users_collection, "users"),
        (orders_collection, "orders"),
    ]:
        log_sample_data(collection, name)

    # Chỉ lấy các trường cần thiết từ reviews
    reviews = list(reviews_collection.find({}, {"userId": 1, "productId": 1, "reviewValue": 1, "userName": 1, "_id": 0}))
    reviews_df = pd.DataFrame(reviews) if reviews else pd.DataFrame(columns=["userId", "productId", "reviewValue", "userName"])

    # Map userName với userId
    users = list(users_collection.find({}, {"userName": 1, "_id": 1}))
    users_dict = {user["userName"]: str(user["_id"]) for user in users}
    if not reviews_df.empty:
        reviews_df["userId"] = reviews_df["userName"].map(users_dict)
        reviews_df = reviews_df.dropna(subset=["userId"])
        reviews_df["productId"] = reviews_df["productId"].astype(str)
        reviews_df["userId"] = reviews_df["userId"].astype(str)
        reviews_df["reviewValue"] = pd.to_numeric(reviews_df["reviewValue"], errors="coerce")
        reviews_df.drop(columns=["userName"], inplace=True)  # Xóa cột không cần thiết

    # Chỉ lấy các trường cần thiết từ products
    products = list(products_collection.find({}, {
        "_id": 1, "image": 1, "title": 1, "description": 1, "category": 1, "brand": 1, 
        "price": 1, "salePrice": 1, "totalStock": 1, "averageReview": 1
    }))
    products_df = pd.DataFrame(products) if products else pd.DataFrame(columns=["_id", "title", "price"])
    print(f"Total products loaded from database: {len(products_df)}")
    if not products_df.empty:
        products_df["_id"] = products_df["_id"].astype(str)

    # Chỉ lấy userId từ orders
    orders = list(orders_collection.find({}, {"userId": 1, "_id": 0}))
    orders_df = pd.DataFrame(orders) if orders else pd.DataFrame(columns=["userId"])
    if not orders_df.empty:
        orders_df["userId"] = orders_df["userId"].astype(str)

    return reviews_df, products_df, orders_df

def collaborative_filtering(reviews_df, products_df, orders_df, target_user_id):
    if products_df.empty:
        return []

    # Bước 1: Kiểm tra nếu người dùng chưa có review (bao gồm người mới và người đã mua nhưng chưa review)
    if reviews_df.empty or target_user_id not in reviews_df["userId"].values:
        # Trả về tất cả sản phẩm, sắp xếp ngẫu nhiên, không có recommendation_score
        all_products = products_df[
            ["_id", "image", "title", "description", "category", "brand", "price", "salePrice", "totalStock", "averageReview"]
        ]
        all_products = all_products.drop_duplicates(subset=["_id"])
        # Sử dụng random.shuffle để xáo trộn nhanh hơn thay vì DataFrame.sample
        product_list = all_products.to_dict("records")
        random.shuffle(product_list)
        print(f"User has no reviews (new or purchased but not reviewed), recommending all {len(product_list)} products randomly")
        return product_list

    # Bước 2: Người dùng đã mua và đã review, sử dụng collaborative filtering
    # Tạo ma trận thưa (sparse matrix) thay vì pivot_table
    user_ids = reviews_df["userId"].unique()
    product_ids = reviews_df["productId"].unique()
    user_id_map = {uid: idx for idx, uid in enumerate(user_ids)}
    product_id_map = {pid: idx for idx, pid in enumerate(product_ids)}

    rows, cols, data = [], [], []
    for _, row in reviews_df.iterrows():
        rows.append(user_id_map[row["userId"]])
        cols.append(product_id_map[row["productId"]])
        data.append(float(row["reviewValue"]))
    
    user_item_matrix = sparse.csr_matrix((data, (rows, cols)), shape=(len(user_ids), len(product_ids)))

    # Tính cosine similarity trên ma trận thưa
    user_similarity = cosine_similarity(user_item_matrix, dense_output=False)
    target_user_index = user_id_map[target_user_id]
    user_similarities = user_similarity[target_user_index].toarray().flatten()
    similar_user_indices = np.argsort(user_similarities)[::-1][1:]  # Bỏ chính user target

    # Tính điểm gợi ý
    product_scores = np.zeros(len(product_ids))
    target_user_ratings = user_item_matrix[target_user_index].toarray().flatten()
    for user_index in similar_user_indices[:50]:  # Giới hạn số user tương đồng để tăng tốc
        similarity_score = user_similarities[user_index]
        if similarity_score <= 0:
            continue
        rated_by_similar_user = user_item_matrix[user_index].toarray().flatten()
        not_rated_by_target_user = (rated_by_similar_user > 0) & (target_user_ratings == 0)
        recommended_product_indices = np.where(not_rated_by_target_user)[0]
        for product_index in recommended_product_indices:
            rating = rated_by_similar_user[product_index]
            product_scores[product_index] += similarity_score * rating

    # Sắp xếp sản phẩm theo điểm số
    recommend_items = [{"productId": product_ids[idx], "score": score} 
                       for idx, score in enumerate(product_scores) if score > 0]
    recommend_items = sorted(recommend_items, key=lambda x: x["score"], reverse=True)
    print(f"Total recommended items with reviews: {len(recommend_items)}")

    recommend_product_ids = [item["productId"] for item in recommend_items]

    # Lấy sản phẩm đã được gợi ý từ collaborative filtering
    rated_products = products_df[products_df["_id"].isin(recommend_product_ids)][
        ["_id", "image", "title", "description", "category", "brand", "price", "salePrice", "totalStock", "averageReview"]
    ].drop_duplicates(subset=["_id"])

    if not rated_products.empty:
        rated_products = rated_products.set_index("_id").loc[recommend_product_ids].reset_index()
        score_dict = {item["productId"]: item["score"] for item in recommend_items}
        rated_products["recommendation_score"] = rated_products["_id"].map(score_dict)
    else:
        rated_products = pd.DataFrame()

    # Lấy danh sách sản phẩm chưa có ai mua
    reviewed_product_ids = set(reviews_df["productId"].unique())
    unrated_products = products_df[~products_df["_id"].isin(reviewed_product_ids)][
        ["_id", "image", "title", "description", "category", "brand", "price", "salePrice", "totalStock", "averageReview"]
    ].drop_duplicates(subset=["_id"])

    if not unrated_products.empty:
        unrated_products = unrated_products.sort_values(by="totalStock", ascending=False)
        unrated_products["recommendation_score"] = 0
    print(f"Total unrated products: {len(unrated_products)}")

    # Kết hợp danh sách
    if rated_products.empty:
        final_recommended = unrated_products
    elif unrated_products.empty:
        final_recommended = rated_products
    else:
        final_recommended = pd.concat([rated_products, unrated_products], ignore_index=True)

    print(f"Final recommended products: {len(final_recommended)} items")
    return final_recommended.to_dict("records")

@app.route("/recommend", methods=["GET"])
def recommend():
    try:
        user_id = request.args.get("userId")
        if not user_id:
            return jsonify({"success": False, "message": "userId is required"}), 400

        reviews_df, products_df, orders_df = load_data()
        if products_df.empty:
            return jsonify({"success": True, "data": [], "message": "No products available"}), 200

        recommended_products = collaborative_filtering(reviews_df, products_df, orders_df, user_id)
        return jsonify({"success": True, "data": recommended_products})
    except Exception as e:
        return jsonify({"success": False, "message": f"Internal server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)