from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# UserProfile model for storing additional user info
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    def __str__(self):
        return self.user.username

# Badge model for awarding badges to users
class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='badges/')

    def __str__(self):
        return self.name

# Discipline model for categorizing queries
class Discipline(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name

# Query model (used to be Course) to handle academic queries/topics
class Query(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

# Thread model for discussions related to a query/topic
class Thread(models.Model):
    query = models.ForeignKey(Query, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

# Reply model for replies to threads, supports nested replies via parent-child relationships
class Reply(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="replies")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='children')

    def __str__(self):
        return f"Reply by {self.user.username} on {self.thread.title}"

# Tag model for categorizing threads and replies
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# Vote model for upvoting or downvoting threads and replies
class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    thread = models.ForeignKey(Thread, null=True, blank=True, on_delete=models.CASCADE, related_name='votes')
    reply = models.ForeignKey(Reply, null=True, blank=True, on_delete=models.CASCADE, related_name='votes')
    is_upvote = models.BooleanField(default=True)

    def __str__(self):
        target = self.thread if self.thread else self.reply
        return f"Vote by {self.user.username} on {target}"

# Notification model for user notifications
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"
