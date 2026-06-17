from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0022_alter_opportunity_opportunity'),
    ]

    operations = [
        migrations.CreateModel(
            name='FormSettingsStore',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(default='default', max_length=32, unique=True)),
                ('account', models.JSONField(blank=True, default=dict)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]

