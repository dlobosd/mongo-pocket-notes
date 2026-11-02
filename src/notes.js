export function parseCommand(args) {
  const [command, ...words] = args;
  if (command === 'list' && words.length === 0) return { command };
  if (command === 'add') {
    const text = words.join(' ').trim();
    if (text.length > 0 && text.length <= 1000) return { command, text };
  }
  throw new Error('Usage: add "note text" (1–1000 characters), or list');
}

export async function execute(collection, input) {
  if (input.command === 'add') {
    const result = await collection.insertOne({
      text: input.text, createdAt: new Date()
    });
    return 'Saved: ' + result.insertedId;
  }
  const notes = await collection.find({})
    .sort({ createdAt: -1, _id: -1 }).limit(20).toArray();
  return notes.length
    ? notes.map(note => note._id + ': ' + note.text).join('\n')
    : 'No notes yet.';
}
