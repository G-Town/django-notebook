from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Folder, Note, Tag, NoteTag, FolderShare


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class NoteTagSerializer(serializers.ModelSerializer):
    tag = TagSerializer()

    class Meta:
        model = NoteTag
        fields = ["note", "tag"]


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "snippet", "created_at", "author", "tags"]
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        tags_data = self.context["request"].data.get("tags", [])
        note = Note.objects.create(**validated_data)

        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data["name"])
            NoteTag.objects.create(note=note, tag=tag)

        return note


class FolderSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = ["id", "name", "user", "notes"]
        extra_kwargs = {"user": {"read_only": True}}


class FolderShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = FolderShare
        fields = ["folder", "user", "can_edit"]
