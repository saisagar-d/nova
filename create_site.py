import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campusbot.settings')
django.setup()

from django.contrib.sites.models import Site
from django.db.utils import IntegrityError

def create_default_site():
    site_id = 1
    domain = 'localhost'
    name = 'localhost'

    try:
        site = Site.objects.get(pk=site_id)
        print(f"Site with ID {site_id} already exists: {site.domain}")
    except Site.DoesNotExist:
        try:
            site = Site.objects.create(id=site_id, domain=domain, name=name)
            print(f"Created Site with ID {site_id}, domain '{domain}', and name '{name}'.")
        except IntegrityError as e:
            print(f"Failed to create Site: {e}")

if __name__ == "__main__":
    create_default_site()
