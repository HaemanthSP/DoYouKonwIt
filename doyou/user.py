import os
import pickle
import datetime
from collections import defaultdict

import bson

# Globals
DATAPATH = "./data/users"


class Name:
    def __init__(self, first_name, middle_name, last_name, salutation=""):
        self.fname = first_name
        self.mname = middle_name
        self.lname = last_name
        self.salutation = salutation

    def greet(self):
        return self.fname

    def __str__(self):
        return ' '.join([self.fname, self.mname, self.lname])


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
        self.uid = str(bson.objectid.ObjectId())
        self.update_index()

    @staticmethod
    def load(uid):
        with open(os.path.join(DATAPATH, uid + '.p'), 'rb') as df:
            teacher = pickle.load(df)
        return teacher

    @staticmethod
    def get_index():
        with open(os.path.join(DATAPATH, 'user_index.p'), 'rb') as df:
            user_index = pickle.load(df)
        return user_index

    @staticmethod
    def remove_user(uid):
        raise NotImplementedError

    def update_index(self):
        user_index = User.get_index()
        user_index.update({str(self.name): self.uid})
        with open(os.path.join(DATAPATH, 'user_index.p'), 'wb') as df:
            pickle.dump(user_index, df)

    def save(self):
        with open(os.path.join(DATAPATH, self.uid + '.p'), 'wb') as df:
            pickle.dump(self, df)


class Student(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.results = defaultdict(dict)
        self.active_test = None
        self.role = 'Student'
        self.session = None
        self.logs = []
        self.tests = []
        self.results = []
        self.active_test = ''
        self.responses = []
        self.save()

    def add_result(self, test_code, result):
        timestamp = datetime.datetime.now().timestamp()
        self.results[test_code][timestamp] = result

    def get_test(self):
        if self.tests:
            # TODO: Threshold for time difference for valid session
            return self.tests

        else:
            # TODO: Implement experiment class to define experiments
            exp = Experiment.load_recent()
            self.tests = exp.get_tests()
            self.active_test = self.tests[0]['code']
            return self.tests

    def update_response(self, test_code, response):
        if self.active_test == test_code:
            timestamp = datetime.datetime.now().timestamp()
            self.log.append({"time": timestamp, "response": response})
            self.response = response
            return True
        else:
            return False

    def evaluate(self, test_code):
        assert self.active_test == test_code
        assert self.tests[0]["code"] == test_code


class Teacher(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Teacher'
        self.name = name
        self.password = password
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
        if uid:
            return User.load(uid)
        else:
            return None

    def add_user(self, name, password, role):
        user_type = {'student': Student, 'teacher': Teacher}
        return user_type[role](name, password)

    def remove_user(self, uid):
        raise NotImplementedError

    def validate_user(self, name, password):
        user = self.get_user(name)
        if user:
            return user.password == password
        else:
            return False


class SuperUser(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Super'


class Experiment():
    def __init__(self, exp_id):
        self.exp_id = exp_id

    def get_tests(self):
        vocab_test = pickle.load(open("./data/vocab_tests/PaulMeera.p", 'rb'))
        tests = vocab_test[0]['testsets'][:3]
        return tests
