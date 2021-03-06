# Generated by Django 2.1.5 on 2019-05-15 15:05

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('time_of_creation', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=150)),
                ('description', models.TextField(blank=True, null=True)),
                ('from_email', models.CharField(max_length=150)),
                ('in_progress', models.BooleanField(default=False)),
                ('completed', models.BooleanField(default=False)),
                ('template', models.TextField()),
                ('subject', models.CharField(default='', max_length=150)),
            ],
        ),
        migrations.CreateModel(
            name='Mail',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('time_of_creation', models.DateTimeField(auto_now_add=True)),
                ('email', models.EmailField(max_length=254)),
                ('data', models.TextField(blank=True)),
                ('try_count', models.IntegerField(default=False)),
                ('success', models.BooleanField(default=False)),
                ('error', models.TextField(blank=True)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mails', to='campaign.Campaign')),
            ],
        ),
    ]
