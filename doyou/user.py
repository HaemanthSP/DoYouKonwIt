import os
import csv
import pickle
import datetime
import numpy as np

from bson import ObjectId
from pymongo import MongoClient
from zipfile import ZipFile

# Setup db handle
DB = MongoClient('mongodb://127.0.0.1:27017/')["prototype"]

# TODO: Add methods for initial setup like creating admin, indexer and experiments
# TODO: A verification routine for admin

class Name:
    def __init__(self, first_name, middle_name, last_name, salutation=""):
        self.fname = first_name.lower().strip().capitalize()
        self.mname = middle_name.lower().strip().capitalize()
        self.lname = last_name.lower().strip().capitalize()
        self.salutation = salutation

    def greet(self):
        return self.fname

    def __str__(self):
        return ' '.join([self.fname, self.mname, self.lname])

    @property
    def fullname(self):
        return ', '.join([self.lname, self.fname])


class Password:
    def __init__(self, password):
        self.password = password

    def __eq__(self, other):
        if isinstance(other, Password):
            return self.password == other.password
        elif type(other) == str:
            return self.password == other

    def encrypt(self, password):
        raise NotImplementedError


class User:
    def __init__(self, name, password):
        self.name = name
        self.password = password
        self.uid = str(DB.users.insert_one({}).inserted_id)
        self.update_index()

    @staticmethod
    def load(uid):
        print("Fetching user of id %s" % (uid))
        user_entry = DB.users.find_one({'_id': ObjectId(uid)})
        user = pickle.loads(user_entry['binary'])
        return user

    @staticmethod
    def get_index():
        index_entry = DB.index.find_one({'_id': ObjectId("5e2b14f5ab748c8d228e4abd")})
        index = index_entry['mapping']
        if not index:
            index = {}
            print("No index found")
        return index

    @staticmethod
    def get_user_list():
        index = User.get_index()
        user_list = []
        for _, uid in index.items():
            usr = User.load(uid)
            if usr.role == 'Admin':
                continue
            user_list.append({'name': usr.name.fullname, 'role': usr.role, 'id': uid})

        user_list = sorted(user_list, key=lambda x: x['name'])
        return user_list

    @staticmethod
    def remove_user(uid):
        index = User.get_index()

        # Disable this for safety 
        # ack = DB.users.delete_one({'_id': ObjectId(uid)})
        # if ack.deleted_count != 1:
            # print("Warning: no matching entries found to save the INDEX")

        usr_name = ''
        for name, _id in index.items():
            if _id == uid:
                usr_name = name
                break
        if usr_name:
            index.pop(usr_name)
        else:
            return 1

        ack = DB.index.update_one({'_id': ObjectId("5e2b14f5ab748c8d228e4abd")}, {"$set": {"mapping": index}})
        if ack.matched_count != 1:
            print("Warning: no matching entries found to save the INDEX")

        return 0

    def update_index(self):
        index = User.get_index()
        index.update({str(self.name): self.uid})
        ack = DB.index.update_one({'_id': ObjectId("5e2b14f5ab748c8d228e4abd")}, {"$set": {"mapping": index}})
        if ack.matched_count != 1:
            print("Warning: no matching entries found to save the INDEX")

    def save(self):
        user = pickle.dumps(self)
        ack = DB.users.update_one({'_id': ObjectId(self.uid)}, {"$set": {"binary": user}})
        if ack.matched_count != 1:
            print("Warning: no matching entries found to save the USER")
            

class Student(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Student'
        self.experiments = []
        self.active_exp = None
        self.save()

    def take_test(self):
        """
        """
        if not self.active_exp:
            self.active_exp = TestHandle(self)
        return self.active_exp

    def close_exp(self, exp_id):
        """
        """
        if self.active_exp.id == exp_id:
            self.experiments.append(self.active_exp)
            self.active_exp = None


class TestHandle:
    def __init__(self, student):
        self.student = student
        self.load_tests()
        self.logs = []

    def load_tests(self):
        exp = Experiment.load()
        self.id = exp.active_id
        self.tests = exp.experiments[self.id]["tests"]
        self.active_index = 0
        self.active_test = self.tests[self.active_index]

    def update_response(self, test_code, responses):
        assert self.active_test['test_code'] == test_code
        timestamp = datetime.datetime.now().timestamp()
        self.active_test["responses"] = responses
        self.logs.append({"time": timestamp,
                          "test_code": self.active_test['test_code'],
                          "response": responses})

    def evaluate(self, test_code):
        assert self.active_test['test_code'] == test_code
        assert len(self.active_test["responses"]) == len(self.active_test['tokens'])
        false_hits, hits = 0, 0
        evaluated_responses = list(self.active_test['responses'])
        for idx, response in enumerate(self.active_test["responses"], 1):
            if response == 'yes':
                if idx in self.active_test['improper_Ids']:
                    false_hits += 1
                    evaluated_responses[idx-1] = "wrong"
                else:
                    hits += 1
            else:
                if idx not in self.active_test['improper_Ids']:
                    evaluated_responses[idx-1] = "unknown"
        self.active_test["evaluated_responses"] = evaluated_responses
        
        # Compute the score based on the paul meara evaluation table
        score = int(np.round(max(0, (hits * 2.5 - false_hits * 2.5))))
        print("%s Hits, and %s false hits" % (hits, false_hits))
        guess = false_hits >= 10
        message = ''
        if guess:
            message = 'Please do not guess'
            score = 0
        elif hits < 10:
            message = 'Its ok, these are difficult words'
            score = 0
        else:
            if score < 30:
                message = 'Its ok, these are difficult words'
            elif score > 90:
                message = 'Great !!!'
            elif score > 70:
                message = 'Good job !!'
            else:
                if false_hits >= 8:
                    message = "Please don't guess"
                else:
                    message = 'Well done'

        result = {"message": message, "hits": hits, "false_hits": false_hits, "score": score}
        self.active_test["result"] = result
        self.move_on()
        return result

    def move_on(self):
        self.tests[self.active_index] = self.active_test
        self.active_index += 1
        if self.active_index < len(self.tests):
            print("Moving on to Next test")
            self.active_test = self.tests[self.active_index]
        else:
            print("Finished all tests")
            self.student.close_exp(self.id)
            self.close()
            self.active_test = None

    def close(self):
        """
        """
        results = []
        for test in self.tests:
            results.append({
                "test_code": test['test_code'],
                "evaluated_responses": test['evaluated_responses'],
                "metrics": test["result"]})

        # Store it in the respective experiment
        exp = Experiment.load()
        exp.experiments[self.id]["results"].update({self.student.uid: results})
        exp.save()


class Teacher(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Teacher'
        self.name = name
        self.password = password
        self.students = set()
        self.save()

    def add_student(self, uid):
        self.students.add(uid)
        self.save()

    def remove_student(self, uid):
        self.students.remove(uid)
        self.save()


class Admin(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Admin'
        self.name = name
        self.password = password
        self.save()

    def get_user(self, name):
        user_index = User.get_index()
        uid = user_index.get(str(name), None)
        print("Loading user of id %s" % (uid))
        if uid:
            return User.load(uid)
        else:
            return None

    def add_user(self, name, password, role):
        # FIXME: It just overwrites the existing user.
        user_type = {'student': Student, 'teacher': Teacher}
        return user_type[role](name, password)

    def remove_user(self, uid):
        return User.remove_user(uid)

    def validate_user(self, name, password):
        user = self.get_user(name)
        if user:
            print("Password not matching")
            return user.password == password
        else:
            print("No user found of name %s" % (name))
            return False

    def update_experiment(self, name, definition):
        print("Updating Exp: %s" % (definition))
        experiments = Experiment.load()
        experiments.add_experiment(name, definition)

    def export(self, exp_id, teacher_id):
        # Export the results of the teacher for the specified experiment_id

        # Teacher
        teacher = User.load(teacher_id)
        res_folder = 'result/' + exp_id + '_' + teacher.name.greet()
        if not os.path.exists(res_folder):
            os.makedirs(res_folder)
        
        experiment = Experiment.load().experiments[exp_id]

        # overall_res = [['ID', 'Teacher'] + [t['test_code'] for t in experiment['tests']]]
        # results = {t['test_code']: [['ID', 'Teacher'] + t['tokens'] + ['Hits', 'False Hits', 'Score']] for t in experiment['tests']}
        test_codes = [t['test_code'] for t in experiment['tests']]
        overall_results = [['ID'] + test_codes]
        results = [[['ID'] + t['tokens'] + ['Hits', 'False Hits', 'Score']] for t in experiment['tests']]
        for sid, test_results in experiment['results'].items():
            if sid not in teacher.students:
                continue

            temp_overall = [sid]
            for idx, test_res in enumerate(test_results): 
                metrics = test_res['metrics']
                temp_overall.append(metrics['score'])
                results[idx].append([sid] + test_res['evaluated_responses'] + [metrics['hits'], metrics['false_hits'], metrics['score']])
            overall_results.append(temp_overall)

        # Write overall results
        with open(os.path.join(res_folder, 'overall') + '.csv', 'w') as fhandle:
            writer = csv.writer(fhandle)
            writer.writerows(overall_results)

        for test_code, result in zip(test_codes, results):
            with open(os.path.join(res_folder, str(test_code)) + '.csv', 'w') as fhandle:
                writer = csv.writer(fhandle)
                writer.writerows(result)

        # create a ZipFile object
        with ZipFile(res_folder + '.zip', 'w') as zipObj:
           # Iterate over all the files in directory
           for folderName, subfolders, filenames in os.walk(res_folder):
               for filename in filenames:
                   #create complete filepath of file in directory
                   filePath = os.path.join(folderName, filename)
                   # Add file to zip
                   zipObj.write(filePath)
        return res_folder + '.zip'


class SuperUser(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Super'


class Experiment():
    def __init__(self):
        self.vocab_tests = pickle.load(open("./data/vocab_tests/PaulMeera.p", 'rb'))
        self.experiments = {}
        self.deleted_exps = {}

    def select_exp(self, uid):
        if uid in self.experiments:
            self.active_id = uid
            self.save()
        else:
            print("Invalid uid %s" %(uid))

    def remove_exp(self, uid):
        if uid in self.experiments:
            res = self.experiments.pop(uid)
            self.deleted_exps[uid] = res
            self.save()
        else:
            print("Invalid uid %s" %(uid))

    def add_experiment(self, name, definition):
        uid = str(ObjectId())
        self.active_id = uid
        self.experiments.update({uid: {"name": name, "definition": definition, "tests": self.get_tests(definition), "results": {}}})
        self.save()

    def get_tests(self, definition):
        tests = []
        for test_code in definition.split(';'):
            level = int(test_code[0]) - 1
            test_set = int(test_code[1:]) - 1
            tests.append(self.vocab_tests[level]['testsets'][test_set])
        return tests

    def save(self):
        exp = pickle.dumps(self)
        ack = DB.experiments.update_one({'_id': ObjectId("5e2b137cab748c8d228e4abb")}, {"$set": {"binary": exp}})
        if ack.matched_count != 1:
            print("Warning: no matching entries found to save the EXPERIMENT")

    @staticmethod
    def load():
        exp_entry = DB.experiments.find_one({'_id': ObjectId("5e2b137cab748c8d228e4abb")})
        if 'binary' not in exp_entry:
            print("No experiment setup found creating default")
            experiment = Experiment()
            experiment.add_experiment('101;201;301;201;101')
        else:
            experiment = pickle.loads(exp_entry['binary'])
        return experiment

    def filter_report(self, student_list):
        filtered_report = []
        for experiment in self.experiments.values():
            temp = {"definition": experiment["definition"],
                    "book_overlap": self._get_book_exp_overlap(experiment),
                    "tests": experiment["tests"]}

            results = []
            for student_id in student_list:
                student = User.load(student_id)
                if not student_id in experiment["results"]:
                    continue
                
                result = experiment["results"][student_id]
                student_res = {"name": student.name.fullname,
                               "book_overlap": self._get_book_result_overlap(experiment["tests"], result),
                               "result": result}
                results.append(student_res)

            # TODO: Sort results by students name
            if results:
                temp.update({"results": results})
                filtered_report.append(temp)

        return filtered_report

    def _get_book_exp_overlap(self, exp):
        tokens = [t for test in exp["tests"] for t in test["tokens"]]
        tokens = set(tokens)
        book_tokens = set(['hierograph', 'army', 'add', 'red', 'blue', 'girl', 'cage', 'actor', 'bird', 'new', 'dance'])
        print("For Experiment")
        print(tokens.intersection(book_tokens))
        return tokens.intersection(book_tokens)

    def _get_book_result_overlap(self, tests, result):
        tokens = set()
        for ix, test in enumerate(tests):
            response = result[ix]["evaluated_responses"]
            tokens.update(set([t for idx, t in enumerate(test["tokens"])
                               if response[idx] == "yes"]))
            
        book_tokens = set(['hierograph', 'army', 'add', 'red', 'blue', 'girl', 'cage', 'actor', 'bird', 'new', 'dance'])
        print(tokens.intersection(book_tokens))
        return tokens.intersection(book_tokens)

        
class Analyser:
    def __init__(self, name, vocablist):
        self.name = name
        self.vocablist = vocablist

    def get_test_overlap(self, test):
        """Get the subset of test tokens that overlaps with the book vocabulary."""

        test["overlap"] = {
            self.name: set([(idx, token)
                            for idx, token in enumerate(test["tokens"])
                            if token in self.vocablist])}
        return test["overlap"][self.name]

    def analyse(self, experiment):
        overlapping_tokens
        for test in experiment["tests"]:
            overlapping_tokens.add(self.get_test_overlap(test))

        experiment["overlap"][self.name] = overlapping_tokens

        for result in experiments["results"]:
            pass
            

            # Compare the student resposes here
        return