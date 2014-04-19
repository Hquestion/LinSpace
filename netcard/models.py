# coding=utf-8

from django.db import models
import json


# Create your models here.


class Person(models.Model):
    name = models.CharField("名字", max_length=30)
    sex = models.IntegerField("性别", max_length=2, blank=True,null=True)
    label = models.CharField("标签", max_length=100, blank=True,null=True)
    mark = models.CharField("一句话介绍", max_length=50, blank=True,null=True)
    short_desc = models.CharField("详细介绍", max_length=500, blank=True,null=True)
    email = models.EmailField("邮箱", max_length=30, blank=True,null=True)
    address = models.CharField("联系地址", max_length=80, blank=True,null=True)
    qq_number = models.CharField("QQ", max_length=12, blank=True,null=True)
    telephone = models.CharField("手机号码", max_length=12, blank=True,null=True)
    age = models.IntegerField("年龄", max_length=3, blank=True,null=True)
    head_pic = models.CharField("头像", max_length=100, blank=True, null=True)
    country = models.CharField("国籍", max_length=20, blank=True,null=True)
    interest = models.CharField("兴趣爱好", max_length=80, blank=True,null=True)
    star = models.CharField("星座", max_length=10, blank=True,null=True)
    blood = models.CharField("血型", max_length=2, blank=True,null=True)
    weixin = models.CharField("微信二维码", max_length=50, blank=True,null=True)
    visit_times = models.CharField("访问次数", max_length=20, blank=True,null=True)

    def __unicode__(self):
        return self.name

    def toJSON(self):
        fields = []
        for field in self._meta.fields:
            fields.append(field.name)

        d = {}
        for attr in fields:
            d[attr] = getattr(self, attr)

        return json.dumps(d)

    class Meta:
        def __init__(self):
            pass

        verbose_name = "我的信息"
        verbose_name_plural = "我的信息"


class Album(models.Model):
    name = models.CharField("相册名", max_length=20)
    date = models.CharField("创建日期", max_length=20)
    cover = models.CharField("封面图片", max_length=100, blank=True, null=True)
    person = models.ForeignKey(Person)

    def __unicode__(self):
        return self.name

    def toJSON(self):
        fields = []
        for field in self._meta.fields:
            fields.append(field.name)

        d = {}
        for attr in fields:
            d[attr] = getattr(self, attr)

        return json.dumps(d)

    class Meta:
        ordering = ['date']

        verbose_name = "相册"
        verbose_name_plural = "相册"


class Photo(models.Model):
    url = models.CharField("图片", max_length=100)
    date = models.CharField("创建日期", max_length=20)
    fav_times = models.CharField("被赞次数", max_length=20, blank=True,null=True)
    desc = models.CharField("描述", max_length=500, blank=True,null=True)
    is_home = models.IntegerField("在首页显示", max_length=2, blank=True,null=True)
    album = models.ForeignKey(Album)

    def __unicode__(self):
        return self.url

    def toJSON(self):
        fields = []
        for field in self._meta.fields:
            fields.append(field.name)

        d = {}
        for attr in fields:
            d[attr] = getattr(self, attr)

        return json.dumps(d)

    class Meta:
        ordering = ['date']

        verbose_name = "图片"
        verbose_name_plural = "图片"


class Message(models.Model):
    name = models.CharField(max_length=100, blank=True,null=True)
    content = models.CharField(max_length=500)
    message_to = models.ForeignKey(Person)
    date = models.CharField(max_length=20)

    def __unicode__(self):
        return self.content

    def toJSON(self):
        fields = []
        for field in self._meta.fields:
            fields.append(field.name)

        d = {}
        for attr in fields:
            d[attr] = getattr(self, attr)

        return json.dumps(d)

    class Meta:
        ordering = ['date']


class Response(models.Model):
    content = models.CharField(max_length=500)
    date = models.CharField(max_length=20)
    response_to = models.ForeignKey(Message)

    def __unicode__(self):
        return self.content

    def toJSON(self):
        fields = []
        for field in self._meta.fields:
            fields.append(field.name)

        d = {}
        for attr in fields:
            d[attr] = getattr(self, attr)

        return json.dumps(d)

    class Meta:
        ordering = ['date']
