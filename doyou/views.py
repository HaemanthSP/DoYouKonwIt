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
from django.http import FileResponse
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

        if '-' in dob:
            pass_phrase = ''.join(dob.split('-')[::-1]) + firstname[:3].lower()
        # Handle for safari
        elif '/' in dob:
            pass_phrase = ''.join(dob.split('/')) + firstname[:3].lower()

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


class GetConsolidatedTeacherReport(APIView):
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
        teacher_report = exp.pack_consolidated(student_list)
        print(teacher_report) 

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
        exp_name = req_json['expName']
        # FIXME: Identify the issue arises by enabling this
        # password = req_json['password']

        name = user.Name(firstname, middlename, lastname)
        # password = user.Password(password.lower())

        print("API: Define experiment")
        admin_user = admin.get_user(name)
        admin_user.update_experiment(exp_name, experiment)

        exp_handle = user.Experiment.load()
        experiments = [(exp_id, exp.get('name', 'dummy name'), exp['definition']) for exp_id, exp in exp_handle.experiments.items()] 
        data = {"message": "Successfully updated experiment", "experiments":experiments}

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


class GetStudentReport(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')

        req_json = json.loads(req.body.decode('utf-8'))
        firstname = req_json['firstname']
        lastname = req_json['lastname']
        middlename = req_json['middlename']
        password = req_json['password']

        name = user.Name(firstname, middlename, lastname)
        password = user.Password(password.lower())

        print("API: Get result of %s" % (name.greet()))
        student = admin.get_user(name)
        exp = user.Experiment.load()
        result = exp.pack_student_res(student.uid)

        data = {"result": result, 'message': "Success"}
        return Response(data=data, status=status.HTTP_200_OK)


# class Export (APIView):
def export(req):
    # def post(self, req):
        print("API1: Export results")
        admin = user.User.load('5e2ebb45e414a94dc67fd993')
        # req_json = json.loads(req.body.decode('utf-8'))
        # req_json = json.loads(req.body)
        # teacher_id = req_json['teacher_id']
        teacher_id = '5e2ebbd9e414a94dc67fd995'
        exp_id = '5e2ef8918099f0bfd8bfca9a'
        # exp_id = req_json['exp_id']

        print("API: Export results")
        print("exp_id: %s, teacher_id: %s" % (exp_id, teacher_id))
        zip_path = admin.export(exp_id, teacher_id)
        print("Wrote file to %s" % zip_path)
        zip_file = open(zip_path, 'rb')
        response = FileResponse(zip_file)
        # response = HttpResponse(zip_file, content_type='application/zip')
        # response = HttpResponse(zip_file, content_type='application/force-download')
        # response['Content-Disposition'] = 'attachment; filename="%s"' % 'test.zip' 
        return response

        
class ExperimentList(APIView):
    def post(self, req):
        exp_handle = user.Experiment.load()
        
        experiments = [(exp_id, exp.get('name', 'dummy name'), exp['definition']) for exp_id, exp in exp_handle.experiments.items()] 
        user_list = user.User.get_user_list()
        data = {"experiments": experiments, "user_list": user_list, "active_exp": exp_handle.active_id}
        return Response(data=data, status=status.HTTP_200_OK)


        data = {"message": "Experiment %s is selected" % (req_json["active_id"])}
        return Response(data=data, status=status.HTTP_200_OK)

class SelectExperiment(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')
        req_json = json.loads(req.body.decode('utf-8'))
        uid = req_json['active_id']
        exp_handle = user.Experiment.load()
        exp_handle.select_exp(uid) 
        
        message = "Experiment selected successfully."
        data = {"message": message}
        return Response(data=data, status=status.HTTP_200_OK)

        
class AddUser(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')
        req_json = json.loads(req.body.decode('utf-8'))
        firstname = req_json['firstname']
        lastname = req_json['lastname']
        teacher_id = req_json['teacher_id']
        role = req_json['role']
        password = req_json['password']
        dob = req_json['dob']

        name = user.Name(firstname, '', lastname)

        if role == 'student':
            pass_phrase = ''.join(dob.split('-')[::-1]) + firstname[:3].lower()
            print("Details:\n%s\n%s\n%s\n " % (firstname, lastname, pass_phrase))
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


class RemoveUser(APIView):
    def post(self, req):
        admin = user.User.load('5e2ebb45e414a94dc67fd993')
        req_json = json.loads(req.body.decode('utf-8'))
        uid = req_json['uid']
        
        if admin.remove_user(uid):
            message = "No user with this id found."
        else:
            message = "User removed successfully."
        users = user.User.get_user_list()
        data = {"user_list": users, "message": message}
        return Response(data=data, status=status.HTTP_200_OK)

        
class UserList(APIView):
    def post(self, req):
        users = user.User.get_user_list()
        data = {"user_list": users}
        return Response(data=data, status=status.HTTP_200_OK)