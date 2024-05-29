package sueprtizen.smartclothing.socket.machine.service;

import org.json.simple.JSONObject;

import java.util.List;

public interface AirdresserService {
    List<JSONObject> getAllOutfitList();

    List<JSONObject> getMainOutfitList();

    void addCareClothes(String rfid);
}
