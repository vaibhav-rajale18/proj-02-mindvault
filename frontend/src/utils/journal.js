export const moodOptions = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "sad", emoji: "😔", label: "Sad" },
  { value: "frustrated", emoji: "😤", label: "Frustrated" },
  { value: "calm", emoji: "😌", label: "Calm" },
  { value: "motivated", emoji: "🔥", label: "Motivated" },
  { value: "tired", emoji: "😴", label: "Tired" },
  { value: "thoughtful", emoji: "🤔", label: "Thoughtful" },
];

export const moodMap = moodOptions.reduce((acc, mood) => {
  acc[mood.value] = mood;
  return acc;
}, {});

export const normalizeTags = (tags) => {
  if (!tags) return [];
  const values = Array.isArray(tags)
    ? tags
    : String(tags)
        .split(/[,\s]+/)
        .map((item) => item.trim())
        .filter(Boolean);

  return values
    .map((tag) => tag.replace(/^[#]+/, "").replace(/[^a-zA-Z0-9-_]/g, ""))
    .filter(Boolean)
    .map((tag) => `#${tag}`)
    .filter(
      (tag, index, array) =>
        array.findIndex((item) => item.toLowerCase() === tag.toLowerCase()) ===
        index,
    );
};

export const formatTagsInput = (tagsArray) => {
  if (!Array.isArray(tagsArray) || !tagsArray.length) return "";
  return tagsArray.join(", ");
};
