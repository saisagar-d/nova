import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campusbot.settings')
django.setup()

from django.contrib.auth.models import User

def create_users():
    start = 128
    end = 191
    domain = "@dsatm.edu.in"
    password_suffix = "@nova"

    for i in range(start, end + 1):
        email = f"1DT23CS{i}{domain}"
        password = f"{i}{password_suffix}"
        username = email  # Using email as username

        user, created = User.objects.get_or_create(username=username, defaults={'email': email})
        if created:
            user.set_password(password)
            user.save()
            print(f"Created user: {email} with password: {password}")
        else:
            # Update password if user already exists
            user.set_password(password)
            user.email = email
            user.save()
            print(f"Updated user: {email} with new password: {password}")

if __name__ == "__main__":
    create_users()
