import json
import re
import random
from datetime import datetime

# In a real implementation, this would use the Grok API
# Since you mentioned you've already connected it, this is a placeholder
# that simulates the emotion analysis functionality

class ReviewEmotionAnalyzer:
    def __init__(self, api_key=None):
        self.api_key = api_key
        self.emotions = ["happy", "satisfied", "neutral", "disappointed", "angry"]
        self.emoji_map = {
            "happy": "😊",
            "satisfied": "😌",
            "neutral": "😐",
            "disappointed": "😔",
            "angry": "😠"
        }
        
    def analyze_review(self, review_text):
        """
        Analyze the emotion in a review text.
        In a real implementation, this would call the Grok API.
        """
        # Simulate API call with some basic rules
        text = review_text.lower()
        
        # Simple keyword matching for demonstration
        if any(word in text for word in ["amazing", "excellent", "love", "perfect", "great"]):
            emotion = "happy"
            score = random.uniform(0.8, 1.0)
        elif any(word in text for word in ["good", "nice", "satisfied", "pleased"]):
            emotion = "satisfied"
            score = random.uniform(0.6, 0.8)
        elif any(word in text for word in ["okay", "fine", "average", "decent"]):
            emotion = "neutral"
            score = random.uniform(0.4, 0.6)
        elif any(word in text for word in ["disappointed", "expected more", "not great"]):
            emotion = "disappointed"
            score = random.uniform(0.2, 0.4)
        elif any(word in text for word in ["terrible", "awful", "hate", "worst"]):
            emotion = "angry"
            score = random.uniform(0.0, 0.2)
        else:
            # Default to neutral if no keywords match
            emotion = "neutral"
            score = random.uniform(0.4, 0.6)
            
        return {
            "emotion": emotion,
            "emoji": self.emoji_map[emotion],
            "score": score,
            "timestamp": datetime.now().isoformat()
        }
    
    def batch_analyze_reviews(self, reviews):
        """
        Analyze emotions for a batch of reviews.
        """
        results = []
        for review in reviews:
            analysis = self.analyze_review(review["content"])
            results.append({
                "review_id": review.get("id"),
                "analysis": analysis
            })
        return results
    
    def get_emotion_summary(self, reviews):
        """
        Generate a summary of emotions across all reviews.
        """
        if not reviews:
            return {}
            
        analyses = [self.analyze_review(review["content"]) for review in reviews]
        emotion_counts = {emotion: 0 for emotion in self.emotions}
        
        for analysis in analyses:
            emotion_counts[analysis["emotion"]] += 1
            
        total = len(analyses)
        summary = {
            "total_reviews": total,
            "emotion_distribution": {
                emotion: {
                    "count": count,
                    "percentage": (count / total) * 100 if total > 0 else 0
                } for emotion, count in emotion_counts.items()
            },
            "dominant_emotion": max(emotion_counts, key=emotion_counts.get),
            "timestamp": datetime.now().isoformat()
        }
        
        return summary

# Example usage
if __name__ == "__main__":
    analyzer = ReviewEmotionAnalyzer()
    
    sample_review = "I absolutely love this product! It exceeded all my expectations."
    result = analyzer.analyze_review(sample_review)
    print(f"Review: {sample_review}")
    print(f"Emotion: {result['emotion']} {result['emoji']}")
    print(f"Score: {result['score']:.2f}")
