from typing import Optional, List, Dict, Any
import openai
from ..config import settings

class AIService:
    def __init__(self):
        self.openai_client = None
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
            self.openai_client = openai

    def rephrase_text(
        self,
        text: str,
        accessibility_need: str = None,
        reading_level: str = None,
        preferred_complexity: str = None,
        tagged_phrases: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Rephrase text using OpenAI API based on user preferences
        """
        if not self.openai_client:
            # Fallback: return mock response if API key not set
            return self._mock_rephrase(text)

        # Build the prompt
        prompt = self._build_prompt(
            text,
            accessibility_need,
            reading_level,
            preferred_complexity,
            tagged_phrases
        )

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an AI assistant helping users with accessibility needs to understand text better."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )

            rephrased_text = response.choices[0].message.content.strip()
            suggestions = self._extract_suggestions(text, rephrased_text, tagged_phrases)

            return {
                "rephrased_text": rephrased_text,
                "suggestions": suggestions
            }
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return self._mock_rephrase(text)

    def _build_prompt(
        self,
        text: str,
        accessibility_need: str,
        reading_level: str,
        preferred_complexity: str,
        tagged_phrases: List[Dict[str, str]]
    ) -> str:
        prompt_parts = []

        # Add user profile information
        if accessibility_need:
            prompt_parts.append(f"User has accessibility need: {accessibility_need}")
        if reading_level:
            prompt_parts.append(f"Reading level: {reading_level}")
        if preferred_complexity:
            prompt_parts.append(f"Preferred text complexity: {preferred_complexity}")

        # Add tagged phrases
        if tagged_phrases:
            unfamiliar = [p["phrase"] for p in tagged_phrases if p.get("level") == "not-familiar"]
            if unfamiliar:
                prompt_parts.append(f"Phrases the user is not familiar with: {', '.join(unfamiliar)}")

        prompt_parts.append(f"\nOriginal text:\n{text}")
        prompt_parts.append("\nPlease rephrase this text to be more accessible, considering:")
        prompt_parts.append("1. Replace or explain phrases the user is not familiar with")
        prompt_parts.append("2. Maintain the core meaning")
        prompt_parts.append("3. Adjust complexity to match user preferences")
        prompt_parts.append("4. Keep the text clear and concise")
        prompt_parts.append("\nReturn only the rephrased text without any additional commentary.")

        return "\n".join(prompt_parts)

    def _extract_suggestions(
        self,
        original: str,
        rephrased: str,
        tagged_phrases: List[Dict[str, str]]
    ) -> List[Dict[str, Any]]:
        """
        Extract alternative phrasings for tagged words/phrases
        """
        suggestions = []

        if not tagged_phrases:
            return suggestions

        for tagged in tagged_phrases:
            phrase = tagged.get("phrase", "")
            if phrase in original:
                # Find where the phrase appears in original
                start = original.find(phrase)
                end = start + len(phrase)

                # Generate alternatives (simplified - in production, could use AI)
                alternatives = [
                    f"simpler version of {phrase}",
                    f"easier way to say {phrase}",
                    f"another way: {phrase}"
                ]

                suggestions.append({
                    "phrase": phrase,
                    "alternatives": alternatives,
                    "position": {"start": start, "end": end}
                })

        return suggestions

    def _mock_rephrase(self, text: str) -> Dict[str, Any]:
        """
        Mock rephrasing when API is not available
        """
        rephrased = f"[Simplified] {text}"
        return {
            "rephrased_text": rephrased,
            "suggestions": []
        }

ai_service = AIService()
