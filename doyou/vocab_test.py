import re
import os
import pickle
from collections import defaultdict


def parse_vocab_test(text):
    """
    Parse the following structure into list of vocab tokens

    Input:
    ..
    ..
    ..

    Output:
    [result,
     hair,
     strong,
     tear,
     ..
     ..
     ..
    ]
    """
    text = re.sub(' ?\d+ \xef\x81\xb1 ', '\n', text)
    text = re.sub('\n\n', '\n', text).strip()
    tokens = text.split('\n')
    print(text)
    print(tokens)
    return tokens


def build_dataset(data_dir, vocab_test_name):
    """
    """
    # answers = parse_answer_codes(answer_file)
    answers = defaultdict(list)
    vocab_test = []
    for level_name in os.listdir(data_dir):
        level_path = os.path.join(data_dir, level_name)

        testsets = []
        if not os.path.isdir(level_path):
            continue
        for test_code in os.listdir(level_path):
            data_path = os.path.join(level_path, test_code)
            with open(data_path) as tf:
                text = tf.read()
            tokens = parse_vocab_test(text)
            testsets.append({
                "test_code": test_code,
                "tokens": tokens,
                "answers": answers[test_code]})
        vocab_test.append({'level': level_name, 'testsets': testsets})

    with open('data/vocab_tests/' + vocab_test_name + '.p', 'wb') as vocab_test_file:
        pickle.dump(vocab_test, vocab_test_file)


def parse_answer_codes(text):
    """
    """
    improper_words_idx = {}
    return improper_words_idx
