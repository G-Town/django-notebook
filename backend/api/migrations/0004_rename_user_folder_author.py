# Generated by Django 5.0.6 on 2024-07-09 16:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_tag_folder_note_folder_foldershare_notetag_note_tags'),
    ]

    operations = [
        migrations.RenameField(
            model_name='folder',
            old_name='user',
            new_name='author',
        ),
    ]
