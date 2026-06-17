from django.db import migrations, models


def copy_opportunity_description(apps, schema_editor):
    Opportunity = apps.get_model("sales", "Opportunity")
    for opportunity in Opportunity.objects.all():
        legacy_description = (opportunity.opportunity_description or "").strip()
        current_description = (opportunity.description or "").strip()
        if legacy_description and not current_description:
            opportunity.description = opportunity.opportunity_description
            opportunity.save(update_fields=["description"])


def copy_description_back(apps, schema_editor):
    Opportunity = apps.get_model("sales", "Opportunity")
    for opportunity in Opportunity.objects.all():
        legacy_description = (opportunity.opportunity_description or "").strip()
        current_description = (opportunity.description or "").strip()
        if current_description and not legacy_description:
            opportunity.opportunity_description = opportunity.description[:255]
            opportunity.save(update_fields=["opportunity_description"])


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0024_delete_formsettingsstore"),
    ]

    operations = [
        migrations.AddField(
            model_name="opportunity",
            name="description",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.RunPython(
            copy_opportunity_description,
            copy_description_back,
        ),
    ]
