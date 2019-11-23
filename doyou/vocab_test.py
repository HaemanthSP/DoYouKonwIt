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
    return tokens


def build_dataset(data_dir, vocab_test_name):
    """
    """
    # answers = parse_answer_codes(answer_file)
    answers = defaultdict(list)
    vocab_test = []
    dir_content = sorted(list(os.listdir(data_dir)))
    for level in dir_content:
        level_name = re.sub("_", " ",  level)
        print(level_name)
        level_path = os.path.join(data_dir, level)

        testsets = []
        if not os.path.isdir(level_path):
            continue
        level_content = sorted(list(os.listdir(level_path)))
        for test_code in level_content:
            data_path = os.path.join(level_path, test_code)
            test_code = re.sub("_", " ", test_code)
            print(test_code)
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
