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
        admin = user.User.load('5debd5d026dcce24267fe859')
        firstname = json.loads(req.body)['firstname']
        lastname = json.loads(req.body)['lastname']
        middlename = json.loads(req.body)['middlename']
        role = json.loads(req.body)['role']
        email = json.loads(req.body)['email']
        password = json.loads(req.body)['password']

        print("Details:\n%s\n%s\n%s\n%s\n " % (firstname, lastname, email, password))
        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password)
        if admin.get_user(name):
            this_user = admin.add_user(name, password)
            is_valid = True
            message = "Congratulations, Your account has been created"
        else:
            is_valid = False
            message = "Sorry, your already has an account, Please Login"
        print(this_user.uid)
        this_user.save()
        data = {"status": is_valid, "message": message}
        return Response(data=data, status=status.HTTP_200_OK)


class Login(APIView):
    def post(self, req):
        admin = user.User.load('5debd5d026dcce24267fe859')
        firstname = json.loads(req.body)['firstname']
        lastname = json.loads(req.body)['lastname']
        middlename = json.loads(req.body)['middlename']
        password = json.loads(req.body)['password']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password)

        is_valid = admin.validate_user(name, password)
        message = 'Welcome %s' % (name.greet())
        if not is_valid:
            message = 'Invalid username or password'
        data = {"isValid": is_valid, 'message': message}
        return Response(data=data, status=status.HTTP_200_OK)
