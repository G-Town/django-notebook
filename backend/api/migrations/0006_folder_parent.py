# Generated by Django 5.0.6 on 2024-08-22 23:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_note_updated_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='folder',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='api.folder'),
        ),
    ]
