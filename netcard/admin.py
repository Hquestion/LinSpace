# coding=utf-8
__author__ = 'Administrator'


#你好

from django.contrib import admin
from netcard.models import *
from django.db import models


class PersonAdmin(admin.ModelAdmin):
    list_display = ("name", "sex", "label", "mark")

    def __unicode__(self):
        return self.name


class AlbumAdmin(admin.ModelAdmin):
    list_display = ("name", "cover", "person", "date")

    def __unicode__(self):
        return self.name


class PhotoAdmin(admin.ModelAdmin):
    list_display = ("url", "desc", "is_home" ,"album")
    list_filter = ("album", "is_home")
    search_fields = ("album",)

    def __unicode__(self):
        return self.url

admin.site.register(Person, PersonAdmin)
admin.site.register(Album, AlbumAdmin)
admin.site.register(Photo, PhotoAdmin)