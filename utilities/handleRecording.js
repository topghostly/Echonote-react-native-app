import AudioRecord from "react-native-audio-record";

// File name function
const fileName = () => {
  //
  //// naming logic here
  //
  return "test.wav";
};

// Record amplitude calculation function
const calculateAmplitude = (buffer) => {
  let sum = 0;

  for (let i = 0; i < buffer.length; i += 2) {
    const value = buffer.readInt16LE(i);
    sum += Math.abs(value);
  }

  return sum / (buffer.length / 2);
};

export const startRecording = () => {
  // Configure the audio file
  AudioRecord.init({
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: fileName(),
  });

  // Start the recording
  AudioRecord.start();

  // listening to the recording data
  AudioRecord.on("data", (data) => {
    const buffer = Buffer.from(data, "base64");

    const amplitude = calculateAmplitude(buffer);
    console.log("Amplitude", amplitude);
  });
};

// Stop the recording
export const stopRecording = () => {
  AudioRecord.stop();
};
