# Generated by Django 2.1.5 on 2019-05-17 22:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaign', '0009_campaign_mailtrack'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='bcc',
            field=models.TextField(blank=True, default=''),
        ),
    ]
