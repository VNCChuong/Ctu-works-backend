import spacy
import sys
import json
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

nlp = spacy.load("en_core_web_sm")

def extract_keywords(text):
    doc = nlp(text)
    keywords = [token.lemma_.lower() for token in doc if not token.is_stop and not token.is_punct]
    return keywords

def calculate_similarity(keywords1, keywords2):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([' '.join(keywords1), ' '.join(keywords2)])
    return cosine_similarity(vectors)[0, 1]

if __name__ == "__main__":
    input_text = sys.argv[1]
    keywords = json.loads(sys.argv[2]) 
    user_keywords = extract_keywords(input_text)
    similarity = calculate_similarity(user_keywords, keywords)
    print(json.dumps(similarity))