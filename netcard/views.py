# Create your views here.
# coding=utf-8

from django.template import response
from django.shortcuts import render_to_response
from django.shortcuts import HttpResponse
from netcard.models import *
import json
from django.core import serializers
import httplib
import urllib, urllib2

DEFAULT_USER = "1"


def index(request):
    return render_to_response("index.html", {})


def profile(request):
    return render_to_response("profile.html", {})


def getPhotoWall(request):
    photo_wall = serializers.serialize("json", Photo.objects.filter(is_home="1").order_by("date")[0:4])
    return HttpResponse(photo_wall)


def getProfileBrief(request):
    profile = Person.objects.get(id="1")
    jsonData = profile.toJSON()
    return HttpResponse(jsonData)


def getWeather(request):
    url = "http://www.weather.com.cn:80/data/cityinfo/101190101.html"
    req = urllib2.Request(url)
    res_data = urllib2.urlopen(req)
    res = res_data.read()
    return HttpResponse(res)


def fav(request):
    return render_to_response("fav.html", {})

