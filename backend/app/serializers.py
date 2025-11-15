from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, Badge, Discipline, Query,
    Thread, Reply, Tag, Vote, Notification
)

# --- User Serializer ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# --- UserProfile Serializer ---
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'

# --- Badge Serializer ---
class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

# --- Discipline Serializer ---
class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = '__all__'

# --- Query Serializer (was Course) ---
class QuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = '__all__'

# --- Tag Serializer ---
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

# --- Thread Serializer ---
class ThreadSerializer(serializers.ModelSerializer):
    query = QuerySerializer(read_only=True)
    query_id = serializers.PrimaryKeyRelatedField(queryset=Query.objects.all(), source='query', write_only=True)
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)

    class Meta:
        model = Thread
        fields = ['id', 'query', 'query_id', 'user', 'user_id', 'title', 'message', 'created_at']

# --- Nested Reply Serializer for recursive children ---
class NestedReplySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Reply
        fields = ['id', 'user', 'message', 'created_at', 'children', 'parent']

    def get_children(self, obj):
        children = obj.children.all()
        return NestedReplySerializer(children, many=True).data

# --- Reply Serializer (supports threaded replies) ---
class ReplySerializer(serializers.ModelSerializer):
    thread_id = serializers.PrimaryKeyRelatedField(queryset=Thread.objects.all(), source='thread', write_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)
    parent_id = serializers.PrimaryKeyRelatedField(queryset=Reply.objects.all(), source='parent', write_only=True, required=False, allow_null=True)

    thread = ThreadSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    parent = NestedReplySerializer(read_only=True)

    class Meta:
        model = Reply
        fields = ['id', 'thread', 'thread_id', 'user', 'user_id', 'message', 'created_at', 'parent', 'parent_id']

# --- Vote Serializer ---
class VoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    thread = ThreadSerializer(read_only=True)
    reply = ReplySerializer(read_only=True)

    class Meta:
        model = Vote
        fields = '__all__'

# --- Notification Serializer ---
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
