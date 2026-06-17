import os

from django.contrib.auth import get_user_model


def seed_default_user() -> None:
    User = get_user_model()

    email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@salespie.local").strip().lower()
    username = os.getenv("DEFAULT_ADMIN_USERNAME", "admin").strip()
    password = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin@123").strip()
    role = os.getenv("DEFAULT_ADMIN_ROLE", "admin").strip()
    employeeid = os.getenv("DEFAULT_ADMIN_EMPLOYEE_ID", "EMP001").strip()

    if (
        email
        and username
        and password
        and not User.objects.filter(email=email).exists()
        and not User.objects.filter(username=username).exists()
    ):
        User.objects.create_superuser(
            email=email,
            username=username,
            password=password,
            role=role,
            employeeid=employeeid,
        )
        print(f"Created default admin user: {email}")

    # Backward-compatible seed for the common demo login used in UI screenshots.
    legacy_email = os.getenv("LEGACY_ADMIN_EMAIL", "admin@gmail.com").strip().lower()
    legacy_username = os.getenv("LEGACY_ADMIN_USERNAME", "admin_gmail").strip()
    legacy_password = os.getenv("LEGACY_ADMIN_PASSWORD", "Admin@123").strip()

    if (
        legacy_email
        and legacy_username
        and legacy_password
        and not User.objects.filter(email=legacy_email).exists()
        and not User.objects.filter(username=legacy_username).exists()
    ):
        User.objects.create_superuser(
            email=legacy_email,
            username=legacy_username,
            password=legacy_password,
            role=role,
            employeeid="EMP002",
        )
        print(f"Created legacy admin user: {legacy_email}")


if __name__ == "__main__":
    seed_default_user()
