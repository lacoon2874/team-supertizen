package sueprtizen.smartclothing.socket.machine.service;

import org.json.simple.JSONObject;

import java.util.List;


public interface WasherService {
    List<JSONObject> getAllLaundryList();

    List<JSONObject> getMainLaundryList();

    void addLaundry(String rfid);
}
