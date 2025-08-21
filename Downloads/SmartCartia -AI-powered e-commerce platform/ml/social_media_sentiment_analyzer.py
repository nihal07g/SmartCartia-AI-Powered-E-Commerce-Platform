import json
import random
from datetime import datetime
import re

# In a real implementation, this would use the Grok API
# Since you mentioned you've already connected it, this is a placeholder
# that simulates the social media sentiment analysis functionality

class SocialMediaSentimentAnalyzer:
    def __init__(self, api_key=None):
        self.api_key = api_key
        self.platforms = ["twitter", "instagram", "facebook", "reddit", "tiktok"]
        self.sentiment_levels = ["very_positive", "positive", "neutral", "negative", "very_negative"]
        self.emoji_map = {
            "very_positive": "😍",
            "positive": "😊",
            "neutral": "😐",
            "negative": "😕",
            "very_negative": "😡"
        }
        
    def analyze_post(self, post_text, platform="twitter"):
        """
        Analyze the sentiment in a social media post.
        In a real implementation, this would call the Grok API.
        """
        # Simulate API call with some basic rules
        text = post_text.lower()
        
        # Simple keyword matching for demonstration
        if any(word in text for word in ["amazing", "excellent", "love", "perfect", "great"]):
            sentiment = "very_positive"
            score = random.uniform(0.8, 1.0)
        elif any(word in text for word in ["good", "nice", "like", "happy"]):
            sentiment = "positive"
            score = random.uniform(0.6, 0.8)
        elif any(word in text for word in ["okay", "fine", "average", "decent"]):
            sentiment = "neutral"
            score = random.uniform(0.4, 0.6)
        elif any(word in text for word in ["disappointed", "not good", "dislike"]):
            sentiment = "negative"
            score = random.uniform(0.2, 0.4)
        elif any(word in text for word in ["terrible", "awful", "hate", "worst"]):
            sentiment = "very_negative"
            score = random.uniform(0.0, 0.2)
        else:
            # Default to neutral if no keywords match
            sentiment = "neutral"
            score = random.uniform(0.4, 0.6)
            
        return {
            "sentiment": sentiment,
            "emoji": self.emoji_map[sentiment],
            "score": score,
            "platform": platform,
            "timestamp": datetime.now().isoformat()
        }
    
    def analyze_product_mentions(self, product_name, count=50):
        """
        Simulate analyzing mentions of a product across social media.
        In a real implementation, this would search for and analyze real posts.
        """
        # Generate simulated social media posts about the product
        sample_templates = [
            "Just bought the {product} and I {sentiment} it!",
            "Has anyone tried {product}? I'm thinking of getting one.",
            "{product} is {adjective}! {emoji}",
            "My experience with {product}: {sentiment_phrase}",
            "Don't waste your money on {product}. {negative_reason}",
            "{product} vs the competition - {comparison}",
            "Using {product} for a week now. {experience}",
            "Is it just me or is {product} {quality}?",
            "The new {product} update is {update_quality}",
            "{product} customer service is {service_quality}"
        ]
        
        positive_phrases = ["love it", "highly recommend", "best purchase ever", "worth every penny"]
        negative_phrases = ["disappointed", "not worth the price", "had issues with it", "returning it"]
        neutral_phrases = ["it's okay", "does the job", "nothing special", "mixed feelings"]
        
        positive_adjectives = ["amazing", "excellent", "fantastic", "incredible"]
        negative_adjectives = ["terrible", "awful", "disappointing", "overrated"]
        neutral_adjectives = ["decent", "okay", "standard", "acceptable"]
        
        positive_emojis = ["😍", "👍", "🙌", "💯"]
        negative_emojis = ["👎", "😠", "🙄", "💔"]
        neutral_emojis = ["🤔", "😐", "🧐", "⚖️"]
        
        simulated_posts = []
        
        for i in range(count):
            template = random.choice(sample_templates)
            platform = random.choice(self.platforms)
            
            # Randomly determine sentiment for this post
            sentiment_category = random.choice(["positive", "neutral", "negative"])
            
            if sentiment_category == "positive":
                sentiment = random.choice(["love", "really like", "am impressed by", "recommend"])
                adjective = random.choice(positive_adjectives)
                sentiment_phrase = random.choice(positive_phrases)
                emoji = random.choice(positive_emojis)
                comparison = random.choice(["much better", "superior", "the clear winner"])
                experience = random.choice(["loving it so far", "very satisfied", "exceeded expectations"])
                quality = random.choice(["really good", "excellent", "a game changer"])
                update_quality = random.choice(["fantastic", "a great improvement", "very useful"])
                service_quality = random.choice(["excellent", "very helpful", "responsive"])
            elif sentiment_category == "negative":
                sentiment = random.choice(["dislike", "am disappointed by", "regret buying", "don't recommend"])
                adjective = random.choice(negative_adjectives)
                sentiment_phrase = random.choice(negative_phrases)
                emoji = random.choice(negative_emojis)
                negative_reason = random.choice(["It broke quickly", "Poor quality", "Not as advertised", "Too expensive for what it is"])
                comparison = random.choice(["worse than", "inferior to", "not as good as"])
                experience = random.choice(["having issues", "not impressed", "disappointed"])
                quality = random.choice(["overrated", "not worth it", "a letdown"])
                update_quality = random.choice(["buggy", "a step backward", "problematic"])
                service_quality = random.choice(["terrible", "unhelpful", "slow to respond"])
            else:
                sentiment = random.choice(["think it's okay", "have mixed feelings about", "am neutral about"])
                adjective = random.choice(neutral_adjectives)
                sentiment_phrase = random.choice(neutral_phrases)
                emoji = random.choice(neutral_emojis)
                comparison = random.choice(["about the same as", "similar to", "neither better nor worse than"])
                experience = random.choice(["it's fine", "does what it's supposed to", "no strong feelings"])
                quality = random.choice(["just okay", "average", "what you'd expect"])
                update_quality = random.choice(["fine", "has pros and cons", "nothing special"])
                service_quality = random.choice(["average", "okay", "could be better"])
            
            # Fill in the template
            post_text = template.format(
                product=product_name,
                sentiment=sentiment,
                adjective=adjective,
                emoji=emoji,
                sentiment_phrase=sentiment_phrase,
                negative_reason=locals().get('negative_reason', ''),
                comparison=comparison,
                experience=experience,
                quality=quality,
                update_quality=update_quality,
                service_quality=service_quality
            )
            
            # Create a simulated post
            post = {
                "id": f"post_{i}",
                "platform": platform,
                "text": post_text,
                "timestamp": (datetime.now().timestamp() - random.randint(0, 30*24*60*60)),  # Random time in the last 30 days
                "likes": random.randint(0, 1000),
                "shares": random.randint(0, 200) if platform != "instagram" else None,
                "comments": random.randint(0, 100)
            }
            
            simulated_posts.append(post)
        
        # Sort by timestamp (newest first)
        simulated_posts.sort(key=lambda x: x["timestamp"], reverse=True)
        
        # Analyze each post
        analyzed_posts = []
        for post in simulated_posts:
            analysis = self.analyze_post(post["text"], post["platform"])
            post["analysis"] = analysis
            analyzed_posts.append(post)
            
        # Generate summary statistics
        sentiment_counts = {sentiment: 0 for sentiment in self.sentiment_levels}
        platform_counts = {platform: 0 for platform in self.platforms}
        
        for post in analyzed_posts:
            sentiment_counts[post["analysis"]["sentiment"]] += 1
            platform_counts[post["platform"]] += 1
            
        total_posts = len(analyzed_posts)
        
        summary = {
            "product": product_name,
            "total_mentions": total_posts,
            "sentiment_distribution": {
                sentiment: {
                    "count": count,
                    "percentage": (count / total_posts) * 100 if total_posts > 0 else 0
                } for sentiment, count in sentiment_counts.items()
            },
            "platform_distribution": {
                platform: {
                    "count": count,
                    "percentage": (count / total_posts) * 100 if total_posts > 0 else 0
                } for platform, count in platform_counts.items()
            },
            "overall_sentiment": max(sentiment_counts, key=sentiment_counts.get),
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "posts": analyzed_posts,
            "summary": summary
        }

# Example usage
if __name__ == "__main__":
    analyzer = SocialMediaSentimentAnalyzer()
    
    sample_post = "Just got the new headphones and they sound amazing! Best purchase this year! #happy"
    result = analyzer.analyze_post(sample_post, "twitter")
    print(f"Post: {sample_post}")
    print(f"Sentiment: {result['sentiment']} {result['emoji']}")
    print(f"Score: {result['score']:.2f}")
    
    # Example of product mention analysis
    product_analysis = analyzer.analyze_product_mentions("Wireless Headphones")
    print(f"\nAnalyzed {product_analysis['summary']['total_mentions']} mentions of Wireless Headphones")
    print(f"Overall sentiment: {product_analysis['summary']['overall_sentiment']}")
