#include <washer.h>

typedef struct appdata {
	Evas_Object *win;
	Evas_Object *conform;
} appdata_s;

static void
win_delete_request_cb(void *data, Evas_Object *obj, void *event_info)
{
	ui_app_exit();
}

static void
win_back_cb(void *data, Evas_Object *obj, void *event_info)
{
	appdata_s *ad = data;
	/* Let window go to hide state. */
	elm_win_lower(ad->win);
}

typedef enum _REQUEST_TYPE {
	REQUEST_LAUNDRY_MAIN,
	REQUEST_LAUNDRY_EXPAND,
	REQUEST_ADD_LAUNDRY
} REQUEST_TYPE;

struct PathData {
	Evas_Object *nf;
	char *edj_path;
	Evas_Object *laundry_list;
} main_obj;

typedef struct _LaundryData {
	char img_path[FILENAME_MAX];
	char texture[21];
	int worn_count;
	char schedule[11];
	char user_name[21];
} LaundryData;

Evas_Object *delete_layout;

int socket_done;
int family_id;
char laundry_rfid[RFID_SIZE];
LaundryData laundry_data[MAX_LAUNDRY];
int laundry_count;

pthread_mutex_t mtx_socket;
pthread_mutex_t mtx_write;
pthread_mutex_t mtx_read;
pthread_cond_t cv_socket;
pthread_cond_t cv_write;
pthread_cond_t cv_read;

REQUEST_TYPE request;

static peripheral_i2c_h i2c_h;

void server_connect(int);
void socket_init();
void socket_send(void*);
void socket_recv(void*);
static int i2c_init();
void rfid_i2c();
size_t write_data(void*, size_t, size_t, FILE*);
void set_image(Evas_Object*, char*);
void add_laundry_rfid(char*);
void set_main_laundry_list();
static void create_base_gui(appdata_s*);
void naviframe_transition_cb(void*, Evas_Object*, void*);
void laundry_collapse_cb(void*, Evas_Object*, void*);
void laundry_expand_cb(void*, Evas_Object*, void*);

void server_connect(int sockfd) {
	JsonObject *root = json_object_new();

	json_object_set_string_member(root, "requestName", "connectWasher");
	json_object_set_int_member(root, "washerId", 111);

	char buf[BUF_SIZE];
	JsonNode *node = json_node_new(JSON_NODE_OBJECT);
	json_node_set_object(node, root);
	memset(buf, 0, BUF_SIZE);
	char *json_str = json_to_string(node, FALSE);
	int len = strlen(json_str);
	strncpy(buf, json_str, BUF_SIZE);
	buf[len] = '\n';
	buf[len + 1] = 0;
	write(sockfd, buf, strlen(buf));
	json_object_unref(root);
	json_node_free(node);

	memset(buf, 0, BUF_SIZE);
	read(sockfd, buf, BUF_SIZE);

	JsonParser *parser = json_parser_new();
	gboolean ret = json_parser_load_from_data(parser, buf, -1, NULL);
	root = json_node_get_object(json_parser_get_root(parser));

	family_id = json_object_get_int_member(root, "familyId");
	json_object_unref(root);
}

void socket_init() {
	static connection_h connection;
	int error_code;

	error_code = connection_create(&connection);
	if (error_code != CONNECTION_ERROR_NONE) {
		dlog_print(DLOG_ERROR, LOG_TAG, "connection_error");

		exit(1);
	}

	// check connection is available
	connection_type_e net_state;
	error_code = connection_get_type(connection, &net_state);
	if (error_code != CONNECTION_ERROR_NONE || net_state == CONNECTION_TYPE_DISCONNECTED) {
		dlog_print(DLOG_ERROR, LOG_TAG, "Not connected %d\n", error_code);
		connection_destroy(connection);

		exit(1);
	}

	// check get connection profile
	char* local_ipv4 = NULL;
	connection_profile_h profile_h = NULL;
	int rv = connection_get_current_profile(connection, &profile_h);
	if (rv != CONNECTION_ERROR_NONE) {
		dlog_print(DLOG_INFO, LOG_TAG, "Failed to get profile handle %d\n", rv);
		connection_destroy(connection);
		free(local_ipv4);

		exit(1);
	}

	// get IPv4 address
	int ip_type = -1;
	rv = connection_profile_get_ip_address(profile_h, CONNECTION_ADDRESS_FAMILY_IPV4, &local_ipv4);
	if (rv == CONNECTION_ERROR_NONE && strcmp(local_ipv4, "0.0.0.0") != 0) {
		ip_type = CONNECTION_ADDRESS_FAMILY_IPV4;
		dlog_print(DLOG_INFO, LOG_TAG, "IPv4 address: %s\n", local_ipv4);
	}

	if (ip_type != CONNECTION_ADDRESS_FAMILY_IPV6
		&& ip_type != CONNECTION_ADDRESS_FAMILY_IPV4) {
		dlog_print(DLOG_INFO, LOG_TAG, "No IP address!\n");
		connection_profile_destroy(profile_h);
		connection_destroy(connection);
		free(local_ipv4);

		exit(1);
	}

	char* interface_name = NULL;
	connection_profile_get_network_interface_name(profile_h, &interface_name);
	dlog_print(DLOG_INFO, LOG_TAG, "Interface Name: %s\n", interface_name);

	struct addrinfo hints;
	struct addrinfo* result;

	memset(&hints, 0x00, sizeof(struct addrinfo));

	hints.ai_family = PF_UNSPEC;
	hints.ai_socktype = SOCK_STREAM;
	hints.ai_protocol = IPPROTO_TCP;

	dlog_print(DLOG_INFO, LOG_TAG, "hints : %d", hints.ai_flags);
	if (getaddrinfo("52.78.199.11", "65432", &hints, &result) != 0) {	// server ip
		dlog_print(DLOG_INFO, LOG_TAG, "getaddrinfo() error\n");
		connection_profile_destroy(profile_h);
		connection_destroy(connection);
		free(local_ipv4);
		free(interface_name);

		exit(1);
	}

	dlog_print(DLOG_INFO, LOG_TAG, "hints : %d", result->ai_flags);

	int sockfd = -1;
	struct addrinfo* rp;

	rp = result;

	int ret_val = EAI_BADFLAGS;
	for (rp = result; rp != NULL; rp = rp->ai_next) {
		if (rp->ai_family == AF_INET && ip_type == CONNECTION_ADDRESS_FAMILY_IPV4) {
			if ((sockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
				dlog_print(DLOG_INFO, LOG_TAG, "socket error\n");
				break;
			}

			if ((ret_val = connect(sockfd, rp->ai_addr, rp->ai_addrlen)) < 0) {
				dlog_print(DLOG_INFO, LOG_TAG, "connect() error: %d %s\n", ret_val, strerror(errno));
				break;
			}

			dlog_print(DLOG_INFO, LOG_TAG, "IPv4\n");
		}
		else if (rp->ai_family == AF_INET6 && ip_type == CONNECTION_ADDRESS_FAMILY_IPV6) {
			if ((sockfd = socket(AF_INET6, SOCK_STREAM, 0)) < 0) {
				dlog_print(DLOG_INFO, LOG_TAG, "socket error\n");
				freeaddrinfo(result);
			}
			dlog_print(DLOG_INFO, LOG_TAG, "IPv6\n");
		}
	}

	if (sockfd >= 0) {
		server_connect(sockfd);

		pthread_mutex_init(&mtx_write, NULL);
		pthread_mutex_init(&mtx_read, NULL);

		pthread_cond_init(&cv_write, NULL);
		pthread_cond_init(&cv_read, NULL);

		pthread_mutex_lock(&mtx_socket);
		socket_done = 1;
		pthread_cond_signal(&cv_socket);
		pthread_mutex_unlock(&mtx_socket);

		pthread_t send_thread;
		pthread_t recv_thread;

		pthread_create(&send_thread, NULL, socket_send, (void*)&sockfd);
		pthread_create(&recv_thread, NULL, socket_recv, (void*)&sockfd);

		pthread_join(send_thread, NULL);
		pthread_join(recv_thread, NULL);

		close(sockfd);
	}

	freeaddrinfo(result);

	connection_profile_destroy(profile_h);
	connection_destroy(connection);
	free(local_ipv4);
	free(interface_name);
}

void socket_send(void *data) {
	int sockfd = *(int*)data;
	int request_number = 0;
	char send_buf[BUF_SIZE];

	pthread_mutex_lock(&mtx_write);
	while(true){
		pthread_cond_wait(&cv_write, &mtx_write);

		JsonObject *root = json_object_new();
		request_number++;

		if(request == REQUEST_LAUNDRY_MAIN){
			json_object_set_string_member(root, "requestName", "getMainLaundryList");
			json_object_set_int_member(root, "familyId", family_id);
			json_object_set_int_member(root, "requestNumber", request_number);
		}
		else if(request == REQUEST_LAUNDRY_EXPAND){
			json_object_set_string_member(root, "requestName", "getAllLaundryList");
			json_object_set_int_member(root, "familyId", family_id);
			json_object_set_int_member(root, "requestNumber", request_number);
		}
		else if(request == REQUEST_ADD_LAUNDRY){
			json_object_set_string_member(root, "requestName", "addLaundry");
			json_object_set_int_member(root, "familyId", family_id);
			json_object_set_string_member(root, "rfidUid", laundry_rfid);
		}

		JsonNode *node = json_node_new(JSON_NODE_OBJECT);
		json_node_set_object(node, root);
		memset(send_buf, 0, BUF_SIZE);
		char *json_str = json_to_string(node, FALSE);
		int len = strlen(json_str);
		strncpy(send_buf, json_str, BUF_SIZE);
		send_buf[len] = '\n';
		send_buf[len + 1] = 0;

		write(sockfd, send_buf, strlen(send_buf));
		dlog_print(DLOG_INFO, LOG_TAG, "%s", send_buf);

		json_object_unref(root);
		json_node_free(node);
	}
}

void socket_recv(void *data) {
	int sockfd = *(int*)data;
	char recv_buf[BUF_SIZE];

	while(true){
		memset(recv_buf, 0, BUF_SIZE);
		int recv_len = read(sockfd, recv_buf, BUF_SIZE);
		dlog_print(DLOG_INFO, LOG_TAG, "%s", recv_buf);
		if(recv_len == 0){
			break;
		}

		pthread_mutex_lock(&mtx_read);

		JsonParser *parser = json_parser_new();
		gboolean ret = json_parser_load_from_data(parser, recv_buf, -1, NULL);
		JsonObject *root = json_node_get_object(json_parser_get_root(parser));

		if(request == REQUEST_LAUNDRY_MAIN){
			laundry_count = json_object_get_int_member(root, "count");
			JsonArray *result = json_object_get_array_member(root, "result");
			for(int i = 0; i < laundry_count; i++){
				JsonObject *cur = json_array_get_object_element(result, i);
				strncpy(laundry_data[i].img_path, json_object_get_string_member(cur, "image"), FILENAME_MAX);
				strncpy(laundry_data[i].texture, json_object_get_string_member(cur, "texture"), 21);
				laundry_data[i].worn_count = json_object_get_int_member(cur, "wornCount");
				memset(laundry_data[i].schedule, 0, 11);
				memset(laundry_data[i].user_name, 0, 21);
//				strncpy(laundry_data[i].schedule, json_object_get_string_member(cur, "schedule"), 11);
//				strncpy(laundry_data[i].user_name, json_object_get_string_member(cur, "userName"), 21);
			}
		}
		else if(request == REQUEST_LAUNDRY_EXPAND){
			laundry_count = json_object_get_int_member(root, "count");
			JsonArray *result = json_object_get_array_member(root, "result");
			for(int i = 0; i < laundry_count; i++){
				JsonObject *cur = json_array_get_object_element(result, i);
				strncpy(laundry_data[i].img_path, json_object_get_string_member(cur, "image"), FILENAME_MAX);
				strncpy(laundry_data[i].texture, json_object_get_string_member(cur, "texture"), 21);
				laundry_data[i].worn_count = json_object_get_int_member(cur, "wornCount");
				memset(laundry_data[i].schedule, 0, 11);
				memset(laundry_data[i].user_name, 0, 21);
//				strncpy(laundry_data[i].schedule, json_object_get_string_member(cur, "schedule"), 11);
//				strncpy(laundry_data[i].user_name, json_object_get_string_member(cur, "userName"), 21);
			}
		}

		pthread_cond_signal(&cv_read);
		pthread_mutex_unlock(&mtx_read);

		json_object_unref(root);
	}
}

static int i2c_init() {
	int bus = 1;
	int address = 0x08;   /* See the specification */

	int ret = peripheral_i2c_open(bus, address, &i2c_h);
	if(ret != PERIPHERAL_ERROR_NONE) {
		dlog_print(DLOG_ERROR, "MY_TAG", "INIT ERROR %d", ret);
		return false;
	}
	else {
		dlog_print(DLOG_INFO, "MY_TAG", "OPEN");
	}

	return true;
}

void rfid_i2c() {
	if(!i2c_init()) {
		dlog_print(DLOG_INFO, LOG_TAG, "i2c fail");
		peripheral_i2c_close(i2c_h);
		return;
	}

	int ret;

	uint8_t recv[4] = {0x05, 0x05, 0x05, 0x05};
	uint32_t recv_len = 4;

	unsigned long long before = 16843009ull;
	while(1) {
		int step = 0;
		memset(recv, 0, recv_len);
		ret = peripheral_i2c_read(i2c_h, recv, recv_len);
		if(ret == PERIPHERAL_ERROR_NONE){
			unsigned long long ruid = 0ull;
			for(int i = 0; i < recv_len; i++){
				ruid = (ruid << 8) | recv[i];
			}

			if(before != ruid){
				if(ruid != 16843009ull){
					char rfid_uid[RFID_SIZE] = { 0, };
					snprintf(rfid_uid, RFID_SIZE, "%llu", ruid);

					ecore_main_loop_thread_safe_call_sync(add_laundry_rfid, &rfid_uid);
				}

				before = ruid;
			}
		}
		usleep(1000000);
	}
}

size_t write_data(void *ptr, size_t size, size_t nmemb, FILE *stream) {
    return fwrite(ptr, size, nmemb, stream);
}

void set_image(Evas_Object *img, char *url) {
    CURL *curl;
    FILE *fp;
    CURLcode res;

    static int img_num = 1;
    char outfilename[FILENAME_MAX] = {0};
    snprintf(outfilename, FILENAME_MAX, "%s%s%d%s", app_get_data_path(), "test", img_num++, ".png");

    curl = curl_easy_init();
    if (curl) {
        fp = fopen(outfilename,"wb");
        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        fclose(fp);

    	elm_image_file_set(img, outfilename, NULL);
    }
}

void add_laundry_rfid(char *rfid_uid) {
	pthread_mutex_lock(&mtx_write);
	request = REQUEST_ADD_LAUNDRY;
	strncpy(laundry_rfid, rfid_uid, RFID_SIZE);
	pthread_cond_signal(&cv_write);
	pthread_mutex_unlock(&mtx_write);

	pthread_mutex_lock(&mtx_read);
	// wait socket
	pthread_cond_wait(&cv_read, &mtx_read);
	pthread_mutex_unlock(&mtx_read);

	set_main_laundry_list();
}

void set_main_laundry_list() {
	elm_box_clear(main_obj.laundry_list);

	pthread_mutex_lock(&mtx_write);
	request = REQUEST_LAUNDRY_MAIN;
	pthread_cond_signal(&cv_write);
	pthread_mutex_unlock(&mtx_write);

	pthread_mutex_lock(&mtx_read);
	// check already read
	pthread_cond_wait(&cv_read, &mtx_read);

	char laundry_detail_name[3][100] = { "소재", "오염도", "일정" };
	char laundry_detail_css_title[100] = "<color=#A5A5A5FF font_size=27>%s</color>";
	char laundry_detail_css_content[3][100] = {
			"<color=#EFEFEFFF font_size=32>%s</color>",
			"<color=#EFEFEFFF font_size=32>%d</color>",
			"<color=#EFEFEFFF font_size=32>%s<br>%s</color>"
	};

	for(int i = 0; i < laundry_count; i++){
		// laundry wrapper
		Evas_Object *laundry_wrapper = elm_layout_add(main_obj.laundry_list);
		evas_object_size_hint_min_set(laundry_wrapper, 300, 600);
		elm_layout_file_set(laundry_wrapper, main_obj.edj_path, "laundry_wrapper");
		elm_box_pack_end(main_obj.laundry_list, laundry_wrapper);
		evas_object_show(laundry_wrapper);

		// laundry box
		Evas_Object *laundry = elm_box_add(laundry_wrapper);
		elm_box_align_set(laundry, 0.5, 0);
		elm_box_padding_set(laundry, 0, 30);
		elm_layout_content_set(laundry_wrapper, "elm.swallow.content", laundry);
		evas_object_show(laundry);

		Evas_Object *laundry_img_wrapper = elm_layout_add(laundry);
		elm_layout_file_set(laundry_img_wrapper, main_obj.edj_path, "image_wrapper");
		evas_object_size_hint_min_set(laundry_img_wrapper, 200, 200);
		evas_object_size_hint_max_set(laundry_img_wrapper, 200, 200);
		elm_box_pack_end(laundry, laundry_img_wrapper);
		evas_object_show(laundry_img_wrapper);

		// laundry image
		Evas_Object *laundry_img = elm_image_add(laundry_img_wrapper);
		set_image(laundry_img, laundry_data[i].img_path);
		evas_object_size_hint_weight_set(laundry_img, EVAS_HINT_EXPAND, EVAS_HINT_EXPAND);
		evas_object_size_hint_align_set(laundry_img, EVAS_HINT_FILL, EVAS_HINT_FILL);
		elm_layout_content_set(laundry_img_wrapper, "elm.swallow.content", laundry_img);
		evas_object_show(laundry_img);

		// laundry info table
		Evas_Object *laundry_detail_table = elm_table_add(laundry);
		evas_object_size_hint_weight_set(laundry_detail_table, EVAS_HINT_EXPAND, 0);
		evas_object_size_hint_align_set(laundry_detail_table, 0, 0);
		elm_table_padding_set(laundry_detail_table, 15, 0);
		elm_box_pack_end(laundry, laundry_detail_table);
		evas_object_show(laundry_detail_table);

		for (int row = 0; row < 3; row++) {
			for (int col = 0; col < 2; col++) {
				// laundry data - title or data
				Evas_Object *laundry_detail_label = elm_label_add(laundry_detail_table);
				evas_object_size_hint_align_set(laundry_detail_label, 0, 0.5);
				char content[200];
				if(col == 0){
					snprintf(content, 200, laundry_detail_css_title, laundry_detail_name[row]);
				}
				else{
					switch(row){
					case 0:
						snprintf(content, 200, laundry_detail_css_content[row], laundry_data[i].texture);
						break;
					case 1:
						snprintf(content, 200, laundry_detail_css_content[row], laundry_data[i].worn_count);
						break;
					case 2:
						snprintf(content, 200, laundry_detail_css_content[row], laundry_data[i].schedule, laundry_data[i].user_name);
						break;
					}	// end switch-case
				}
				elm_object_text_set(laundry_detail_label, content);
				elm_table_pack(laundry_detail_table, laundry_detail_label, col, row, 1, 1);
				evas_object_show(laundry_detail_label);
			}
		}
	}

	pthread_mutex_unlock(&mtx_read);
}

static void
create_base_gui(appdata_s *ad)
{
	/* Window */
	/* Create and initialize elm_win.
	   elm_win is mandatory to manipulate window. */
	ad->win = elm_win_util_standard_add(PACKAGE, PACKAGE);
	elm_win_autodel_set(ad->win, EINA_TRUE);

	if (elm_win_wm_rotation_supported_get(ad->win)) {
		int rots[4] = { 0, 90, 180, 270 };
		elm_win_wm_rotation_available_rotations_set(ad->win, (const int *)(&rots), 4);
	}

	evas_object_smart_callback_add(ad->win, "delete,request", win_delete_request_cb, NULL);
	eext_object_event_callback_add(ad->win, EEXT_CALLBACK_BACK, win_back_cb, ad);

	/* Conformant */
	/* Create and initialize elm_conformant.
	   elm_conformant is mandatory for base gui to have proper size
	   when indicator or virtual keypad is visible. */
	ad->conform = elm_conformant_add(ad->win);
	elm_win_indicator_mode_set(ad->win, ELM_WIN_INDICATOR_HIDE);
	evas_object_size_hint_weight_set(ad->conform, EVAS_HINT_EXPAND, EVAS_HINT_EXPAND);
	elm_win_resize_object_add(ad->win, ad->conform);
	evas_object_show(ad->conform);

	char *edj_path = NULL;
	app_resource_manager_get(APP_RESOURCE_TYPE_LAYOUT, "edje_res/sample.edj", &edj_path);
	elm_theme_extension_add(NULL, edj_path);

	char *expand_path = NULL;
	app_resource_manager_get(APP_RESOURCE_TYPE_IMAGE, "expand.png", &expand_path);
	main_obj.edj_path = edj_path;

	/*
	 * 	naviframe
	 */
	Evas_Object *nf = elm_naviframe_add(ad->conform);
	elm_object_content_set(ad->conform, nf);
	evas_object_smart_callback_add(nf, "transition,finished", naviframe_transition_cb, NULL);
	evas_object_show(nf);
	main_obj.nf = nf;

	/*
	 *	main view with background
	 */
	Evas_Object *main_layout = elm_layout_add(nf);
	elm_layout_file_set(main_layout, edj_path, "main_layout");
	elm_naviframe_item_push(nf, NULL, NULL, NULL, main_layout, NULL);
	Elm_Object_Item *main_item = elm_naviframe_top_item_get(nf);
	elm_naviframe_item_title_enabled_set(main_item, EINA_FALSE, EINA_FALSE);
	elm_box_align_set(main_layout, 0.5, 0.5);

	// menu vertical scroller
	Evas_Object *menu_scroller = elm_scroller_add(main_layout);
	elm_object_style_set(menu_scroller, "menu_scroller");
	evas_object_size_hint_max_set(menu_scroller, 0, 759);
	elm_layout_content_set(main_layout, "elm.swallow.content", menu_scroller);
	evas_object_show(menu_scroller);

	// menu box
	Evas_Object *menu_box = elm_box_add(menu_scroller);
	elm_box_horizontal_set(menu_box, EINA_TRUE);
	elm_box_padding_set(menu_box, 100, 0);
	elm_layout_content_set(menu_scroller, "elm.swallow.content", menu_box);
	evas_object_size_hint_align_set(menu_box, 0, 0.5);
	evas_object_show(menu_box);

	/*
	 * 	course box wrapper layout
	 */
	Evas_Object *course_box_wrapper = elm_layout_add(menu_box);
	elm_layout_file_set(course_box_wrapper, edj_path, "box_wrapper");
	evas_object_size_hint_min_set(course_box_wrapper, 750, 759);
	elm_box_pack_end(menu_box, course_box_wrapper);
	evas_object_show(course_box_wrapper);

	// course box
	Evas_Object *course_box = elm_box_add(course_box_wrapper);
	elm_layout_content_set(course_box_wrapper, "elm.swallow.content", course_box);
	elm_box_padding_set(course_box, 0, 25);
	evas_object_show(course_box);

	// course - top menu box
	Evas_Object *course_menu_box = elm_box_add(course_box);
	evas_object_size_hint_align_set(course_menu_box, EVAS_HINT_FILL, 0);
	elm_box_horizontal_set(course_menu_box, EINA_TRUE);
	elm_box_pack_end(course_box, course_menu_box);
	evas_object_show(course_menu_box);

	// course - top menu - label
	Evas_Object *course_menu_label = elm_label_add(course_menu_box);
	elm_object_text_set(course_menu_label, "<color=#ABABABFF font_size=55 font_weight=BOLD>코스</color>");
	elm_box_pack_end(course_menu_box, course_menu_label);
	evas_object_show(course_menu_label);

	// course - top menu - empty layout for padding
	Evas_Object *course_menu_empty = elm_layout_add(course_menu_box);
	evas_object_size_hint_weight_set(course_menu_empty, EVAS_HINT_EXPAND, 0);
	elm_box_pack_end(course_menu_box, course_menu_empty);
	evas_object_show(course_menu_empty);

	// course - top menu - expand button
	Evas_Object *course_expand_btn = elm_button_add(course_menu_box);
	elm_object_style_set(course_expand_btn, "expand_button");
	evas_object_size_hint_min_set(course_expand_btn, 80, 80);
	Evas_Object *course_expand_btn_img = elm_image_add(course_expand_btn);
	elm_image_file_set(course_expand_btn_img, expand_path, NULL);
	elm_object_part_content_set(course_expand_btn, "icon", course_expand_btn_img);
	elm_box_pack_end(course_menu_box, course_expand_btn);
	evas_object_show(course_expand_btn);


	// course - list box
	Evas_Object *course_list_box = elm_box_add(course_box);
	elm_box_horizontal_set(course_list_box, EINA_TRUE);
	elm_box_padding_set(course_list_box, 50, 0);
	elm_box_pack_end(course_box, course_list_box);
	evas_object_show(course_list_box);

	// dummy data
	char course_img_names[2][100] = { "course_ai.png", "course_standard.png" };
	char course_names[2][100] = { "AI 맞춤", "표준" };
	char course_css[100] = "<color=#CFCFCF font_size=45 font_weight=BOLD>%s</color>";

	for(int i = 0; i < 2; i++){
		// course wrapper
		Evas_Object *course_wrapper = elm_layout_add(course_list_box);
		evas_object_size_hint_min_set(course_wrapper, 300, 600);
		elm_layout_file_set(course_wrapper, edj_path, "course_wrapper");
		elm_box_pack_end(course_list_box, course_wrapper);
		evas_object_show(course_wrapper);

		// course box
		Evas_Object *course = elm_box_add(course_wrapper);
		elm_box_align_set(course, 0.5, 0);
		elm_box_padding_set(course, 0, 20);
		elm_layout_content_set(course_wrapper, "elm.swallow.content", course);
		evas_object_show(course);

		// course image wrapper
		Evas_Object *course_image_wrapper = elm_layout_add(course);
		elm_layout_file_set(course_image_wrapper, edj_path, "course_image_wrapper");
		elm_box_pack_end(course, course_image_wrapper);
		evas_object_size_hint_align_set(course_image_wrapper, 0, 0.5);
		evas_object_show(course_image_wrapper);

		// course image
		char *course_img_path = NULL;
		app_resource_manager_get(APP_RESOURCE_TYPE_IMAGE, course_img_names[i], &course_img_path);
		Evas_Object *course_image = elm_image_add(course_image_wrapper);
		evas_object_size_hint_min_set(course_image, 60, 60);
		evas_object_size_hint_max_set(course_image, 60, 60);
		elm_image_file_set(course_image, course_img_path, NULL);
		elm_layout_content_set(course_image_wrapper, "elm.swallow.content", course_image);
		evas_object_show(course_image);

		// course name
		Evas_Object *course_label = elm_label_add(course);
		evas_object_size_hint_align_set(course_label, 0, 0.5);
		char content[200];
		snprintf(content, 200, course_css, course_names[i]);
		elm_object_text_set(course_label, content);
		elm_box_pack_end(course, course_label);
		evas_object_show(course_label);
	}

	/*
	 *	laundry box wrapper layout
	 */
	Evas_Object *laundry_box_wrapper = elm_layout_add(menu_box);
	elm_layout_file_set(laundry_box_wrapper, edj_path, "box_wrapper");
	evas_object_size_hint_min_set(laundry_box_wrapper, 750, 759);
	elm_box_pack_end(menu_box, laundry_box_wrapper);
	evas_object_show(laundry_box_wrapper);

	// laundry box
	Evas_Object *laundry_box = elm_box_add(laundry_box_wrapper);
	elm_layout_content_set(laundry_box_wrapper, "elm.swallow.content", laundry_box);
	elm_box_align_set(laundry_box, 0.5, 0);
	elm_box_padding_set(laundry_box, 0, 25);
	evas_object_show(laundry_box);

	// laundry - top menu box
	Evas_Object *laundry_menu_box = elm_box_add(laundry_box);
	evas_object_size_hint_align_set(laundry_menu_box, EVAS_HINT_FILL, 0);
	elm_box_horizontal_set(laundry_menu_box, EINA_TRUE);
	elm_box_pack_end(laundry_box, laundry_menu_box);
	evas_object_show(laundry_menu_box);

	// laundry - top menu - label
	Evas_Object *laundry_menu_label = elm_label_add(laundry_menu_box);
	elm_object_text_set(laundry_menu_label, "<color=#ABABABFF font_size=55 font_weight=BOLD>세탁물 확인</color>");
	elm_box_pack_end(laundry_menu_box, laundry_menu_label);
	evas_object_show(laundry_menu_label);

	// laundry - top menu - empty layout for padding
	Evas_Object *laundry_menu_empty = elm_layout_add(laundry_menu_box);
	evas_object_size_hint_weight_set(laundry_menu_empty, EVAS_HINT_EXPAND, 0);
	elm_box_pack_end(laundry_menu_box, laundry_menu_empty);
	evas_object_show(laundry_menu_empty);

	// laundry - top menu - expand button
	Evas_Object *laundry_expand_btn = elm_button_add(laundry_menu_box);
	elm_object_style_set(laundry_expand_btn, "expand_button");
	evas_object_size_hint_min_set(laundry_expand_btn, 80, 80);
	Evas_Object *laundry_expand_btn_img = elm_image_add(laundry_expand_btn);
	elm_image_file_set(laundry_expand_btn_img, expand_path, NULL);
	elm_object_part_content_set(laundry_expand_btn, "icon", laundry_expand_btn_img);
	elm_box_pack_end(laundry_menu_box, laundry_expand_btn);
	evas_object_show(laundry_expand_btn);
	evas_object_smart_callback_add(laundry_expand_btn, "clicked", laundry_expand_cb, NULL);

	// laundry - list box
	Evas_Object *laundry_list_box = elm_box_add(laundry_box);
	evas_object_size_hint_weight_set(laundry_list_box, EVAS_HINT_EXPAND, EVAS_HINT_EXPAND);
	evas_object_size_hint_align_set(laundry_list_box, EVAS_HINT_FILL, EVAS_HINT_FILL);
	elm_box_horizontal_set(laundry_list_box, EINA_TRUE);
	elm_box_align_set(laundry_list_box, 0, 0);
	elm_box_padding_set(laundry_list_box, 50, 0);
	elm_box_pack_end(laundry_box, laundry_list_box);
	evas_object_show(laundry_list_box);
	main_obj.laundry_list = laundry_list_box;

	set_main_laundry_list();

	/*
	 *	notification(empty) box
	 */
	Evas_Object *notification_box_wrapper = elm_layout_add(menu_box);
	elm_layout_file_set(notification_box_wrapper, edj_path, "box_wrapper");
	evas_object_size_hint_min_set(notification_box_wrapper, 750, 759);
	elm_box_pack_end(menu_box, notification_box_wrapper);
	evas_object_show(notification_box_wrapper);

	// notification - label
	Evas_Object *notification_menu_label = elm_label_add(notification_box_wrapper);
	elm_object_text_set(notification_menu_label, "<color=#ABABABFF font_size=55 font_weight=BOLD>알림</color>");
	elm_layout_content_set(notification_box_wrapper, "elm.swallow.content", notification_menu_label);
	evas_object_size_hint_align_set(notification_menu_label, 0.5, 0);
	evas_object_show(notification_menu_label);

	/* Show window after base gui is set up */
	evas_object_show(ad->win);
}

void naviframe_transition_cb(void *data, Evas_Object *obj, void *event_info) {
	if(delete_layout != NULL){
		evas_object_del(delete_layout);
		delete_layout = NULL;
	}
}

void laundry_collapse_cb(void *data, Evas_Object *obj, void *event_info) {
	set_main_laundry_list();

	Elm_Object_Item *top_item = elm_naviframe_top_item_get(main_obj.nf);
	delete_layout = elm_object_item_content_get(top_item);
	elm_naviframe_item_pop(main_obj.nf);
}

void laundry_expand_cb(void *data, Evas_Object *obj, void *event_info) {
	/*
	 *	laundry expand view
	 */
	Evas_Object *laundry_layout = elm_layout_add(main_obj.nf);
	elm_layout_file_set(laundry_layout, main_obj.edj_path, "main_layout");
	elm_naviframe_item_push(main_obj.nf, "laundry", NULL, NULL, laundry_layout, NULL);
	Elm_Object_Item *main_item = elm_naviframe_top_item_get(main_obj.nf);
	elm_naviframe_item_title_enabled_set(main_item, EINA_FALSE, EINA_FALSE);
	elm_box_align_set(laundry_layout, 0.5, 0.5);

	Evas_Object *laundry_box_wrapper = elm_layout_add(laundry_layout);
	elm_layout_file_set(laundry_box_wrapper, main_obj.edj_path, "box_wrapper");
	evas_object_size_hint_min_set(laundry_box_wrapper, 1500, 759);
	evas_object_size_hint_max_set(laundry_box_wrapper, 1500, 759);
	elm_layout_content_set(laundry_layout, "elm.swallow.content", laundry_box_wrapper);
	evas_object_show(laundry_box_wrapper);

	Evas_Object *laundry_box = elm_box_add(laundry_box_wrapper);
	elm_layout_content_set(laundry_box_wrapper, "elm.swallow.content", laundry_box);
	elm_box_padding_set(laundry_box, 0, 25);
	evas_object_size_hint_weight_set(laundry_box, 0, EVAS_HINT_EXPAND);
	evas_object_size_hint_align_set(laundry_box, 0, EVAS_HINT_FILL);
	elm_box_align_set(laundry_box, 0.5, 0);
	evas_object_show(laundry_box);

	Evas_Object *laundry_menu_box = elm_box_add(laundry_box);
	evas_object_size_hint_align_set(laundry_menu_box, EVAS_HINT_FILL, 0);
	elm_box_horizontal_set(laundry_menu_box, EINA_TRUE);
	elm_box_pack_end(laundry_box, laundry_menu_box);
	evas_object_show(laundry_menu_box);

	Evas_Object *laundry_menu_label = elm_label_add(laundry_menu_box);
	elm_object_text_set(laundry_menu_label, "<color=#ABABABFF font_size=55 font_weight=BOLD>세탁물 확인</color>");
	elm_box_pack_end(laundry_menu_box, laundry_menu_label);
	evas_object_show(laundry_menu_label);

	Evas_Object *laundry_menu_empty = elm_layout_add(laundry_menu_box);
	evas_object_size_hint_weight_set(laundry_menu_empty, EVAS_HINT_EXPAND, 0);
	elm_box_pack_end(laundry_menu_box, laundry_menu_empty);
	evas_object_show(laundry_menu_empty);

	Evas_Object *laundry_collapse_btn = elm_button_add(laundry_menu_box);
	elm_object_style_set(laundry_collapse_btn, "expand_button");
	evas_object_size_hint_min_set(laundry_collapse_btn, 100, 50);
	Evas_Object *laundry_collapse_btn_img = elm_image_add(laundry_collapse_btn);
	char *collapse_path = NULL;
	app_resource_manager_get(APP_RESOURCE_TYPE_IMAGE, "collapse.png", &collapse_path);
	elm_image_file_set(laundry_collapse_btn_img, collapse_path, NULL);
	elm_object_part_content_set(laundry_collapse_btn, "icon", laundry_collapse_btn_img);
	elm_box_pack_end(laundry_menu_box, laundry_collapse_btn);
	evas_object_show(laundry_collapse_btn);
	evas_object_smart_callback_add(laundry_collapse_btn, "clicked", laundry_collapse_cb, NULL);

	Evas_Object *bg_layout = elm_layout_add(laundry_box);
	evas_object_size_hint_weight_set(bg_layout, EVAS_HINT_EXPAND, EVAS_HINT_EXPAND);
	evas_object_size_hint_align_set(bg_layout, EVAS_HINT_FILL, EVAS_HINT_FILL);
	elm_layout_file_set(bg_layout, main_obj.edj_path, "scrollbar");
	elm_box_pack_end(laundry_box, bg_layout);
	evas_object_show(bg_layout);

	Evas_Object *laundry_scroller = elm_scroller_add(bg_layout);
//	elm_object_part_content_set(laundry_scroller, "elm.dragable.vbar", )
//	elm_object_style_set(laundry_scroller, "laundry_scroller");
	evas_object_size_hint_weight_set(laundry_scroller, EVAS_HINT_EXPAND, EVAS_HINT_EXPAND);
	evas_object_size_hint_align_set(laundry_scroller, EVAS_HINT_FILL, EVAS_HINT_FILL);
	elm_scroller_policy_set(laundry_scroller, ELM_SCROLLER_POLICY_OFF, ELM_SCROLLER_POLICY_ON);
	elm_layout_content_set(bg_layout, "elm.swallow.content", laundry_scroller);
	evas_object_show(laundry_scroller);

	Evas_Object *edje = elm_layout_edje_get(laundry_scroller);
	Evas_Object *part_obj = edje_object_part_object_get(edje, "elm.dragable.vbar");
	evas_object_color_set(part_obj, 255, 0, 0, 255);

	Evas_Object *laundry_list_table = elm_table_add(laundry_scroller);
	elm_table_padding_set(laundry_list_table, 50, 20);
	elm_layout_content_set(laundry_scroller, "elm.swallow.content", laundry_list_table);
	evas_object_show(laundry_list_table);
	elm_table_align_set(laundry_list_table, 0, 0.5);

	pthread_mutex_lock(&mtx_write);
	request = REQUEST_LAUNDRY_EXPAND;
	pthread_cond_signal(&cv_write);
	pthread_mutex_unlock(&mtx_write);

	pthread_mutex_lock(&mtx_read);
	// check already read
	pthread_cond_wait(&cv_read, &mtx_read);

	char laundry_detail_name[3][100] = { "소재", "오염도", "일정" };
	char laundry_detail_css_title[100] = "<color=#A5A5A5FF font_size=27>%s</color>";
	char laundry_detail_css_content[3][100] = {
			"<color=#EFEFEFFF font_size=32>%s</color>",
			"<color=#EFEFEFFF font_size=32>%d</color>",
			"<color=#EFEFEFFF font_size=32>%s<br>%s</color>"
	};

	for(int i = 0; i < laundry_count; i++){
		Evas_Object *laundry_wrapper = elm_layout_add(laundry_list_table);
		evas_object_size_hint_min_set(laundry_wrapper, 300, 600);
		elm_layout_file_set(laundry_wrapper, main_obj.edj_path, "laundry_wrapper");
		elm_table_pack(laundry_list_table, laundry_wrapper, i % 4, i / 4, 1, 1);
		evas_object_show(laundry_wrapper);

		Evas_Object *laundry = elm_box_add(laundry_wrapper);
		elm_box_align_set(laundry, 0.5, 0);
		elm_box_padding_set(laundry, 0, 30);
		elm_layout_content_set(laundry_wrapper, "elm.swallow.content", laundry);
		evas_object_show(laundry);

		Evas_Object *laundry_img_wrapper = elm_layout_add(laundry);
		elm_layout_file_set(laundry_img_wrapper, main_obj.edj_path, "image_wrapper");
		evas_object_size_hint_min_set(laundry_img_wrapper, 200, 200);
		evas_object_size_hint_max_set(laundry_img_wrapper, 200, 200);
		elm_box_pack_end(laundry, laundry_img_wrapper);
		evas_object_show(laundry_img_wrapper);

		// laundry image
		Evas_Object *laundry_img = elm_image_add(laundry_img_wrapper);
		set_image(laundry_img, laundry_data[i].img_path);
		evas_object_size_hint_weight_set(laundry_img, EVAS_HINT_EXPAND, EVAS_HINT_EXPAND);
		evas_object_size_hint_align_set(laundry_img, EVAS_HINT_FILL, EVAS_HINT_FILL);
		elm_layout_content_set(laundry_img_wrapper, "elm.swallow.content", laundry_img);
		evas_object_show(laundry_img);

		Evas_Object *laundry_detail_table = elm_table_add(laundry);
		evas_object_size_hint_weight_set(laundry_detail_table, EVAS_HINT_EXPAND, 0);
		evas_object_size_hint_align_set(laundry_detail_table, 0, 0);
		elm_table_padding_set(laundry_detail_table, 15, 0);
		elm_box_pack_end(laundry, laundry_detail_table);
		evas_object_show(laundry_detail_table);

		for (int row = 0; row < 3; row++) {
			for (int col = 0; col < 2; col++) {
				// laundry data - title or data
				Evas_Object *laundry_detail_label = elm_label_add(laundry_detail_table);
				evas_object_size_hint_align_set(laundry_detail_label, 0, 0.5);
				char content[200];
				if(col == 0){
					snprintf(content, 200, laundry_detail_css_title, laundry_detail_name[row]);
				}
				else{
					switch(row){
					case 0:
						snprintf(content, 200, laundry_detail_css_content[row], laundry_data[i].texture);
						break;
					case 1:
						snprintf(content, 200, laundry_detail_css_content[row], laundry_data[i].worn_count);
						break;
					case 2:
						snprintf(content, 200, laundry_detail_css_content[row], laundry_data[i].schedule, laundry_data[i].user_name);
						break;
					}	// end switch-case
				}
				elm_object_text_set(laundry_detail_label, content);
				elm_table_pack(laundry_detail_table, laundry_detail_label, col, row, 1, 1);
				evas_object_show(laundry_detail_label);
			}
		}
	}
	pthread_mutex_unlock(&mtx_read);
}

static bool
app_create(void *data)
{
	/* Hook to take necessary actions before main event loop starts
		Initialize UI resources and application's data
		If this function returns true, the main loop of application starts
		If this function returns false, the application is terminated */
	appdata_s *ad = data;

	create_base_gui(ad);

	return true;
}

static void
app_control(app_control_h app_control, void *data)
{
	/* Handle the launch request. */
}

static void
app_pause(void *data)
{
	/* Take necessary actions when application becomes invisible. */
}

static void
app_resume(void *data)
{
	/* Take necessary actions when application becomes visible. */
}

static void
app_terminate(void *data)
{
	/* Release all resources. */
	app_resource_manager_release();
}

static void
ui_app_lang_changed(app_event_info_h event_info, void *user_data)
{
	/*APP_EVENT_LANGUAGE_CHANGED*/

	int ret;
	char *language;

	ret = app_event_get_language(event_info, &language);
	if (ret != APP_ERROR_NONE) {
		dlog_print(DLOG_ERROR, LOG_TAG, "app_event_get_language() failed. Err = %d.", ret);
		return;
	}

	if (language != NULL) {
		elm_language_set(language);
		free(language);
	}
}

static void
ui_app_orient_changed(app_event_info_h event_info, void *user_data)
{
	/*APP_EVENT_DEVICE_ORIENTATION_CHANGED*/
	return;
}

static void
ui_app_region_changed(app_event_info_h event_info, void *user_data)
{
	/*APP_EVENT_REGION_FORMAT_CHANGED*/
}

static void
ui_app_low_battery(app_event_info_h event_info, void *user_data)
{
	/*APP_EVENT_LOW_BATTERY*/
}

static void
ui_app_low_memory(app_event_info_h event_info, void *user_data)
{
	/*APP_EVENT_LOW_MEMORY*/
}

int
main(int argc, char *argv[])
{
	appdata_s ad = {0,};
	int ret = 0;

	ui_app_lifecycle_callback_s event_callback = {0,};
	app_event_handler_h handlers[5] = {NULL, };

	event_callback.create = app_create;
	event_callback.terminate = app_terminate;
	event_callback.pause = app_pause;
	event_callback.resume = app_resume;
	event_callback.app_control = app_control;

	ui_app_add_event_handler(&handlers[APP_EVENT_LOW_BATTERY], APP_EVENT_LOW_BATTERY, ui_app_low_battery, &ad);
	ui_app_add_event_handler(&handlers[APP_EVENT_LOW_MEMORY], APP_EVENT_LOW_MEMORY, ui_app_low_memory, &ad);
	ui_app_add_event_handler(&handlers[APP_EVENT_DEVICE_ORIENTATION_CHANGED], APP_EVENT_DEVICE_ORIENTATION_CHANGED, ui_app_orient_changed, &ad);
	ui_app_add_event_handler(&handlers[APP_EVENT_LANGUAGE_CHANGED], APP_EVENT_LANGUAGE_CHANGED, ui_app_lang_changed, &ad);
	ui_app_add_event_handler(&handlers[APP_EVENT_REGION_FORMAT_CHANGED], APP_EVENT_REGION_FORMAT_CHANGED, ui_app_region_changed, &ad);

	pthread_t rfid_thread;
	pthread_t socket_thread;

	pthread_create(&rfid_thread, NULL, rfid_i2c, NULL);

	socket_done = 0;
	pthread_mutex_init(&mtx_socket, NULL);
	pthread_cond_init(&cv_socket, NULL);
	pthread_create(&socket_thread, NULL, socket_init, NULL);

	ret = ui_app_main(argc, argv, &event_callback, &ad);
	if (ret != APP_ERROR_NONE) {
		dlog_print(DLOG_ERROR, LOG_TAG, "app_main() is failed. err = %d", ret);
	}

	pthread_join(rfid_thread, NULL);
	pthread_join(socket_thread, NULL);

	return ret;
}
