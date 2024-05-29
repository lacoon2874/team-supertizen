#ifndef __airdresser_H__
#define __airdresser_H__

#include <app.h>
#include <Elementary.h>
#include <system_settings.h>
#include <efl_extension.h>
#include <dlog.h>

#include <net_connection.h>
#include <sys/stat.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <net/if.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>
#include <stdlib.h>

#include <json-glib/json-glib.h>
#include <iconv.h>
#include <curl/curl.h>
#include <peripheral_io.h>

#include <app_resource_manager.h>

#define BUF_SIZE 4096
#define RFID_SIZE 20
#define MAX_OUTFIT 40
#define MAX_PROFILE 4
#define MAX_CLOTHES 10

#ifdef  LOG_TAG
#undef  LOG_TAG
#endif
#define LOG_TAG "airdresser"

#if !defined(PACKAGE)
#define PACKAGE "org.example.airdresser"
#endif

#endif /* __airdresser_H__ */
