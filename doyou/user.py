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
        self.save()

    def add_result(self, test_code, result):
        timestamp = datetime.datetime.now().timestamp()
        self.results[test_code][timestamp] = result


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
