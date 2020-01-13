import os
import pickle
import datetime

import bson

# Globals
DATAPATH = "./data/users"


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
            user = pickle.load(df)
        return user

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
        self.role = 'Student'
        self.experiments = []
        self.active_exp = None
        self.save()

    def take_test(self):
        """
        """
        if not self.active_exp:
            self.active_exp = TestHanlde(len(self.experiments), self)
        return self.active_exp

    def close_exp(self, exp_id):
        """
        """
        if self.active_exp.id == exp_id:
            self.experiments.append(self.active_exp)
            self.active_exp = None


class TestHanlde:
    def __init__(self, exp_id, student):
        self.id = exp_id
        self.student = student
        self.logs = []
        self.active_test = None
        self.active_index = 0
        self.load_tests()

    def load_tests(self):
        exp = Experiment.load()
        self.tests = exp.tests
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
        for idx, response in enumerate(self.active_test["responses"], 1):
            if response == 'yes':
                if idx in self.active_test['improper_Ids']:
                    false_hits += 1
                else:
                    hits += 1
        result = {'false_hits': false_hits, 'hits': hits}
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
            self.active_test = None


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
        print("Loading user of id %s" % (uid))
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
            print("Password not matching")
            return user.password == password
        else:
            print("No user found of name %s" % (name))
            return False

    def update_experiment(self, experiment):
        print("Updating Exp: %s" % (experiment))
        experiments = Experiment.load()
        experiments.add_experiment(experiment)


class SuperUser(User):
    def __init__(self, name, password):
        super().__init__(name, password)
        self.role = 'Super'


class Experiment():
    def __init__(self):
        self.experiment = {}
        self.vocab_tests = pickle.load(open("./data/vocab_tests/PaulMeera.p", 'rb'))
        self.tests = []

    def add_experiment(self, experiment):
        uid = str(bson.objectid.ObjectId())
        self.experiment.update({uid: experiment})
        self.get_tests(experiment)
        self.save()

    def get_tests(self, experiment):
        self.tests = []
        for test_code in experiment.split(';'):
            level = int(test_code[0]) - 1
            test_set = int(test_code[2]) - 1
            self.tests.append(self.vocab_tests[level]['testsets'][test_set])

    def save(self):
        with open(os.path.join(DATAPATH, 'experiment' + '.p'), 'wb') as df:
            pickle.dump(self, df)

    @staticmethod
    def load():
        if os.path.isfile(os.path.join(DATAPATH, 'experiment' + '.p')):
            with open(os.path.join(DATAPATH, 'experiment' + '.p'), 'rb') as df:
                experiment = pickle.load(df)
        else:
            experiment = Experiment()
            experiment.add_exp('101;201;301;201;101')
        return experiment
