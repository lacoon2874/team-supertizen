package sueprtizen.smartclothing.socket.global;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import sueprtizen.smartclothing.domain.clothing.service.ClothingService;
import sueprtizen.smartclothing.domain.outfit.past.service.PastOutfitService;
import sueprtizen.smartclothing.socket.clothes.service.SocketUserService;
import sueprtizen.smartclothing.socket.machine.service.AirdresserService;
import sueprtizen.smartclothing.socket.machine.service.WasherService;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.List;

@Controller
public class SocketController {

    private ServerSocket serverSocket;
    private final ApplicationContext applicationContext;

    @Autowired
    public SocketController(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public void start(int port) {
        try {
            serverSocket = new ServerSocket(port);
            while (!serverSocket.isClosed()) {
                Socket socket = serverSocket.accept();
                // 새로운 클라이언트 연결 처리
                new ClientHandler(socket, applicationContext).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void stop() {
        try {
            if (serverSocket != null) {
                serverSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 클라이언트 처리를 위한 별도의 스레드 클래스
    private static class ClientHandler extends Thread {
        private final Socket socket;
        private final ApplicationContext applicationContext;

        public ClientHandler(Socket socket, ApplicationContext applicationContext) {
            this.socket = socket;
            this.applicationContext = applicationContext;
        }

        @Override
        public void run() {

            JSONParser parser = new JSONParser();
            ObjectMapper objectMapper = new ObjectMapper();
            WasherService washerService = applicationContext.getBean(WasherService.class);
            SocketUserService userService = applicationContext.getBean(SocketUserService.class);
            ClothingService clothingService = applicationContext.getBean(ClothingService.class);
            AirdresserService airdresserService = applicationContext.getBean(AirdresserService.class);
            PastOutfitService pastOutfitService = applicationContext.getBean(PastOutfitService.class);

            try {
                BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                PrintWriter writer = new PrintWriter(new OutputStreamWriter(socket.getOutputStream()), true);

                String clientMessage;
                // 클라이언트로부터 한 줄의 문자열을 읽습니다.
                while ((clientMessage = reader.readLine()) != null) {
                    // 클라이언트가 "exit"를 보내면 연결을 종료합니다.
                    if ("exit".equalsIgnoreCase(clientMessage)) {
                        break;
                    }

                    JSONObject requestDTO = (JSONObject) parser.parse(clientMessage);
                    try {
                        String requestName = (String) requestDTO.get("requestName");
                        System.out.println(requestName.getClass().getName());
                        Long requestNumber = (Long) requestDTO.get("requestNumber");

                        JSONObject responseJson = new JSONObject();
                        responseJson.put("requestNumber", requestNumber);

                        switch (requestName) {
                            case "getMainLaundryList":
                                List<JSONObject> minLaundry = washerService.getMainLaundryList();
                                responseJson.put("count", minLaundry.size());
                                responseJson.put("result", minLaundry);
                                break;
                            case "getAllLaundryList":
                                List<JSONObject> laundry = washerService.getAllLaundryList();
                                responseJson.put("count", laundry.size());
                                responseJson.put("result", laundry);
                                break;
                            case "getMainOutfitList":
                                List<JSONObject> minOutfit = airdresserService.getMainOutfitList();
                                responseJson.put("count", minOutfit.size());
                                responseJson.put("result", minOutfit);
                                break;
                            case "getAllOutfitList":
                                List<JSONObject> outfit = airdresserService.getAllOutfitList();
                                responseJson.put("count", outfit.size());
                                responseJson.put("result", outfit);
                                break;
                            case "getUserList":
                                List<JSONObject> users = userService.getAllUsers();
                                responseJson.put("count", users.size());
                                responseJson.put("result", users);
                                break;
                            case "getClothesInfo":
                                JSONObject info = clothingService.getClothingInfo((String) requestDTO.get("rfidUid"));
                                responseJson.put("result", info);
                                break;
                            case "getClothesImage":
                                JSONObject path = clothingService.getClothingImage((String) requestDTO.get("rfidUid"));
                                responseJson.put("result", path);
                                break;
                            case "addClothes":
                                clothingService.addClothes((String) requestDTO.get("rfidUid"), (JSONArray) requestDTO.get("users"), (Long) requestDTO.get("clothesDetailId"));
                                break;
                            case "addDailyOutfit":
                                pastOutfitService.addTodayOutfit((Long) requestDTO.get("userId"), (JSONArray) requestDTO.get("clothes"));
                                break;
                            case "addLaundry":
                                washerService.addLaundry((String) requestDTO.get("rfidUid"));
                                break;
                            case "addCareClothes":
                                airdresserService.addCareClothes((String) requestDTO.get("rfidUid"));
                                break;
                        }
                        writer.println(responseJson);
                    } catch (NullPointerException e) {
                        writer.println("Bad request");
                    }

                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    socket.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}