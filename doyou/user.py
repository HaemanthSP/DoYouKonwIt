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

    @staticmethod
    def get_index():
        with open(os.path.join(DATAPATH, 'user_index.p')) as df:
            user_index = pickle.load(df)
        return user_index

    @staticmethod
    def remove_user(uid):
        raise NotImplementedError

    def update_index(self):
        user_index = User.get_index()
        user_index.update({str(self.name): self.uid})
        with open(os.path.join(DATAPATH, 'user_index.p')) as df:
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

    def add_result(self, test_code, result):
        timestamp = datetime.datetime.now().timestamp()
        self.results[test_code][timestamp] = result


class Teacher(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Teacher'


class Admin(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Admin'
    
    def 


class SuperUser(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Super'
