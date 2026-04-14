import os
from faster_whisper import WhisperModel

def main():
    try:
        # Using base model for better quality
        model = WhisperModel('base', device='cpu', compute_type='int8')
        audio_file = 'WhatsApp Ptt 2026-04-14 at 00.29.41.ogg'
        
        if not os.path.exists(audio_file):
            print(f"Error: {audio_file} not found.")
            return

        print(f"Transcribing {audio_file} with base model...")
        segments, info = model.transcribe(audio_file, beam_size=5)
        
        print(f"Detected language: {info.language} with probability {info.language_probability}")
        
        full_text = []
        for segment in segments:
            full_text.append(segment.text)
        
        brief = '\n'.join(full_text)
        with open('brief_audio_v2.txt', 'w', encoding='utf-8') as f:
            f.write(brief)
        
        print("Success! Brief saved to brief_audio_v2.txt")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
