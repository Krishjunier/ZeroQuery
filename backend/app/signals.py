from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Thread, Reply, Notification

@receiver(post_save, sender=Thread)
def notify_on_new_thread(sender, instance, created, **kwargs):
    """
    When a new thread (question) is created, notify all users except the creator.
    """
    if created:
        # Get all users except the thread creator
        users_to_notify = User.objects.exclude(id=instance.user.id)
        for user in users_to_notify:
            Notification.objects.create(
                user=user,
                message=f"New question posted: '{instance.title}'"
            )

@receiver(post_save, sender=Reply)
def notify_thread_owner_on_reply(sender, instance, created, **kwargs):
    """
    When a new reply is created, notify the thread's owner (if the replier is not the owner).
    """
    if created:
        thread_owner = instance.thread.user
        if thread_owner != instance.user:
            Notification.objects.create(
                user=thread_owner,
                message=f"Your question '{instance.thread.title}' has a new reply."
            )
