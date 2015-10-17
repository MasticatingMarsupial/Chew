# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('food', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='foodtag',
            name='food',
        ),
        migrations.RemoveField(
            model_name='foodtag',
            name='tag',
        ),
        migrations.AddField(
            model_name='food',
            name='tags',
            field=models.ManyToManyField(to='food.Tag'),
        ),
        migrations.AlterField(
            model_name='cuisine',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='food',
            name='avgRating',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='food',
            name='numRating',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='image',
            name='review',
            field=models.ForeignKey(to='food.Review', null=True),
        ),
        migrations.AlterField(
            model_name='review',
            name='reviewRating',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(max_length=30, unique=True),
        ),
        migrations.AlterUniqueTogether(
            name='food',
            unique_together=set([('name', 'restaurant')]),
        ),
        migrations.AlterUniqueTogether(
            name='restaurant',
            unique_together=set([('name', 'location')]),
        ),
        migrations.DeleteModel(
            name='FoodTag',
        ),
    ]
