class Trie:
    def __init__(self):
        self.words = []

    def insert(self, word: str) -> None:
        self.words.append(word)

    def search(self, word: str) -> bool:
        return any(w == word for w in self.words)

    def startsWith(self, prefix: str) -> bool:
        return any(w.startswith(prefix) for w in self.words)
