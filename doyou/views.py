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

from doyou import user
from django.http import HttpResponse, Http404
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import logging
import urllib.request
import os


def index(request):
    return render(request, "build/index.html")


class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    run build`).
    """
    def get(self, request):
            print (os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'))
            try:
                with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                    return HttpResponse(f.read())
            except FileNotFoundError:
                logging.exception('Production build of app not found')
                return HttpResponse(
                    """
                    This URL is only used when you have built the production
                    version of the app. Visit http://localhost:3000/ instead, or
                    run `yarn run build` to test the production version.
                    """,
                    status=501,
                )

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
        req_json = json.loads(req.body.decode('utf-8'))
        username = req_json['username']
        data = {'username': username}
        return Response(data=data, status=status.HTTP_200_OK)


class SignUp(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')
        req_json = json.loads(req.body.decode('utf-8'))
        firstname = req_json['firstname']
        lastname = req_json['lastname']
        middlename = req_json['middlename']
        role = req_json['role']
        teacher_id = req_json['teacher']
        email = req_json['email']
        dob = req_json['dob']

        name = user.Name(firstname, middlename, lastname)

        pass_phrase = ''.join(dob.split('-')[::-1]) + firstname[:3].lower()
        print("Details:\n%s\n%s\n%s\n%s\n " % (firstname, lastname, email, pass_phrase))
        password = user.Password(pass_phrase)
        if not admin.get_user(name):
            student = admin.add_user(name, password, role)
            is_valid = True
            message = "Congratulations, Your account has been created"
            print(student.uid)

            # Assign to the teacher
            teacher = user.User.load(teacher_id)
            teacher.add_student(student.uid)
        else:
            is_valid = False
            message = "Sorry, your already has an account, Please Login"
        print("Message:", message)
        data = {"isValid": is_valid, "message": message, "password": pass_phrase}
        return Response(data=data, status=status.HTTP_200_OK)


class Login(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')
        req_json = json.loads(req.body.decode('utf-8'))
        firstname = req_json['firstname']
        lastname = req_json['lastname']
        middlename = req_json['middlename']
        password = req_json['password']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password.lower())

        is_valid = admin.validate_user(name, password)
        print("valid:", is_valid)
        print("Name:", str(name))
        print("Password:", password.password)
        message = 'Welcome, %s' % (name.greet())
        if not is_valid:
            message = 'Invalid username or password'
            role = None
        else:
            role = admin.get_user(name).role
            message = "Successfully logged in"
        print(message)
        data = {"isValid": is_valid, "role": role, 'message': message}
        return Response(data=data, status=status.HTTP_200_OK)

class GetTeacherReport(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')
        req_json = json.loads(req.body.decode('utf-8'))
        firstname = req_json['firstname']
        lastname = req_json['lastname']
        middlename = req_json['middlename']
        print(req_json)
        # password = req_json['password']

        name = user.Name(firstname, middlename, lastname)
        # password = user.Password(password.lower())

        print("API: Collect teacher report")
        teacher = admin.get_user(name)
        student_list = teacher.students

        exp = user.Experiment.load()
        teacher_report = exp.filter_report(student_list)

        data = {"teacher_report": teacher_report, "message": "Successfully collected the report"}

        return Response(data=data, status=status.HTTP_200_OK)

class DefineExperiment(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')
        req_json = json.loads(req.body.decode('utf-8'))
        firstname = req_json['firstname']
        lastname = req_json['lastname']
        middlename = req_json['middlename']
        experiment = req_json['experiment']
        # FIXME: Identify the issue arises by enabling this
        # password = req_json['password']

        name = user.Name(firstname, middlename, lastname)
        # password = user.Password(password.lower())

        print("API: Define experiment")
        admin_user = admin.get_user(name)
        admin_user.update_experiment(experiment)

        data = {"message": "Successfully updated experiment"}

        return Response(data=data, status=status.HTTP_200_OK)


class GetTests(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')

        req_json = json.loads(req.body.decode('utf-8'))
        firstname = req_json['firstname']
        lastname = req_json['lastname']
        middlename = req_json['middlename']
        password = req_json['password']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password.lower())

        print("API: Get tests")
        student = admin.get_user(name)
        active_exp = student.take_test()

        data = {"tests": active_exp.tests, "index": active_exp.active_index}
        student.save()
        return Response(data=data, status=status.HTTP_200_OK)


class UpdateResponse(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')

        req_json = json.loads(req.body.decode('utf-8'))
        firstname = req_json['firstname']
        lastname = req_json['lastname']
        middlename = req_json['middlename']
        password = req_json['password']
        test_code = req_json['testcode']
        selections = req_json['selections']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password.lower())

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
        admin = user.User.load('5e2ebb45e414a94dc67fd993')

        req_json = json.loads(req.body.decode('utf-8'))
        firstname = req_json['firstname']
        lastname = req_json['lastname']
        middlename = req_json['middlename']
        password = req_json['password']
        test_code = req_json['testcode']
        selections = req_json['selections']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password.lower())

        print("API: Get result of %s" % (name.greet()))
        student = admin.get_user(name)
        active_exp = student.active_exp
        is_valid = active_exp.update_response(test_code, selections)
        result = active_exp.evaluate(test_code)
        student.save()

        # TODO: Capture collision (due to two active sessions of same user)
        data = {"result": result, 'message': "Success" if is_valid else "Collision"}
        return Response(data=data, status=status.HTTP_200_OK)


class Export (APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')
        req_json = json.loads(req.body.decode('utf-8'))
        teacher_id = req_json['teacherId']
        exp_id = req_json['expId']

        print("API: Collect teacher report")
        zip_path = admin.export(exp_id, teacher_id)
        zip_file = open(zip_path, 'r')
        response = HttpResponse(zip_file, content_type='application/force-download')
        response['Content-Disposition'] = 'attachment; filename="%s"' % zip_path 
        return response