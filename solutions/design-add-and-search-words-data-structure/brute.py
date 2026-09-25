class WordDictionary:
    def __init__(self):
        self.words = []

    def addWord(self, word: str) -> None:
        self.words.append(word)

    def search(self, p: str) -> bool:
        for w in self.words:
            if len(w) == len(p) and all(c == "." or c == x for c, x in zip(p, w)):
                return True
        return False
