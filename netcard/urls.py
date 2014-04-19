# -*- coding: utf-8 -*-
__author__ = 'Administrator'

from django.conf.urls import patterns, include, url


import views

urlpatterns = patterns('',
        (r'^$', views.index,),
        (r'getPhotoWall/$', views.getPhotoWall),
        (r'getProfileBrief/$', views.getProfileBrief),
        (r'profile/$', views.profile),
        (r'getWeather/$', views.getWeather),
        (r'fav/$', views.fav),
)
