import os
import pickle
import datetime
from collections import defaultdict

import bson

# Globals
DATAPATH = "./data/users"


class Name:
    def __init__(self, first_name, middle_name, last_name, salutation):
        self.fname = first_name
        self.mname = middle_name
        self.lname = last_name
        self.salutation = salutation

    def greet(self):
        return self.fname


class Password:
    def __init__(self, password):
        password = password

    def validate(self, password):
        raise NotImplementedError

    def encrypt(self, password):
        raise NotImplementedError


class User:
    def __init__(self, name, password):
        self.name = name
        self.password = password
        self.uid = str(bson.objectid.ObjectId())

    @staticmethod
    def load(uid):
        with open(os.path.join(DATAPATH, uid + '.p'), 'rb') as df:
            teacher = pickle.load(df)
        return teacher

    def save(self):
        with open(os.path.join(DATAPATH, self.uid + '.p'), 'wb') as df:
            pickle.dump(self, df)


class Student(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.results = defaultdict(dict)
        self.active_test = None
        self.role = 'Teacher'

    def add_result(self, test_code, result):
        timestamp = datetime.datetime.now().timestamp()
        self.results[test_code][timestamp] = result


class Teacher(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Teacher'
