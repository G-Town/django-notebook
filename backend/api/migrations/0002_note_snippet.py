# Generated by Django 5.0.6 on 2024-06-28 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='snippet',
            field=models.TextField(blank=True, null=True),
        ),
    ]
