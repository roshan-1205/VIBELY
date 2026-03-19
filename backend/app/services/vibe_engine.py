"""
Vibe Engine - AI-powered sentiment analysis service
Core innovation for Vibely platform
"""

import asyncio
import time
from typing import Dict, Any, Optional
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from loguru import logger

from app.core.config import settings
from app.schemas.post import VibeAnalysis


class VibeEngineService:
    """
    AI-powered sentiment analysis engine
    Processes text content to generate sentiment scores and labels
    """
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.classifier = None
        self._model_loaded = False
    
    async def initialize(self) -> None:
        """Initialize the sentiment analysis model"""
        if self._model_loaded:
            return
        
        try:
            logger.info("Loading sentiment analysis model...")
            
            # Load model in a thread to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self._load_model)
            
            self._model_loaded = True
            logger.info("Sentiment analysis model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load sentiment model: {e}")
            raise
    
    def _load_model(self) -> None:
        """Load the HuggingFace model (runs in thread)"""
        model_name = settings.HUGGINGFACE_MODEL
        
        # Load tokenizer and model
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        
        # Create pipeline
        self.classifier = pipeline(
            "sentiment-analysis",
            model=self.model,
            tokenizer=self.tokenizer,
            device=0 if torch.cuda.is_available() else -1,
            return_all_scores=True
        )
    
    async def analyze_sentiment(self, text: str) -> VibeAnalysis:
        """
        Analyze sentiment of text content
        Returns sentiment score, label, and confidence
        """
        if not self._model_loaded:
            await self.initialize()
        
        start_time = time.time()
        
        try:
            # Run analysis in thread to avoid blocking
            loop = asyncio.get_event_loop()
            results = await loop.run_in_executor(
                None, 
                self._analyze_text, 
                text
            )
            
            processing_time = time.time() - start_time
            
            # Process results
            sentiment_data = self._process_results(results)
            
            return VibeAnalysis(
                sentiment_score=sentiment_data["score"],
                sentiment_label=sentiment_data["label"],
                confidence=sentiment_data["confidence"],
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Sentiment analysis failed: {e}")
            # Return neutral sentiment as fallback
            return VibeAnalysis(
                sentiment_score=0.5,
                sentiment_label="neutral",
                confidence=0.0,
                processing_time=time.time() - start_time
            )
    
    def _analyze_text(self, text: str) -> list:
        """Run sentiment analysis (executed in thread)"""
        # Truncate text if too long
        max_length = 512
        if len(text) > max_length:
            text = text[:max_length]
        
        return self.classifier(text)
    
    def _process_results(self, results: list) -> Dict[str, Any]:
        """Process HuggingFace results into standardized format"""
        if not results or not results[0]:
            return {
                "score": 0.5,
                "label": "neutral",
                "confidence": 0.0
            }
        
        # Get all scores
        scores = results[0]
        
        # Find the highest confidence prediction
        best_prediction = max(scores, key=lambda x: x["score"])
        
        # Map labels to standardized format
        label_mapping = {
            "POSITIVE": "positive",
            "NEGATIVE": "negative", 
            "NEUTRAL": "neutral",
            "LABEL_0": "negative",  # Some models use numeric labels
            "LABEL_1": "neutral",
            "LABEL_2": "positive"
        }
        
        raw_label = best_prediction["label"].upper()
        mapped_label = label_mapping.get(raw_label, "neutral")
        
        # Convert to 0-1 scale (0 = negative, 0.5 = neutral, 1 = positive)
        score_mapping = {
            "negative": 0.0,
            "neutral": 0.5,
            "positive": 1.0
        }
        
        # For more nuanced scoring, use the confidence
        base_score = score_mapping[mapped_label]
        confidence = best_prediction["score"]
        
        # Adjust score based on confidence
        if mapped_label == "positive":
            final_score = 0.5 + (confidence * 0.5)
        elif mapped_label == "negative":
            final_score = 0.5 - (confidence * 0.5)
        else:
            final_score = 0.5
        
        return {
            "score": round(final_score, 3),
            "label": mapped_label,
            "confidence": round(confidence, 3)
        }
    
    async def batch_analyze(self, texts: list[str]) -> list[VibeAnalysis]:
        """Analyze multiple texts in batch for efficiency"""
        if not self._model_loaded:
            await self.initialize()
        
        results = []
        
        # Process in batches to avoid memory issues
        batch_size = 10
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            
            # Analyze batch
            batch_results = await asyncio.gather(*[
                self.analyze_sentiment(text) for text in batch
            ])
            
            results.extend(batch_results)
        
        return results
    
    def get_vibe_category(self, sentiment_score: float) -> str:
        """Categorize sentiment score into vibe categories"""
        if sentiment_score >= 0.7:
            return "highly_positive"
        elif sentiment_score >= 0.6:
            return "positive"
        elif sentiment_score >= 0.4:
            return "neutral"
        elif sentiment_score >= 0.3:
            return "negative"
        else:
            return "highly_negative"


# Global vibe engine instance
vibe_engine = VibeEngineService()