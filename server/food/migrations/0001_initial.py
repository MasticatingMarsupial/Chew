# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cuisine',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Food',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('price', models.IntegerField()),
                ('avgRating', models.IntegerField()),
                ('numRating', models.IntegerField()),
                ('cuisine', models.ForeignKey(to='food.Cuisine')),
            ],
        ),
        migrations.CreateModel(
            name='FoodTag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('food', models.ForeignKey(to='food.Food')),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image', models.CharField(max_length=255)),
                ('food', models.ForeignKey(to='food.Food')),
            ],
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('location', models.CharField(max_length=255)),
                ('cuisine', models.ForeignKey(to='food.Cuisine')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.CharField(max_length=255)),
                ('foodRating', models.IntegerField()),
                ('reviewRating', models.IntegerField()),
                ('food', models.ForeignKey(to='food.Food')),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=30)),
            ],
        ),
        migrations.AddField(
            model_name='review',
            name='user',
            field=models.ForeignKey(to='food.User'),
        ),
        migrations.AddField(
            model_name='image',
            name='review',
            field=models.ForeignKey(to='food.Review'),
        ),
        migrations.AddField(
            model_name='foodtag',
            name='tag',
            field=models.ForeignKey(to='food.Tag'),
        ),
        migrations.AddField(
            model_name='food',
            name='restaurant',
            field=models.ForeignKey(to='food.Restaurant'),
        ),
    ]
