import cv2
import os
import numpy as np
import pickle
from flask import Flask, request, jsonify
import threading
import time
from flask_cors import CORS

# Enable CORS for the entire app

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# --- Initialize Variables and Directories ---
training_data_dir = "training_data"
os.makedirs(training_data_dir, exist_ok=True)

# Initialize the Haar Cascade and Recognizer
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
recognizer = cv2.face.LBPHFaceRecognizer_create()

# Sample in-memory store for picked objects (for demonstration)
picked_objects_data = []

@app.route('/log-picked-object', methods=['POST'])
def log_picked_object():
    """
    Accepts a POST request with the user_id and picked_object info and logs it.
    """
    data = request.get_json()  # Get the JSON payload
    user_id = data.get('user_id')

    if not user_id or not picked_object:
        return jsonify({"error": "User ID and picked object are required"}), 400

    # Log the picked object (this could be saved to a database instead)
    picked_objects_data.append({"user_id": user_id})
    print(f"Logged: User ID: {user_id}")

    return jsonify({"message": "Picked object logged successfully"}), 200

def run_flask():
    """
    Run the Flask app in a separate thread.
    """
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)

def detect_bottle(frame):
    """
    Function to detect water bottles (in a specific color range).
    """
    lower_bound = np.array([150, 50, 50])  # Adjust for light pink to red
    upper_bound = np.array([180, 255, 255])  # Adjust for darker shades of pink/red

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower_bound, upper_bound)
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    objects = []

    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 500:
            x, y, w, h = cv2.boundingRect(contour)
            aspect_ratio = h / w if w != 0 else 0
            if 2.0 < aspect_ratio < 6.0:
                objects.append((x, y, w, h))
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
                cv2.putText(frame, "Water Bottle", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    return frame, mask, objects

def run_opencv():
    """
    Function to run the OpenCV webcam capture, face recognition, and object detection.
    """
    recognizer.read(r'models\trainer.yml')
    with open('models/label_to_user.pkl', 'rb') as f:
        label_to_user = pickle.load(f)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    cap = cv2.VideoCapture(0)  # Use webcam
    margin = 1.75
    picked_object = False
    start = None
    waittime = 3

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        # --- Detect Bottle ---
        result_frame, mask, objects = detect_bottle(frame)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))

        for (x, y, w, h) in faces:
            face = gray[y:y+h, x:x+w]
            label, confidence = recognizer.predict(face)
            user_id = label_to_user.get(label, "Unknown")

            cv2.rectangle(result_frame, (x, y), (x + w, y + h), (0, 255, 255), 2)
            cv2.putText(result_frame, f"{user_id} ({confidence:.2f})", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

            for (obj_x, obj_y, obj_w, obj_h) in objects:
                if obj_y > y + h and obj_x >= (x - int(w * 1 / margin)) and (obj_x + obj_w) <= (x + int(margin * w)):
                    if start is not None and time.time()-start<waittime:
                        start = None
                    cv2.putText(result_frame, f"{user_id}'s Object", (obj_x, obj_y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                    cv2.rectangle(result_frame, (obj_x, obj_y), (obj_x + obj_w, obj_y + obj_h), (0, 0, 255), 2)
                    picked_object = True
                    # Directly log the picked object to Flask's route function
                elif picked_object==True and start is None:
                    start = time.time()
                    
                elif start is not None and time.time()-start>waittime:
                    log_picked_object_internal(user_id)
                    cap.release()
                    cv2.destroyAllWindows()
                    break
                if start is not None:
                    print(time.time()-start)
                time.sleep(0.01)

        # Show the result
        cv2.imshow("Combined Detection", result_frame)
        cv2.imshow("Bottle Mask", mask)

        # Exit on pressing 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release resources
    cap.release()
    cv2.destroyAllWindows()

def log_picked_object_internal(user_id):
    """
    Directly log picked object data without using HTTP requests.
    """
    # Log the picked object (this could be saved to a database instead)
    picked_objects_data.append({"user_id": user_id})
    print(f"Logged: User ID: {user_id}  bought a bottle")
    print("50 rupees deducted from your wallet...")
    

if __name__ == '__main__':
    # Start Flask server in a separate thread
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.daemon = True
    flask_thread.start()

    # Start OpenCV program in the main thread
    run_opencv()