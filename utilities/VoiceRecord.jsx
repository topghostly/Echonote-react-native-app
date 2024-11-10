import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import AudioRecord from "react-native-audio-record";

const VoiceRecorder = () => {
  const [amplitude, setAmplitude] = useState(0); // State to hold amplitude level
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    // Configure AudioRecord
    AudioRecord.init({
      sampleRate: 16000, // Audio frequency (adjust as needed)
      channels: 1, // Mono channel
      bitsPerSample: 16,
      audioSource: 6, // Microphone
      wavFile: "voice-message.wav",
    });

    // Listener for real-time data
    AudioRecord.on("data", (data) => {
      const buffer = Buffer.from(data, "base64");
      const currentAmplitude = calculateAmplitude(buffer);
      setAmplitude(currentAmplitude); // Update amplitude level
    });

    return () => {
      AudioRecord.stop();
    };
  }, []);

  const startRecording = () => {
    setRecording(true);
    AudioRecord.start();
  };

  const stopRecording = () => {
    setRecording(false);
    AudioRecord.stop();
    setAmplitude(0); // Reset amplitude
  };

  // Calculate the amplitude from the buffer
  const calculateAmplitude = (buffer) => {
    let sum = 0;
    for (let i = 0; i < buffer.length; i += 2) {
      const value = buffer.readInt16LE(i);
      sum += Math.abs(value);
    }
    return sum / (buffer.length / 2); // Average amplitude
  };

  return (
    <View style={{ alignItems: "center", padding: 20 }}>
      <Text>Amplitude: {amplitude}</Text>
      <View
        style={{
          height: 50,
          width: amplitude, // Adjust width based on amplitude
          backgroundColor: "green",
          marginVertical: 10,
        }}
      />
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
};

export default VoiceRecorder;
