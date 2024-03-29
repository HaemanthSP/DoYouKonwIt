"""DoYouKnowIt URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from doyou import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path(r'', views.index, name="index"),
    # url(r'^', views.FrontendAppView.as_view()),
    url(r'^api/v1/getwordlist$', views.GetWordList.as_view(), name='get word list'),
    # url(r'^api/v1/getlevels$', views.GetLevels.as_view(), name='get levels'),
    url(r'^api/v1/gettests$', views.GetTests.as_view(), name='get tests'),
    url(r'^api/v1/updateresponse$', views.UpdateResponse.as_view(), name='update response'),
    url(r'^api/v1/getresult$', views.GetResult.as_view(), name='get result'),
    # url(r'^api/v1/getteacherreport$', views.GetTeacherReport.as_view(), name='get teacherreport'),
    url(r'^api/v1/defineexp$', views.DefineExperiment.as_view(), name='post experiment'),
    url(r'^api/v1/signup$', views.SignUp.as_view(), name='post signup'),
    url(r'^api/v1/login$', views.Login.as_view(), name='post Login'),
    url(r'^api/v1/addteacher$', views.AddTeacher.as_view(), name='post add teacher'),
    url(r'^api/v1/removeuser$', views.RemoveUser.as_view(), name='post remove user'),
    url(r'^api/v1/getuserlist$', views.UserList.as_view(), name='post user list'),
    # url(r'^api/v1/export$', views.Export.as_view(), name='get export'),
    url(r'^api/v1/export$', views.export, name='get export'),
    url(r'^api/v1/selectexp$', views.SelectExperiment.as_view(), name='post select experiment'),
    url(r'^api/v1/studentreport$', views.GetStudentReport.as_view(), name='get studentreport'),
    url(r'^api/v1/consolidatedreport$', views.GetConsolidatedTeacherReport.as_view(), name='get consolidated teacher report'),
    url(r'^api/v1/experiments$', views.ExperimentList.as_view(), name='post experiments'),
]