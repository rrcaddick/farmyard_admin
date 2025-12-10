import contextlib

from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UsersConfig(AppConfig):
    name = "farmyard_admin.users"
    verbose_name = _("Users")

    def ready(self):
        with contextlib.suppress(ImportError):
            import farmyard_admin.users.signals  # noqa: F401, PLC0415
