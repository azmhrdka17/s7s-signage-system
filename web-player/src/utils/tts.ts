// Text-to-Speech untuk panggilan antrian
export function speakQueueNumber(queueNumber: string, loketName: string) {
  if (!window.speechSynthesis) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  // Convert number to Indonesian words
  const numberText = convertToIndonesianWords(queueNumber);
  
  const text = `Nomor antrian ${numberText}, silakan menuju ke ${loketName}`;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
  
  console.log('🔊 Speaking:', text);
}

function convertToIndonesianWords(input: string): string {
  const digits: { [key: string]: string } = {
    '0': 'kosong',
    '1': 'satu',
    '2': 'dua',
    '3': 'tiga',
    '4': 'empat',
    '5': 'lima',
    '6': 'enam',
    '7': 'tujuh',
    '8': 'delapan',
    '9': 'sembilan',
  };

  const letters: { [key: string]: string } = {
    'A': 'A',
    'B': 'Be',
    'C': 'Ce',
    'D': 'De',
    'E': 'E',
    'F': 'Ef',
    'G': 'Ge',
    'H': 'Ha',
    'I': 'I',
    'J': 'Je',
    'K': 'Ka',
    'L': 'El',
    'M': 'Em',
    'N': 'En',
    'O': 'O',
    'P': 'Pe',
    'Q': 'Ki',
    'R': 'Er',
    'S': 'Es',
    'T': 'Te',
    'U': 'U',
    'V': 'Ve',
    'W': 'We',
    'X': 'Eks',
    'Y': 'Ye',
    'Z': 'Zet',
  };

  let result: string[] = [];

  for (const char of input.toUpperCase()) {
    if (digits[char]) {
      result.push(digits[char]);
    } else if (letters[char]) {
      result.push(letters[char]);
    } else if (char === ' ') {
      result.push('spasi');
    }
  }

  return result.join(' ');
}
