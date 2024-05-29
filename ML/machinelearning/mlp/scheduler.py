from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from django_apscheduler.jobstores import DjangoJobStore
from .views import fine_tuning

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), 'djangojobstore')


    scheduler.add_job(
        fine_tuning,
        trigger=CronTrigger(hour=0),
        id="fine_tuning",
        max_instances=1,
    )
    scheduler.start()