from django.conf import settings


def allauth_settings(request):
    """Expose some settings from django-allauth in templates."""
    return {
        "ACCOUNT_ALLOW_REGISTRATION": settings.ACCOUNT_ALLOW_REGISTRATION,
    }


def base_template(request):
    if request.user.is_authenticated:
        return {"base_template": "base_authenticated.html"}
    return {"base_template": "base_unauthenticated.html"}
