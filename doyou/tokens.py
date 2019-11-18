import spacy
import random
from tqdm import tqdm
from collections import Counter


def get_wordlist(book_path):
    """
    Return list of words in the chosen book
    """

    with open(book_path, 'rb') as book:
        text = book.read()

    nlp = spacy.load("en_core_web_sm")
    word_list = []
    for word in tqdm(nlp(str(text))):
        if word.pos_ in ['PUNCT', 'SYM', 'SPACE']:
            continue
        if word.pos_ in ['NOUN']:
            word_list.append(word.text.strip().lower())

    counts = Counter(word_list)
    print(len(counts.keys()))

    return random.choices(list(counts.keys()), k=100)
