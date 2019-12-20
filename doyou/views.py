from django.shortcuts import render

# Create your views here.
import json
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView
import base64
import pickle

from doyou import tokens, user


class GetWordList(APIView):
    def post(self, req):
        # data = {"wordList": tokens.get_wordlist("./data/hp.txt")}
        data = {"wordList": ['Quickly', 'Happy', 'new', 'winter']}
        return Response(data=data, status=status.HTTP_200_OK)


class GetLevels(APIView):
    def post(self, req):
        vocab_test = pickle.load(open("./data/vocab_tests/PaulMeera.p", 'rb'))
        data = {"levels": vocab_test}
        # data = {"levels": ['A1', 'A2']}
        return Response(data=data, status=status.HTTP_200_OK)


class PostActivity(APIView):
    def post(self, req):
        username = json.loads(req.body)['username']
        data = {'username': username}
        return Response(data=data, status=status.HTTP_200_OK)


class SignUp(APIView):
    def post(self, req):
        admin = user.User.load('5dec206426dcce24267fe860')
        firstname = json.loads(req.body)['firstname']
        lastname = json.loads(req.body)['lastname']
        middlename = json.loads(req.body)['middlename']
        role = json.loads(req.body)['role']
        email = json.loads(req.body)['email']
        password = json.loads(req.body)['password']

        print("Details:\n%s\n%s\n%s\n%s\n " % (firstname, lastname, email, password))
        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password)
        if not admin.get_user(name):
            this_user = admin.add_user(name, password, role)
            is_valid = True
            message = "Congratulations, Your account has been created"
            print(this_user.uid)
        else:
            is_valid = False
            message = "Sorry, your already has an account, Please Login"
        print("Message:", message)
        data = {"isValid": is_valid, "message": message}
        return Response(data=data, status=status.HTTP_200_OK)


class Login(APIView):
    def post(self, req):
        admin = user.User.load('5dec206426dcce24267fe860')
        firstname = json.loads(req.body)['firstname']
        lastname = json.loads(req.body)['lastname']
        middlename = json.loads(req.body)['middlename']
        password = json.loads(req.body)['password']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password)

        is_valid = admin.validate_user(name, password)
        print("valid:", is_valid)
        print("Name:", str(name))
        print("Password:", password.password)
        message = 'Welcome, %s' % (name.greet())
        if not is_valid:
            message = 'Invalid username or password'
        print(message)
        data = {"isValid": is_valid, 'message': message}
        return Response(data=data, status=status.HTTP_200_OK)


class GetTests(APIView):
    def post(self, req):
        admin = user.User.load('5dec206426dcce24267fe860')

        firstname = json.loads(req.body)['firstname']
        lastname = json.loads(req.body)['lastname']
        middlename = json.loads(req.body)['middlename']
        password = json.loads(req.body)['password']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password)

        print("API: Get tests")
        student = admin.get_user(name)
        active_exp = student.take_test()

        data = {"tests": active_exp.tests, "index": active_exp.active_index}
        student.save()
        return Response(data=data, status=status.HTTP_200_OK)


class UpdateResponse(APIView):
    def post(self, req):
        admin = user.User.load('5dec206426dcce24267fe860')

        firstname = json.loads(req.body)['firstname']
        lastname = json.loads(req.body)['lastname']
        middlename = json.loads(req.body)['middlename']
        password = json.loads(req.body)['password']
        test_code = json.loads(req.body)['testcode']
        selections = json.loads(req.body)['selections']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password)

        print("API: Update Response")
        student = admin.get_user(name)
        active_exp = student.active_exp
        is_valid = active_exp.update_response(test_code, selections)
        student.save()

        # TODO: Capture collision (due to two active sessions of same user)
        data = {"isValid": is_valid, 'message': "Success" if is_valid else "Collision"}
        return Response(data=data, status=status.HTTP_200_OK)


class GetResult(APIView):
    def post(self, req):
        admin = user.User.load('5dec206426dcce24267fe860')

        firstname = json.loads(req.body)['firstname']
        lastname = json.loads(req.body)['lastname']
        middlename = json.loads(req.body)['middlename']
        password = json.loads(req.body)['password']
        test_code = json.loads(req.body)['testcode']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password)

        print("API: Get result of %s" % (name.greet()))
        student = admin.get_user(name)
        active_exp = student.active_exp
        result = active_exp.evaluate(test_code)
        student.save()

        # TODO: Capture collision (due to two active sessions of same user)
        data = {"result": result, 'message': "Success"}
        return Response(data=data, status=status.HTTP_200_OK)
