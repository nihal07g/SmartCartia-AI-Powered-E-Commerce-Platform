import json
import random
from datetime import datetime

class ProductRecommender:
    def __init__(self, products_data=None):
        """
        Initialize the product recommender with product data.
        """
        self.products = products_data or []
        self.questions = [
            {
                "id": "category",
                "text": "What type of product are you looking for?",
                "options": ["Electronics", "Clothing", "Home Goods", "Books", "Any"]
            },
            {
                "id": "price_range",
                "text": "What's your budget?",
                "options": ["Under $50", "$50-$100", "$100-$500", "Over $500", "No budget limit"]
            },
            {
                "id": "feature_priority",
                "text": "What's most important to you?",
                "options": ["Quality", "Price", "Brand", "Features", "Reviews"]
            },
            {
                "id": "usage",
                "text": "How will you primarily use this product?",
                "options": ["Personal", "Professional", "Gift", "Occasional use", "Daily use"]
            }
        ]
        
    def get_questions(self):
        """
        Return the list of questions for the product finder.
        """
        return self.questions
    
    def recommend_products(self, answers):
        """
        Recommend products based on user answers.
        In a real implementation, this would use more sophisticated matching.
        """
        # Filter products based on answers
        filtered_products = self.products.copy()
        
        # Filter by category if specified
        if answers.get("category") and answers["category"] != "Any":
            filtered_products = [p for p in filtered_products if p["category"] == answers["category"]]
        
        # Filter by price range
        if answers.get("price_range"):
            price_range = answers["price_range"]
            if price_range == "Under $50":
                filtered_products = [p for p in filtered_products if p["price"] < 50]
            elif price_range == "$50-$100":
                filtered_products = [p for p in filtered_products if 50 <= p["price"] <= 100]
            elif price_range == "$100-$500":
                filtered_products = [p for p in filtered_products if 100 <= p["price"] <= 500]
            elif price_range == "Over $500":
                filtered_products = [p for p in filtered_products if p["price"] > 500]
        
        # Sort based on feature priority
        if answers.get("feature_priority"):
            priority = answers["feature_priority"]
            if priority == "Quality":
                filtered_products.sort(key=lambda p: p.get("rating", 0), reverse=True)
            elif priority == "Price":
                filtered_products.sort(key=lambda p: p["price"])
            elif priority == "Reviews":
                filtered_products.sort(key=lambda p: p.get("reviews", 0), reverse=True)
            elif priority == "Brand":
                # In a real implementation, you might have brand reputation scores
                pass
            elif priority == "Features":
                # In a real implementation, you might have feature richness scores
                pass
        
        # Consider usage in a real implementation
        # This is a simplified example
        
        # Return top recommendations (up to 5)
        return filtered_products[:5] if filtered_products else []

# Example usage
if __name__ == "__main__":
    # Sample product data
    sample_products = [
        {
            "id": "1",
            "name": "Premium Wireless Headphones",
            "category": "Electronics",
            "price": 199.99,
            "rating": 4.8,
            "reviews": 120
        },
        {
            "id": "2",
            "name": "Smart Fitness Watch",
            "category": "Electronics",
            "price": 149.99,
            "rating": 4.5,
            "reviews": 85
        },
        {
            "id": "3",
            "name": "Casual Cotton T-Shirt",
            "category": "Clothing",
            "price": 24.99,
            "rating": 4.3,
            "reviews": 210
        }
    ]
    
    recommender = ProductRecommender(sample_products)
    
    # Get questions
    questions = recommender.get_questions()
    print("Product Finder Questions:")
    for q in questions:
        print(f"- {q['text']}")
        print(f"  Options: {', '.join(q['options'])}")
    
    # Sample answers
    sample_answers = {
        "category": "Electronics",
        "price_range": "$100-$500",
        "feature_priority": "Quality",
        "usage": "Personal"
    }
    
    # Get recommendations
    recommendations = recommender.recommend_products(sample_answers)
    print("\nRecommended Products:")
    for product in recommendations:
        print(f"- {product['name']} (${product['price']}) - {product['rating']} stars")
